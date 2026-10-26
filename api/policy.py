"""Deterministic bounded literal matching. No hosted classifier or arbitrary regex."""
from copy import deepcopy
from typing import Annotated, Literal
from uuid import UUID
from pydantic import Field, field_validator, model_validator
from api.models import StrictModel
from api.text_inspection import DATA_CLASSES, contains_class, redact_arguments


class PolicyInput(StrictModel):
    name: Annotated[str, Field(min_length=1, max_length=128)]
    tool_name: Annotated[str, Field(min_length=1, max_length=128)] | None = None
    action: Annotated[str, Field(min_length=1, max_length=128)] | None = None
    text_pattern: Annotated[str, Field(min_length=1, max_length=256)] | None = None
    data_class: Literal["credentials", "email"] | None = None
    outcome: Literal["allow", "block", "warn", "redact", "review"]
    replacement: Annotated[str, Field(max_length=256)] = "[REDACTED]"

    @field_validator("text_pattern")
    @classmethod
    def substantive_pattern(cls, value):
        if value is not None and not value.strip():
            raise ValueError("Text pattern must not be blank")
        return value

    @model_validator(mode="after")
    def redaction_requires_pattern(self):
        if self.outcome == "redact" and not (self.text_pattern or self.data_class):
            raise ValueError("Redaction requires a literal text pattern or supported data class")
        return self


class ExecutionInput(StrictModel):
    request_id: UUID
    rpc: dict

    @field_validator("rpc")
    @classmethod
    def supported_rpc(cls, value):
        allowed = {"tools/call", "tools/list", "initialize", "ping", "notifications/initialized"}
        if set(value) - {"jsonrpc", "id", "method", "params"} or value.get("jsonrpc") != "2.0" or value.get("method") not in allowed:
            raise ValueError("Only supported JSON-RPC 2.0 methods are accepted")
        if "id" in value and (type(value["id"]) not in {str,int} or isinstance(value["id"],str) and len(value["id"]) > 128):
            raise ValueError("RPC id must be bounded string/integer")
        params = value.get("params", {})
        if not isinstance(params,dict):
            raise ValueError("RPC params must be an object")
        if value["method"] == "tools/call":
            if set(params)-{"name","arguments"} or not isinstance(params.get("name"),str) or not 1 <= len(params["name"]) <= 128 or not isinstance(params.get("arguments",{}),dict):
                raise ValueError("tools/call requires bounded name and object arguments")
        if value["method"] != "notifications/initialized" and "id" not in value:
            raise ValueError("RPC request id is required")
        def depth(node, level=0):
            if level > 12:
                raise ValueError("RPC nesting exceeds 12")
            if isinstance(node,dict):
                for item in node.values():
                    depth(item,level+1)
            elif isinstance(node,list):
                for item in node:
                    depth(item,level+1)
        depth(value)
        return value


class ContinuationInput(StrictModel):
    continuation_token: Annotated[str, Field(min_length=32,max_length=256)]


def strings(node):
    if isinstance(node,str):
        yield node
    elif isinstance(node,dict):
        for value in node.values():
            yield from strings(value)
    elif isinstance(node,list):
        for value in node:
            yield from strings(value)


def literal_spans(text, pattern):
    """Map casefold matches back to original characters, including expansions.

    A partial match inside an expansion (for example s inside sharp-s -> ss)
    removes that entire source character. Overlapping source spans collapse so
    one character is never replaced twice. Separate string values never join.
    """
    needle=pattern.casefold()
    if not needle:
        return []
    folded_parts=[]
    source_indices=[]
    for index,character in enumerate(text):
        folded=character.casefold()
        folded_parts.append(folded)
        source_indices.extend([index]*len(folded))
    folded_text="".join(folded_parts)
    spans=[]
    position=0
    while True:
        found=folded_text.find(needle,position)
        if found<0:
            break
        end=found+len(needle)
        span=(source_indices[found],source_indices[end-1]+1)
        if spans and span[0]<spans[-1][1]:
            spans[-1]=(spans[-1][0],max(spans[-1][1],span[1]))
        else:
            spans.append(span)
        position=end
    return spans


def replace_strings(node, pattern, replacement):
    if isinstance(node,str):
        parts=[]
        position=0
        for start,end in literal_spans(node,pattern):
            parts.extend((node[position:start],replacement))
            position=end
        parts.append(node[position:])
        return "".join(parts)
    if isinstance(node,dict):
        return {key:replace_strings(value,pattern,replacement) for key,value in node.items()}
    if isinstance(node,list):
        return [replace_strings(value,pattern,replacement) for value in node]
    return node


def evaluate(rpc, policies):
    decision, transformed, _ = evaluate_request(rpc, policies)
    return decision, transformed


def evaluate_request(rpc, policies):
    """Decision, transformed RPC and content-free evidence for the audit record."""
    matches=[]
    matched_ids=[]
    arguments=rpc.get("params",{}).get("arguments",{})
    argument_strings=list(strings(arguments))
    data_classes=[name for name in DATA_CLASSES if contains_class(arguments,name)]
    for item in policies:
        rule=item["rule"]
        if rule.get("tool_name") and rule["tool_name"] != rpc.get("params",{}).get("name"):
            continue
        if rule.get("action") and rule["action"] != rpc["method"]:
            continue
        if rule.get("text_pattern") and not any(literal_spans(text,rule["text_pattern"]) for text in argument_strings):
            continue
        if rule.get("data_class") and rule["data_class"] not in data_classes:
            continue
        matches.append(rule)
        if item.get("id"):
            matched_ids.append(str(item["id"]))
    evidence={"reason":"matched_policy" if matches else "no_matching_policy",
              "data_classes":data_classes,"matched_policy_ids":matched_ids}
    if not matches:
        return "block",rpc,evidence
    precedence={"allow":0,"redact":1,"warn":2,"review":3,"block":4}
    decision=max(matches,key=lambda item:precedence[item["outcome"]])["outcome"]
    transformed=deepcopy(rpc)
    for rule in matches:
        if rule["outcome"]=="redact" and rule.get("data_class"):
            params=transformed.get("params",{})
            params["arguments"]=redact_arguments(params.get("arguments",{}),rule["data_class"],rule.get("replacement","[REDACTED]"))
        if rule["outcome"]=="redact" and rule.get("text_pattern"):
            params=transformed.get("params",{})
            params["arguments"]=replace_strings(params.get("arguments",{}),rule["text_pattern"],rule.get("replacement","[REDACTED]"))
    return decision,transformed,evidence
