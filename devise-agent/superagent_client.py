"""Superagent safety client wrapper for Devise-CAD.

Uses the ``safety-agent`` PyPI package to run prompt-injection guards via
the Superagent API.  Defaults to Google Gemini 1.5-flash as the backend
model.  The SUPERAGENT_API_KEY environment variable must be set before
calling any function in this module.
"""

import os
import asyncio
import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


def _get_api_key() -> str:
    key = os.getenv("SUPERAGENT_API_KEY", "")
    if not key:
        raise EnvironmentError(
            "SUPERAGENT_API_KEY environment variable is not set. "
            "See .env.example for setup instructions."
        )
    return key


# Module-level client cache — initialised lazily
_client = None


async def _get_client():
    global _client
    if _client is None:
        from safety_agent import create_client  # type: ignore
        _client = create_client(api_key=_get_api_key())
    return _client


async def chat_completion(
    messages: List[Dict[str, str]],
    model: Optional[str] = None,
    **kwargs: Any,
) -> Dict[str, Any]:
    """Run the Superagent guard on a list of chat messages.

    Parameters
    ----------
    messages:
        List of ``{"role": ..., "content": ...}`` dicts.
    model:
        Optional Superagent model identifier.
        Defaults to ``google/gemini-1.5-flash``.

    Returns
    -------
    dict
        ``{"injecction": bool, "description": str}``
        (Note: key name preserved for backward compatibility.)
    """
    combined = "\n".join(
        msg.get("content", "")
        for msg in messages
        if msg.get("role") != "assistant"
    )
    client = await _get_client()
    model_id = model or "google/gemini-1.5-flash"
    response = await client.guard(input=combined, model=model_id)
    return {
        "injecction": response.classification == "block",
        "description": response.reasoning,
    }
