"""Detection accuracy tests for the Devise-Eye agent registry and matching logic."""

import sys
import json
from pathlib import Path

import pytest

# Add parent directory to path so imports work from tests/
sys.path.insert(0, str(Path(__file__).parent.parent))

from registry import LookupHint, Registry

REGISTRY_PATH = str(Path(__file__).parent.parent / "data" / "ai_tools_registry.json")


@pytest.fixture(scope="module")
def registry():
    reg = Registry(REGISTRY_PATH)
    return reg


# ---------------------------------------------------------------------------
# Registry loading
# ---------------------------------------------------------------------------

def test_registry_loads(registry):
    assert registry.entry_count > 100, (
        f"Expected 100+ entries, got {registry.entry_count}"
    )


def test_registry_has_meta():
    with open(REGISTRY_PATH) as f:
        data = json.load(f)
    assert "version" in data
    assert "tool_count" in data
    assert data["tool_count"] == len(data["tools"]), "tool_count mismatch"


# ---------------------------------------------------------------------------
# Domain hostname matching (parametrized for every major tool category)
# ---------------------------------------------------------------------------

HOSTNAME_CASES = [
    # (hostname_to_look_up, expected_tool_name, expected_category)

    # Consumer chat
    ("chatgpt.com",                             "ChatGPT",              "Generative AI"),
    ("chat.openai.com",                         "ChatGPT",              "Generative AI"),
    ("claude.ai",                               "Claude",               "Generative AI"),
    ("gemini.google.com",                       "Google Gemini",        "Generative AI"),
    ("perplexity.ai",                           "Perplexity AI",        "Generative AI"),
    ("grok.com",                                "Grok",                 "Generative AI"),
    ("deepseek.com",                            "DeepSeek",             "Generative AI"),
    ("mistral.ai",                              "Mistral AI",           "Generative AI"),

    # Enterprise APIs
    ("api.openai.com",                          "OpenAI API",           "Enterprise API"),
    ("api.anthropic.com",                       "Claude API",           "Enterprise API"),
    ("generativelanguage.googleapis.com",       "Gemini API",           "Enterprise API"),
    ("aiplatform.googleapis.com",               "Google Vertex AI",     "Enterprise API"),
    ("api.cohere.com",                          "Cohere API",           "Enterprise API"),
    ("api.together.xyz",                        "Together AI API",      "Enterprise API"),
    ("api.fireworks.ai",                        "Fireworks AI API",     "Enterprise API"),
    ("api.deepinfra.com",                       "DeepInfra API",        "Enterprise API"),
    ("inference.cerebras.ai",                   "Cerebras API",         "Enterprise API"),
    ("api.groq.com",                            "Groq API",             "Enterprise API"),
    ("api.mistral.ai",                          "Mistral API",          "Enterprise API"),
    ("api.perplexity.ai",                       "Perplexity API",       "Enterprise API"),
    ("api.elevenlabs.io",                       "ElevenLabs API",       "Enterprise API"),
    ("api-inference.huggingface.co",            "HuggingFace API",      "Enterprise API"),

    # Azure / AWS (wildcard subdomain matching)
    ("mycompany.openai.azure.com",              "Azure OpenAI",         "Enterprise API"),
    ("myorg.cognitiveservices.azure.com",       "Azure AI Services",    "Enterprise API"),
    ("bedrock-runtime.us-east-1.amazonaws.com","AWS Bedrock",           "Enterprise API"),
    ("bedrock-runtime.us-west-2.amazonaws.com","AWS Bedrock",           "Enterprise API"),
    ("q.us-east-1.amazonaws.com",              "Amazon Q",              "Enterprise API"),

    # AI coding assistants
    ("api2.cursor.sh",                          "Cursor AI",            "Development"),
    ("cursor.sh",                               "Cursor AI",            "Development"),
    ("copilot.github.com",                      "GitHub Copilot",       "Development"),
    ("copilot-proxy.githubusercontent.com",     "GitHub Copilot",       "Development"),
    ("codeium.com",                             "Codeium",              "Development"),
    ("api.codeium.com",                         "Codeium API",          "Development"),
    ("windsurf.ai",                             "Windsurf",             "Development"),
    ("tabnine.com",                             "Tabnine",              "Development"),
    ("continue.dev",                            "Continue.dev",         "Development"),
    ("sourcegraph.com",                         "Sourcegraph Cody",     "Development"),
    ("supermaven.com",                          "Supermaven",           "Development"),
    ("phind.com",                               "Phind",                "Development"),
    ("zed.dev",                                 "Zed Editor",           "Development"),
    ("v0.dev",                                  "Vercel V0",            "Development"),
    ("bolt.new",                                "Bolt.new",             "Development"),

    # LLM orchestration / observability
    ("smith.langchain.com",                     "LangSmith",            "AI Observability"),
    ("api.openrouter.ai",                       "OpenRouter API",       "Enterprise API"),
    ("oai.helicone.ai",                         "Helicone Proxy",       "AI Observability"),

    # Vector DBs
    ("api.pinecone.io",                         "Pinecone",             "Vector DB"),
    ("weaviate.cloud",                          "Weaviate Cloud",       "Vector DB"),
    ("api.qdrant.tech",                         "Qdrant Cloud",         "Vector DB"),
    ("api.trychroma.com",                       "Chroma",               "Vector DB"),
    ("zilliz.com",                              "Zilliz Cloud (Milvus)","Vector DB"),

    # Design / media / video
    ("midjourney.com",                          "Midjourney",           "Design/Media"),
    ("api.stability.ai",                        "Stability AI API",     "Enterprise API"),
    ("leonardo.ai",                             "Leonardo.ai",          "Design/Media"),
    ("runway.ml",                               "Runway",               "Video AI"),
    ("heygen.com",                              "HeyGen",               "Video AI"),
    ("lumalabs.ai",                             "Luma Dream Machine",   "Video AI"),
    ("synthesia.io",                            "Synthesia",            "Video AI"),

    # Audio AI
    ("elevenlabs.io",                           "ElevenLabs",           "Audio AI"),
    ("suno.ai",                                 "Suno AI",              "Audio AI"),
    ("api.deepgram.com",                        "Deepgram API",         "Audio AI"),
    ("api.assemblyai.com",                      "AssemblyAI API",       "Audio AI"),

    # Enterprise productivity
    ("substrate.office.com",                    "Microsoft 365 Copilot","Enterprise Productivity"),
    ("api.slack.com",                           "Slack AI",             "Enterprise Productivity"),
    ("api.zoom.us",                             "Zoom AI Companion",    "Enterprise Productivity"),

    # Productivity tools
    ("notion.so",                               "Notion AI",            "Productivity"),
    ("otter.ai",                                "Otter.ai",             "Productivity"),
    ("fathom.video",                            "Fathom AI Notetaker",  "Productivity"),

    # AI platforms
    ("wandb.ai",                                "Weights & Biases",     "AI Platform"),
    ("modal.com",                               "Modal",                "AI Platform"),
    ("api.e2b.dev",                             "E2B Code Sandboxes",   "AI Platform"),
    ("braintrust.dev",                          "Braintrust",           "AI Observability"),
]


@pytest.mark.parametrize("hostname,expected_tool,expected_category", HOSTNAME_CASES)
def test_registry_matches_known_tool(registry, hostname, expected_tool, expected_category):
    entry = registry.find_match(hostname)
    assert entry is not None, f"Registry missed hostname: {hostname}"
    assert entry.tool_name == expected_tool, (
        f"For {hostname}: expected '{expected_tool}', got '{entry.tool_name}'"
    )
    assert entry.category == expected_category, (
        f"For {hostname}: expected category '{expected_category}', got '{entry.category}'"
    )


# ---------------------------------------------------------------------------
# Subdomain matching (should match parent domain entries)
# ---------------------------------------------------------------------------

SUBDOMAIN_CASES = [
    ("foo.api.openai.com",          "OpenAI API"),
    ("eu.api.openai.com",           "OpenAI API"),
    ("subdomain.claude.ai",         "Claude"),
    ("us-east-1.api.pinecone.io",   "Pinecone"),
    ("prod.api.cursor.sh",          "Cursor AI"),
]


@pytest.mark.parametrize("subdomain,expected_tool", SUBDOMAIN_CASES)
def test_subdomain_matching(registry, subdomain, expected_tool):
    entry = registry.find_match(subdomain)
    assert entry is not None, f"Subdomain not matched: {subdomain}"
    assert entry.tool_name == expected_tool, (
        f"For {subdomain}: expected '{expected_tool}', got '{entry.tool_name}'"
    )


# ---------------------------------------------------------------------------
# CDN ambiguity — a shared address and process hint do not identify a tool.
# These exercise the production lookup seam, replacing the removed CDN classifier.
# ---------------------------------------------------------------------------

CDN_IPS = [
    "104.16.0.1",    # Cloudflare
    "104.21.0.1",    # Cloudflare
    "172.64.0.1",    # Cloudflare
    "162.158.0.1",   # Cloudflare
    "52.84.0.1",     # AWS CloudFront
    "54.192.0.1",    # AWS CloudFront
    "151.101.0.1",   # Fastly
    "199.232.0.1",   # Fastly
]


@pytest.mark.parametrize("cdn_ip", CDN_IPS)
def test_cdn_ip_with_unrelated_hostname_remains_unknown(registry, cdn_ip):
    result = registry.lookup(LookupHint(
        ip=cdn_ip, hostname="unrelated.example", process_name="cursor.exe"
    ))
    assert not result.is_match
    assert result.entry is None
    assert result.confidence == 0.0


@pytest.mark.parametrize("cdn_ip", CDN_IPS)
def test_cdn_ip_not_in_ip_map(registry, cdn_ip):
    entry = registry.find_match_by_ip(cdn_ip)
    assert entry is None, (
        f"CDN IP {cdn_ip} should not be in the pre-resolved IP map "
        f"(got {entry.tool_name if entry else None})"
    )


# ---------------------------------------------------------------------------
# Process hint matching
# ---------------------------------------------------------------------------

PROCESS_HINT_CASES = [
    # Process labels neither strengthen nor weaken hostname evidence. Confidence
    # is a 0..1 attribution score, replacing stale percentage/process boosting.
    ("api2.cursor.sh",                    "cursor.exe",   0.95),
    ("api2.cursor.sh",                    "cursor",       0.95),
    ("api2.cursor.sh",                    "chrome.exe",   0.95),
    ("copilot-proxy.githubusercontent.com","code.exe",    0.95),
    ("windsurf.ai",                       "windsurf.exe", 0.95),
    ("windsurf.ai",                       "windsurf",     0.95),
]


@pytest.mark.parametrize("domain,process_name,expected_confidence", PROCESS_HINT_CASES)
def test_confidence_scoring(registry, domain, process_name, expected_confidence):
    result = registry.lookup(LookupHint(hostname=domain, process_name=process_name))
    assert result.is_match, f"No match for {domain}"
    assert result.entry.domain == domain
    assert result.match_method == "hostname"
    assert result.confidence == expected_confidence, (
        f"For {domain} + {process_name}: "
        f"expected confidence {expected_confidence}, got {result.confidence}"
    )


# ---------------------------------------------------------------------------
# Process-only labels are not evidence that a connection or AI request happened.
# Migrate the removed find_by_process_hint API to the current LookupHint seam.
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("process_name", ["cursor.exe", "windsurf", "notepad.exe"])
def test_process_hint_alone_remains_unknown(registry, process_name):
    result = registry.lookup(LookupHint(process_name=process_name))
    assert not result.is_match
    assert result.entry is None
    assert result.confidence == 0.0
    assert result.match_method == "none"


# ---------------------------------------------------------------------------
# Registry integrity
# ---------------------------------------------------------------------------

def test_no_empty_domains(registry):
    empty = [e for e in registry.entries if not e.domain]
    assert not empty, f"Entries with empty domain: {len(empty)}"


def test_no_empty_tool_names(registry):
    empty = [e for e in registry.entries if not e.tool_name]
    assert not empty, f"Entries with empty tool_name: {len(empty)}"


def test_risk_levels_valid(registry):
    valid = {"low", "medium", "high"}
    invalid = [e for e in registry.entries if e.risk_level not in valid]
    assert not invalid, (
        f"Entries with invalid risk_level: {[(e.domain, e.risk_level) for e in invalid]}"
    )
