# LLM Integration Guide

This document describes how Devise-CAD integrates three external LLM tools:
**Superagent** (safety client), **Promptfoo** (prompt testing), and the
**ChatGPT System Prompts** library.

---

## 1. Superagent — Safety & Prompt-Injection Guard

### What it does
Superagent provides a `safety-agent` Python library that wraps an LLM safety
endpoint. Devise-CAD uses it to detect prompt-injection attacks before any
user-supplied text reaches the core detection pipeline.

### Files
| File | Purpose |
|------|---------|
| `devise-agent/superagent_client.py` | Async wrapper around `safety_agent.create_client()` |
| `devise-agent/prompt_injection_detector.py` | High-level `detect_prompt_injection(prompt)` helper |
| `devise-agent/prompt_library/9uwOyKoSJ_Prompt_Injection_Detector.md` | System prompt for the detector |

### Environment variables
```env
SUPERAGENT_API_KEY=<your-key>   # Required — get from Superagent dashboard
```

### Usage
```python
from devise_agent.prompt_injection_detector import detect_prompt_injection

result = detect_prompt_injection("Write a friendly greeting.")
# {"injecction": false, "description": "No injection detected"}
```

### Hook into the agent workflow
`detect_prompt_injection` is called early in the event-processing pipeline
inside `devise-agent/devise-eye/main.py` inside `_process_connection()`,
before any LLM inference is dispatched. If an injection is detected the
connection is skipped.

---

## 2. ChatGPT System Prompts Library

### What it does
The [chatgpt-system-prompt](https://github.com/LouisShark/chatgpt_system_prompt)
repository collects hundreds of real-world GPT system prompts. Devise-CAD
copies them into `devise-agent/prompt_library/` so they can be used as
reference prompts, test fixtures, or fine-tuning data.

### Folder structure
```
devise-agent/prompt_library/
├── gpts/                   ← Custom GPT system prompts
├── official-product/       ← OpenAI official product prompts
└── opensource-prj/         ← Open-source project prompts
```

### How to use
Reference any `.md` file in `prompt_library/` when constructing system
prompts for Devise-CAD's internal LLM calls:

```python
from pathlib import Path

prompt_path = Path(__file__).parent.parent / "prompt_library" / "gpts" / "some_prompt.md"
system_prompt = prompt_path.read_text()
```

---

## 3. Promptfoo — Prompt Testing & Evaluation

### What it does
[Promptfoo](https://github.com/promptfoo/promptfoo) is an open-source LLM
testing framework. Devise-CAD uses it to run automated regression tests on
the prompt-injection detector and other LLM integrations.

### Files
| File | Purpose |
|------|---------|
| `promptfoo.yml` | Test suite configuration |
| `.github/workflows/prompt-tests.yml` | CI runner for prompt tests |

### Run locally
```bash
# Install promptfoo
npm install

# Run tests
npm run test:prompts
```

### Test cases
Tests are defined in `promptfoo.yml`. Each test:
1. Sends a sample prompt through `detect_prompt_injection`.
2. Asserts the response JSON matches the expected `injecction` flag.

### Adding new tests
Edit `promptfoo.yml` to add new test cases:
```yaml
tests:
  - description: Benign prompt should not be flagged
    vars:
      prompt: "Summarise this paragraph in three bullet points."
    assert:
      - type: contains
        value: '"injecction": false'
```

---

## 4. CI/CD Integration

The GitHub Actions workflow `.github/workflows/prompt-tests.yml` runs on
every push and pull request:

1. **Promptfoo prompt tests** — `npm run test:prompts`
2. **Python unit tests** — `pytest devise-agent/devise-eye/tests/`

### Required GitHub Secrets
| Secret | Description |
|--------|-------------|
| `SUPERAGENT_API_KEY` | API key for the Superagent safety client |

---

## 5. Quick-start Checklist

- [ ] Copy `.env.example` → `.env` and fill in `SUPERAGENT_API_KEY`
- [ ] `pip install -r devise-agent/devise-eye/requirements.txt`
- [ ] `npm install` (installs `promptfoo` and `concurrently`)
- [ ] `npm run test:prompts` — verify the detector works
- [ ] `python -m pytest devise-agent/devise-eye/tests/` — run unit tests
