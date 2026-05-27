# 07 — Integrations & Ecosystem

> Connects to everything you already run.

Devise plugs into your network, identity, and productivity layers to see every AI tool in use — **without agents, without proxies, without disruption.**

**22 integrations. 7 layers. Zero-friction deployment.**

---

## Layer 1 — Network Security (6)

Firewall and secure web gateway integrations that give Devise network-level visibility into every AI tool in use. **The deepest signal source — sees everything traversing the network.**

| Connector | Category | Data Devise gets |
|---|---|---|
| **Zscaler** | Zero-trust network access | Traffic logs |
| **Palo Alto Networks** | Next-gen firewall and SASE | Traffic logs |
| **Netskope** | Cloud access security broker | Traffic logs |
| **CrowdStrike** | Endpoint detection and response | Endpoint telemetry |
| **F5** | Application delivery and security | Traffic logs |
| **Checkpoint** | Network security and firewall | Traffic logs |

**Powers:** Tool Detection, Shadow AI surfacing, Tool Steering.

---

## Layer 2 — Identity & Access (2)

Identity providers that let Devise map your team structure and correlate AI usage with roles.

| Connector | Category | Data Devise gets |
|---|---|---|
| **Okta** | Identity and access management | Auth events |
| **Microsoft Entra ID** | Cloud identity and directory | Auth events |

**Powers:** Team Mapping, role-aware coaching, RBAC enforcement.

---

## Layer 3 — Productivity Suites (2)

Workplace platforms that surface how AI tools are used alongside everyday productivity apps.

| Connector | Category | Data Devise gets |
|---|---|---|
| **Google Workspace** | Productivity and collaboration suite | Usage analytics |
| **Microsoft 365** | Enterprise productivity platform | Usage analytics |

**Powers:** Context-aware coaching, workflow-pattern discovery, Copilot/Workspace AI tracking.

---

## Layer 4 — Endpoints (2)

Desktop agents that observe AI app activity directly on employee devices. **The primary route for SMB customers without enterprise network gear.**

| Connector | Category | Data Devise gets |
|---|---|---|
| **macOS** | Desktop operating system | App activity |
| **Windows** | Desktop operating system | App activity |

**Powers:** Sidekick delivery, 60-second deployment for startups, friction detection on the device.

---

## Layer 5 — Enterprise Apps (5)

Business-critical platforms where AI usage patterns reveal workflow opportunities, and where Devise's interventions can flow back into the user's daily tools.

| Connector | Category | Data Devise gets |
|---|---|---|
| **Salesforce** | CRM and sales platform | Usage data |
| **ServiceNow** | IT service management | Usage data |
| **Notion** | Workspace and documentation | Usage data |
| **Slack** | Team communication | Usage data |
| **Jira** | Project and issue tracking | Usage data |

**Powers:** Workflow Discovery (e.g., "AI prospecting workflow in Salesforce"), intervention delivery into Slack DMs, ITSM ticket integration for governance actions.

---

## Layer 6 — Observability & SIEM (2)

Monitoring platforms that receive Devise adoption metrics alongside your infrastructure telemetry.

| Connector | Category | Data Devise gets / sends |
|---|---|---|
| **Datadog** | Cloud monitoring and analytics | Log export |
| **Splunk** | Security information and event management | Log export |

**Powers:** Compliance auditing, security ops correlation, AI-incident response.

---

## Layer 7 — AI Platforms (2)

Managed AI services where Devise tracks API-level usage and model consumption — closing the loop on the "approved" side of AI usage as well as the shadow side.

| Connector | Category | Data Devise gets |
|---|---|---|
| **Microsoft Copilot** | AI assistant for Microsoft 365 | API activity |
| **AWS Bedrock** | Managed foundation model APIs | API activity |

**Powers:** Sanctioned-AI usage tracking, model-cost attribution, Tool Steering toward approved enterprise AI.

---

## Integration Philosophy

Devise's ecosystem strategy follows three rules:

1. **Read where you already are.** Every connector reads from a system the customer already runs. No new endpoint agents, no browser extensions, no proxies.
2. **Each connector unlocks a deeper level.** Identity provider → who. Network → what. Business apps → how. The more you connect, the smarter the engine.
3. **Devise writes back into existing tools.** Interventions arrive in Slack, Teams, Salesforce, ServiceNow — wherever the user already lives. Not yet another dashboard tab.

---

## Connector Pull-Through (Sales Lens)

Each connector is also a sales channel:

| Connector ecosystem | Buyer it unlocks | Common entry point |
|---|---|---|
| Zscaler / Netskope / Palo Alto | CISO, Security Architect | "You're already paying for the gateway — turn its logs into AI governance" |
| Okta / Entra ID | CIO, IT Director | "Map your org without a single CSV" |
| Microsoft 365 / Google Workspace | CIO, COO | "Track Copilot adoption against your seat purchase" |
| Salesforce | CRO, RevOps | "Find the AI prospecting workflow you didn't know your top reps built" |
| Datadog / Splunk | CISO, SecOps | "AI as another signal in your existing SIEM" |
| AWS Bedrock | CTO, Platform Lead | "Tie model spend to actual business outcomes" |

---

## Deployment by Stack

A typical enterprise deployment uses **4–6 connectors**:

1. **Identity** — Okta or Microsoft Entra ID
2. **One network connector** — Zscaler, Palo Alto, or Netskope
3. **One productivity suite** — Microsoft 365 or Google Workspace
4. **Endpoints** — macOS / Windows where relevant
5. **One enterprise app** — Slack or Salesforce, for intervention delivery
6. *(Optional)* SIEM export — Datadog or Splunk

A typical SMB deployment uses **1 connector**: the macOS or Windows sidekick. Full visibility in 60 seconds; SSO can be added later.

---

## Roadmap (Connector Expansion)

The 22-integration footprint covers >90% of enterprise stacks today. The next wave of connector expansion (telegraphed publicly):

- **HRIS** — Workday, BambooHR, Rippling (already supported for enterprise contracts; broader self-serve coming).
- **GRC platforms** — ServiceNow GRC, Drata, Vanta (for vertical-compliance customers).
- **Email / Calendar** — Outlook, Gmail (for workflow discovery from communication patterns).
- **More AI platforms** — Anthropic, OpenAI, Google Gemini APIs for first-party usage telemetry.
- **More network vendors** — Fortinet, Cisco Umbrella, Forcepoint.

---

## See Also
- [04-TECHNOLOGY-ARCHITECTURE.md](04-TECHNOLOGY-ARCHITECTURE.md) — How connectors feed the engine
- [06-SECURITY-COMPLIANCE.md](06-SECURITY-COMPLIANCE.md) — Security model for each connector
- [09-GO-TO-MARKET.md](09-GO-TO-MARKET.md) — Connector-led sales motion
