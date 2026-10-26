"""Deterministic local argument inspection: synthetic secrets only."""
import pytest
from pydantic import ValidationError
from api.policy import PolicyInput, evaluate
from api.text_inspection import inspect_text, redact_text, contains_class, redact_arguments


def test_credentials_are_patterns_not_a_claim_of_verified_secret_ownership():
    text = "Keep this prefix. api_key = 'synthetic-super-secret-123'; keep this suffix."
    spans = inspect_text(text, "credentials")
    assert spans and [text[start:end] for start, end in spans] == ["synthetic-super-secret-123"]
    assert redact_text(text, "credentials", "[removed]") == "Keep this prefix. api_key = '[removed]'; keep this suffix."
    assert inspect_text("The API key configuration is unset. No secret was provided.", "credentials") == []
    assert inspect_text("AWS example AKIAIOSFODNN7EXAMPLE", "credentials")
    assert inspect_text("sk-proj-" + "a" * 32, "credentials")


def test_email_redaction_preserves_unmatched_text_and_nested_values():
    text = "Contact example.person+pilot@example.test, then continue."
    assert redact_text(text, "email", "[email]") == "Contact [email], then continue."
    assert inspect_text("not-an-email and example.test", "email") == []
    rule = PolicyInput(name="Email rule", outcome="redact", data_class="email")
    rpc = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "echo", "arguments": {"values": [text, "ordinary"]}}}
    decision, forwarded = evaluate(rpc, [{"rule": rule.model_dump(exclude_none=True)}])
    assert decision == "redact"
    assert forwarded["params"]["arguments"]["values"] == ["Contact [REDACTED], then continue.", "ordinary"]
    assert rpc["params"]["arguments"]["values"][0] == text


def test_private_key_redaction_is_bounded_and_does_not_swallow_surrounding_content():
    key = "-----BEGIN PRIVATE KEY-----\nSYNTHETICKEYDATA\n-----END PRIVATE KEY-----"
    assert redact_text("before " + key + " after", "credentials", "[key]") == "before [key] after"
    # No invented match for an incomplete/unbounded private-key document.
    assert inspect_text("-----BEGIN PRIVATE KEY-----" + "x" * 20000, "credentials") == []


def test_data_classes_are_validated_and_combined_with_literal_conditions():
    with pytest.raises(ValidationError):
        PolicyInput(name="Unknown", outcome="block", data_class="everything")
    with pytest.raises(ValidationError):
        PolicyInput(name="No target", outcome="redact")
    rule = PolicyInput(name="Both required", outcome="block", text_pattern="external", data_class="email")
    def rpc(text):
        return {"method": "tools/call", "params": {"name": "echo", "arguments": {"text": text}}}
    policies = [{"rule": {"outcome": "allow"}}, {"rule": rule.model_dump(exclude_none=True)}]
    assert evaluate(rpc("external email example@example.test"), policies)[0] == "block"
    assert evaluate(rpc("example@example.test"), policies)[0] == "allow"
    assert evaluate(rpc("external ordinary content"), policies)[0] == "allow"


def test_declared_secret_argument_fields_are_redacted_without_token_prefixes():
    arguments = {"api_key": "synthetic-provider-value", "description": "ordinary", "nested": {"password": "short"}}
    assert contains_class(arguments, "credentials")
    assert redact_arguments(arguments, "credentials", "[removed]") == {
        "api_key": "[removed]", "description": "ordinary", "nested": {"password": "[removed]"}}


def test_short_quoted_credentials_never_consume_later_ordinary_text():
    text = "before password='short'; keep 'ordinary sentence' after"
    assert [text[start:end] for start, end in inspect_text(text, "credentials")] == ["short"]
    assert redact_text(text, "credentials", "[removed]") == "before password='[removed]'; keep 'ordinary sentence' after"
    double = 'password="a\'b"; keep "ordinary"'
    assert redact_text(double, "credentials", "[removed]") == 'password="[removed]"; keep "ordinary"'
