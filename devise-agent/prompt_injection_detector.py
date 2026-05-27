"""Prompt injection detector using the Superagent safety client."""

import asyncio
import logging
import os
from typing import Dict, Any

logger = logging.getLogger(__name__)


def detect_prompt_injection(prompt: str) -> Dict[str, Any]:
    """Detect whether a given prompt contains a prompt-injection attempt.

    Uses the Superagent safety client (Google Gemini backend by default).
    Returns a dict with:
      - ``injected`` (bool): True if injection was detected.
      - ``description`` (str): Human-readable reasoning.

    If ``SUPERAGENT_API_KEY`` is not set, the check is skipped and the
    prompt is treated as safe so the agent can continue operating without
    the safety service configured.
    """
    if not os.getenv("SUPERAGENT_API_KEY"):
        logger.debug("SUPERAGENT_API_KEY not set — skipping injection check")
        return {"injected": False, "description": "Safety check skipped (no API key)"}

    try:
        # Import here to avoid module-level side-effects when key is absent
        from superagent_client import chat_completion  # type: ignore

        messages = [
            {"role": "system", "content": "You are a security analyst evaluating prompts for prompt injection attacks."},
            {"role": "user", "content": prompt},
        ]
        raw = asyncio.run(chat_completion(messages))
        # Normalise the legacy "injecction" typo key if present
        injected = raw.get("injecction", raw.get("injected", False))
        return {
            "injected": bool(injected),
            "description": raw.get("description", ""),
        }
    except Exception as exc:
        logger.warning(f"Prompt injection check failed (non-fatal): {exc}")
        # Fail open — let the event proceed rather than block the agent
        return {"injected": False, "description": f"Check error: {exc}"}
