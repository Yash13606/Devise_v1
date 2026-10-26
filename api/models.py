"""Bounded metadata-only ingestion contract. Unknown fields are rejected."""
from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, field_validator

Text = Annotated[str, Field(min_length=1, max_length=256)]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class LocalSession(StrictModel):
    email: Annotated[str, Field(min_length=3, max_length=254)]


class Enrollment(StrictModel):
    name: Annotated[str, Field(min_length=1, max_length=128)]
    expires_in_seconds: int = Field(default=600, ge=30, le=3600)


class Exchange(StrictModel):
    enrollment_token: Annotated[str, Field(min_length=32, max_length=256)]
    hostname: Text
    os_version: Text
    agent_version: Text


class Detection(StrictModel):
    event_id: UUID
    timestamp: datetime
    tool_name: Text
    domain: Text
    category: Text
    vendor: Text
    risk_level: Literal["low", "medium", "high"]
    source: Text
    process_name: Annotated[str, Field(max_length=256)]
    evidence_method: Text
    confidence: float = Field(ge=0, le=1, allow_inf_nan=False)

    @field_validator("timestamp")
    @classmethod
    def aware_timestamp(cls, value):
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("timestamp must have a timezone")
        return value


class Batch(StrictModel):
    schema_version: Literal[1]
    events: list[Detection] = Field(min_length=1, max_length=100)


class Heartbeat(StrictModel):
    agent_version: Text
    os_version: Text
    queue_depth: int = Field(ge=0, le=100000)
    monitoring_enabled: bool
    consent_version: Annotated[str, Field(max_length=128)]
    registry_version: Annotated[str, Field(max_length=128)]
    config_version: int = Field(ge=0)
