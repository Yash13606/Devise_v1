"""Deterministic registry contract tests; no real DNS or monitoring is used."""

import json
from pathlib import Path
import socket
import sys

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))

from registry import LookupHint, Registry


@pytest.fixture
def registry(tmp_path):
    path = tmp_path / "registry.json"
    path.write_text(json.dumps({"tools": [
        {"domain": "tool.example", "tool_name": "Consumer"},
        {"domain": "api.tool.example", "tool_name": "API"},
        {"domain": "eu.api.tool.example", "tool_name": "Regional API"},
    ]}), encoding="utf-8")
    return Registry(str(path))


@pytest.mark.parametrize("hostname", ["eu.api.tool.example", "sub.eu.api.tool.example"])
def test_longest_hostname_match_wins_over_earlier_parent(registry, hostname):
    result = registry.lookup(LookupHint(hostname=hostname))
    assert result.is_match
    assert result.entry.tool_name == "Regional API"
    assert result.entry.domain == "eu.api.tool.example"


@pytest.mark.parametrize("hostname", [
    "nottool.example", "tool.example.attacker.example", "api-tool.example", ""
])
def test_hostname_match_requires_domain_label_boundary(registry, hostname):
    assert not registry.lookup(LookupHint(hostname=hostname)).is_match


def test_most_specific_match_is_independent_of_registry_order(registry):
    registry.entries.reverse()
    result = registry.lookup(LookupHint(hostname="EU.API.TOOL.EXAMPLE"))
    assert result.entry.tool_name == "Regional API"


@pytest.mark.parametrize("ip", ["104.16.0.1", "203.0.113.10", "2001:db8::1"])
def test_one_dns_claim_does_not_prove_dedicated_ip_ownership(registry, monkeypatch, ip):
    # An unregistered non-AI site may share this address even when only one
    # registry domain resolves to it. Include IPv6 and an unknown CDN address.
    def resolve(domain, port):
        if domain == "api.tool.example":
            return [(socket.AF_INET6 if ":" in ip else socket.AF_INET,
                     socket.SOCK_STREAM, socket.IPPROTO_TCP, "", (ip, 0))]
        raise socket.gaierror("No DNS answer")

    monkeypatch.setattr(socket, "getaddrinfo", resolve)
    registry.warm_cache()

    for hint in (LookupHint(ip=ip), LookupHint(ip=ip, process_name="cursor.exe"),
                 LookupHint(ip=ip, hostname="unrelated.example")):
        result = registry.lookup(hint)
        assert not result.is_match
        assert result.entry is None
        assert result.confidence == 0.0
    assert registry.find_match_by_ip(ip) is None


def test_dns_refresh_cannot_preserve_an_old_ip_attribution(registry, monkeypatch):
    ip = "203.0.113.20"
    answers = {"api.tool.example": ip}

    def resolve(domain, port):
        if domain in answers:
            return [(socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP,
                     "", (answers[domain], 0))]
        raise socket.gaierror("No DNS answer")

    monkeypatch.setattr(socket, "getaddrinfo", resolve)
    registry.warm_cache()
    answers["tool.example"] = ip  # Address becomes visibly shared on refresh.
    registry.warm_cache()
    assert registry.find_match_by_ip(ip) is None
    assert not registry.lookup(LookupHint(ip=ip)).is_match


def test_hostname_evidence_still_identifies_tool_on_shared_ip(registry, monkeypatch):
    ip = "104.16.0.1"
    monkeypatch.setattr(socket, "getaddrinfo", lambda domain, port: [
        (socket.AF_INET, socket.SOCK_STREAM, socket.IPPROTO_TCP, "", (ip, 0))
    ])
    registry.warm_cache()
    result = registry.lookup(LookupHint(ip=ip, hostname="api.tool.example"))
    assert result.is_match
    assert result.entry.tool_name == "API"
    assert result.match_method == "hostname"
    assert 0.0 < result.confidence <= 1.0
