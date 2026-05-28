# Devise — Security, Compliance & Ecosystem

> Built on trust. Verified by design.
> Built for the CISO conversation before the deal closes.

The behavioral data Devise collects is sensitive by nature. Security and compliance are not features — they're the foundation the rest of the product sits on.

---

## Certifications

| Standard | Status | What it covers |
|---|---|---|
| **SOC 2 Type I** | Certified | Security, availability, and confidentiality controls, audited by independent third party |
| **SOC 2 Type II** | Underway | Operational evidence over time |
| **HIPAA** | Compliant | Healthcare data protection requirements; BAAs available for enterprise |
| **GDPR** | Ready | Full compliance with EU data protection regulations; DPAs available on request |

All current documentation is published in the Devise Trust Center.

---

## Data Protection

### Encryption
- **In transit:** TLS 1.3.
- **At rest:** AES-256.
- **BYOK (Bring Your Own Key)** available for enterprise customers requiring additional control.

### Data Residency
- **US-based hosting** (default).
- **EU-based hosting** for European customers.
- **Fully on-premises deployment** for the most sensitive environments.
- **Zero egress** — your data never leaves your chosen region.

### No Model Training on Your Data
Inputs, outputs, and documents from customer environments are never used to train AI models. Contractually guaranteed in every MSA.

### Data Retention
- Configurable retention periods aligned with customer policies and regulatory obligations.
- Defaults to industry-standard 13 months for behavioral telemetry.
- Customer can purge at any time; export available on offboarding.

---

## Access Control

### Enterprise Authentication
- **SSO** via SAML 2.0 and OIDC.
- **SCIM** automated provisioning tied to the customer's identity provider (Okta, Microsoft Entra ID, Google Workspace).
- **Fine-grained RBAC** — admin, viewer, compliance officer, departmental scope.

### Zero-Trust Architecture
- Access is always verified, limited, and logged. No implicit trust.
- Every action — admin or user — appears in the audit log.
- Just-in-time elevation for sensitive operations.

### Audit Logging
- Every event in the platform is logged with user, timestamp, source IP, action, and target.
- Logs are exportable in SIEM-friendly formats (Datadog, Splunk integrations).
- Full visibility for compliance reviews and regulator examinations.

---

## Operational Security

- **Annual third-party penetration tests** by top-tier security firms across the full platform.
- **Continuous vulnerability scanning** of all hosted infrastructure.
- **Bug bounty program** for ongoing external scrutiny.
- **Incident response** with documented SLAs and customer-notification timelines.

---

## Privacy by Design

> "Employees see 'AI recommendations for your role.' The data infers, it doesn't display."

The Professional Intelligence Layer (used to map team structure and infer jobs-to-be-done) powers the experience but is never surfaced to end users. Employees never see raw inference data; they see useful, role-relevant recommendations.

Practically, this means:
- A salesperson coached on AI prospecting sees: "Try this workflow — 6 hrs/wk for similar roles."
- They do not see: "Inferred role: Senior SDR, Mid-Market segment, US East Region."
- The first is useful. The second would be creepy. Devise only ships the first.

---

## AI Standards Alignment

Devise is aligned with all major AI security and governance frameworks — not as marketing claims but as concrete control mappings published in the Trust Center.

| Framework | What it covers | Why Devise aligns |
|---|---|---|
| **OWASP LLM Top 10** | Critical LLM vulnerabilities (prompt injection, training data poisoning, etc.) | Protection across all 10 listed risks |
| **NIST AI RMF** | AI Risk Management Framework | Governance posture maps to RMF Govern / Map / Measure / Manage functions |
| **ISO 42001** | AI management system standards | Aligned process for AI governance and lifecycle |
| **MITRE ATLAS** | Adversarial AI attack techniques | Defense-in-depth against adversarial AI |
| **AIUC-1** | AI User Controls | Control surface for end-user AI interactions |
| **EU AI Act** | European AI regulatory requirements | Ready for compliance obligations as they enter force |

---

## Vertical Compliance Add-ons

Devise core gives any customer the SOC 2 + GDPR + HIPAA-ready posture. For regulated industries, additional vertical packages layer on top:

### Healthcare — HIPAA + OCR Readiness
- Business Associate Agreement (BAA) executed.
- PHI detection rules flag protected health information entering AI tools in real time.
- Blocked interactions are redirected to approved, HIPAA-compliant alternatives.
- Full audit trail for OCR examinations.
- EHR system integration (e.g., Epic-compatible flows).

### Financial Services — SEC, FINRA, PCI-DSS
- Every AI interaction logged with full audit metadata: user, department, tool, timestamp, data classification.
- Reports map directly to SEC examination priorities and FINRA supervisory requirements.
- Exportable to existing GRC platforms.
- Trade-floor isolation: data isolation per trading desk / advisory book.

### Professional Services — Ethical Walls
- Data isolation per practice and client engagement.
- Ethical walls enforced automatically — preventing AI workflow cross-pollination across conflicting engagements.
- Per-partner dashboard with practice and matter-level slicing.

---

## What Customers Get During Security Review — The CISO Pack

1. SOC 2 Type I report (current; Type II as available).
2. Penetration test summary letter from current vendor.
3. Data-flow diagram with deployment-specific connectors.
4. DPA (GDPR) and BAA (HIPAA) templates.
5. Sub-processor list.
6. Incident response and breach-notification playbook.
7. AI standards alignment matrix (OWASP / NIST / ISO / MITRE / EU AI Act).
8. Reference customers and case studies from the same vertical (under NDA).

The pack is intended to compress a normal 90-day security review to under 30 days.

---

## What Devise Will Never Do

- **Train on customer data.** Contractually prohibited.
- **Sell anonymized customer data.** Even aggregated benchmarks are opt-in.
- **Send data outside the customer's chosen region.** Period.
- **Surface raw profile data to end users.** The intelligence is used inside the engine; users see outcomes.
- **Operate without an audit trail.** Every action is loggable.

---

## Ecosystem — 22 Integrations Across 7 Layers

Devise plugs into your network, identity, and productivity layers — without agents, without proxies, without disruption.

### Layer 1 — Network Security (6)

| Connector | Category | Data Devise gets |
|---|---|---|
| **Zscaler** | Zero-trust network access | Traffic logs |
| **Palo Alto Networks** | Next-gen firewall and SASE | Traffic logs |
| **Netskope** | Cloud access security broker | Traffic logs |
| **CrowdStrike** | Endpoint detection and response | Endpoint telemetry |
| **F5** | Application delivery and security | Traffic logs |
| **Checkpoint** | Network security and firewall | Traffic logs |

Powers: Tool Detection, Shadow AI surfacing, Tool Steering.

### Layer 2 — Identity & Access (2)

| Connector | Category | Data Devise gets |
|---|---|---|
| **Okta** | Identity and access management | Auth events |
| **Microsoft Entra ID** | Cloud identity and directory | Auth events |

Powers: Team Mapping, role-aware coaching, RBAC enforcement.

### Layer 3 — Productivity Suites (2)

| Connector | Category | Data Devise gets |
|---|---|---|
| **Google Workspace** | Productivity and collaboration suite | Usage analytics |
| **Microsoft 365** | Enterprise productivity platform | Usage analytics |

Powers: Context-aware coaching, workflow-pattern discovery, Copilot/Workspace AI tracking.

### Layer 4 — Endpoints (2)

| Connector | Category | Data Devise gets |
|---|---|---|
| **macOS** | Desktop operating system | App activity |
| **Windows** | Desktop operating system | App activity |

Powers: Sidekick delivery, 60-second deployment for startups, friction detection on the device.

### Layer 5 — Enterprise Apps (5)

| Connector | Category | Data Devise gets |
|---|---|---|
| **Salesforce** | CRM and sales platform | Usage data |
| **ServiceNow** | IT service management | Usage data |
| **Notion** | Workspace and documentation | Usage data |
| **Slack** | Team communication | Usage data |
| **Jira** | Project and issue tracking | Usage data |

Powers: Workflow Discovery, intervention delivery into Slack DMs, ITSM ticket integration.

### Layer 6 — Observability & SIEM (2)

| Connector | Category | Data Devise gets / sends |
|---|---|---|
| **Datadog** | Cloud monitoring and analytics | Log export |
| **Splunk** | Security information and event management | Log export |

Powers: Compliance auditing, security ops correlation, AI-incident response.

### Layer 7 — AI Platforms (2)

| Connector | Category | Data Devise gets |
|---|---|---|
| **Microsoft Copilot** | AI assistant for Microsoft 365 | API activity |
| **AWS Bedrock** | Managed foundation model APIs | API activity |

Powers: Sanctioned-AI usage tracking, model-cost attribution, Tool Steering toward approved enterprise AI.

---

## Integration Philosophy

1. **Read where you already are.** Every connector reads from a system the customer already runs. No new endpoint agents, no browser extensions, no proxies.
2. **Each connector unlocks a deeper level.** Identity provider → who. Network → what. Business apps → how. The more you connect, the smarter the engine.
3. **Devise writes back into existing tools.** Interventions arrive in Slack, Teams, Salesforce, ServiceNow — wherever the user already lives.

---

## Deployment by Stack

**Typical enterprise deployment (4–6 connectors):**
1. Identity — Okta or Microsoft Entra ID
2. One network connector — Zscaler, Palo Alto, or Netskope
3. One productivity suite — Microsoft 365 or Google Workspace
4. Endpoints — macOS / Windows where relevant
5. One enterprise app — Slack or Salesforce, for intervention delivery
6. (Optional) SIEM export — Datadog or Splunk

**Typical SMB deployment (1 connector):** the macOS or Windows sidekick. Full visibility in 60 seconds; SSO can be added later.

---

## Connector Expansion Roadmap

The 22-integration footprint covers >90% of enterprise stacks today. Next wave:

- **HRIS** — Workday, BambooHR, Rippling (already supported for enterprise contracts; broader self-serve coming).
- **GRC platforms** — ServiceNow GRC, Drata, Vanta (for vertical-compliance customers).
- **Email / Calendar** — Outlook, Gmail (for workflow discovery from communication patterns).
- **More AI platforms** — Anthropic, OpenAI, Google Gemini APIs for first-party usage telemetry.
- **More network vendors** — Fortinet, Cisco Umbrella, Forcepoint.

---

## AI Tool Coverage — What Devise Sees

Devise detects 6,500+ AI tools across every category of enterprise usage:

| Category | Example Tools Covered |
|---|---|
| **AI Assistants** | ChatGPT, Claude, Gemini, Copilot, Perplexity, You.com, Bing Chat |
| **AI Coding** | Cursor, GitHub Copilot, Replit, Windsurf, Codeium, Tabnine, v0, Bolt, Lovable |
| **AI Image** | Midjourney, DALL-E, Leonardo, Stable Diffusion, Adobe Firefly, Canva AI |
| **AI Writing** | Grammarly, Jasper, Copy.ai, Notion AI |
| **AI Research** | Perplexity, Elicit, Consensus |
| **Productivity** | Google Workspace, Microsoft 365, Notion, Figma, Canva, Airtable |
| **Communication** | Slack, Microsoft Teams, Discord, Zoom |
| **Cloud Storage** | Google Drive, OneDrive, Dropbox |
| **Development** | GitHub, Linear, Jira |
| **Security** | All network security tools (as connectors, not targets) |
| **Browsers** | All browser-based AI tool usage detected via network layer |

Every tool is named, categorized, and mapped to the user, role, and department using it.
