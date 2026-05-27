#!/usr/bin/env python3
"""
Promptfoo provider script for the Devise-CAD prompt-injection detector.

Promptfoo calls this script with the rendered prompt as the first argument.
This script prints a JSON result to stdout.

Usage (invoked by promptfoo):
    python run_detector.py "<rendered prompt>"
"""

import sys
import json
import os

# Make the devise-agent package importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "devise-agent"))

from prompt_injection_detector import detect_prompt_injection  # noqa: E402


def main():
    if len(sys.argv) < 2:
        result = {"injected": False, "description": "No prompt supplied"}
    else:
        prompt = sys.argv[1]
        result = detect_prompt_injection(prompt)

    print(json.dumps(result))


if __name__ == "__main__":
    main()
