# 04 — Technology Architecture

The Devise Engine connects to your infrastructure, reads behavioral signals across 6,500+ AI tools, and runs a continuous loop of detection, intervention, and measurement.

The system is organized in four architectural phases, each unlocking the next.

---

## Phase 1 — Connectors

Devise connects to what you already run. Three deployment layers give the engine visibility into identity, network traffic, and business systems. Each connector unlocks a deeper level of intelligence.

**Zero-friction deployment.** Startups install a Mac/Windows app in 60 seconds. Enterprises integrate through their existing identity providers and security infrastructure. **No new agents on every endpoint. No browser extensions.**

### 1.1 Identity Provider Integration
Connect through **Microsoft Entra ID** or **Google Workspace**. Maps the org chart instantly — knows who's in engineering, sales, legal, and product without a CSV upload.

### 1.2 Network & Security Infrastructure
Integrate with **Zscaler, Palo Alto, Netskope, CrowdStrike, F5, or Checkpoint**. The engine reads network traffic patterns to detect AI tool usage across the entire org. This is the unlock that makes Devise see *everything*, including shadow AI.

### 1.3 Business System Connectors
**Salesforce** and **ServiceNow** integrations pipe AI usage data into existing workflows: ITSM tickets, compliance dashboards, executive reports.

### 1.4 Lightweight Agent (Mac/Windows)
For startups and small teams without enterprise network gear. Download, install, see everything in 60 seconds. No IT involvement. No MDM required.

---

## Phase 2 — Behavioral Signals

Once connected, the engine observes AI tool usage across the entire organization. **Not just one vendor's ecosystem.** All 6,500+ AI tools. Who's using what, how often, for what kinds of tasks, in what patterns.

The engine never starts cold. Professional intelligence from 800 million profiles enables instant team mapping and role-specific inference before observing a single AI session.

### 2.1 Network-Layer Tool Detection
Detects usage of 6,500+ AI tools by reading traffic patterns: TLS metadata, request fingerprints, DNS resolution patterns, domain heuristics. No browser extensions. No API keys. Sees everything employees use — ChatGPT, Claude, Gemini, Copilot, Cursor, Midjourney, Notion AI, Perplexity, Grammarly, Replit, v0, Bolt, Lovable, Windsurf, and the long tail.

### 2.2 Instant Team Mapping
Professional intelligence reconstructs your org chart without SSO or manual uploads. Mapped by role, department, and seniority in under 60 seconds.

### 2.3 Jobs-To-Be-Done Inference
From job title, seniority, and industry, the engine infers each person's specific tasks. A Senior Financial Analyst does predictable things (variance analysis, forecasting, deck prep). The engine knows on day one.

### 2.4 AI Opportunity Assessment
Every role scored by **automatability** of its tasks. Generates a complete assessment on day zero — the kind of analysis consultants charge six figures to produce manually. Output is a $-denominated total per department, calibrated to that org's salary bands.

### 2.5 Cross-Company Intelligence
As the installed base grows, the engine benchmarks by role across all customers. Each new customer makes the engine smarter for everyone. **A true data network effect.**

---

## Phase 3 — The Sidekick (Act Layer)

The Sidekick is the **Act** layer. It takes behavioral intelligence and uses it to actively drive adoption, efficiency, and skill development across the org. Not reporting. **Intervention.** It does things.

Four intervention types, sequenced by data maturity:

### 3.1 Intelligent Tool Steering
When someone uses a suboptimal tool, the Sidekick intervenes in real time. Sees demand (what they're doing) AND supply (what the org pays for). *"Your org has Cursor for this. Engineers who switched saw 3× faster debugging."* — Ships first; only needs network data.

### 3.2 Workflow Discovery & Distribution
Finds high-performing AI workflows built organically by pockets of employees. Packages them. Distributes to similar roles. *"Your London legal team found an AI workflow for contract review. Try it."* — Activates with customer-density.

### 3.3 Personalized AI Coaching
Micro-coaching based on actual usage patterns. Knows what the individual does, what good looks like for their role, and the gap. *"Marketers using AI for audience research save 6 hrs/week. Here's a 3-minute setup."* — Adds sophistication over time.

### 3.4 Friction Detection & Removal
Spots struggling employees: high abandonment, repeated attempts, rapid tool-switching. Intervenes with specific fixes. *"This document is too long for ChatGPT. Try Claude with this approach instead."* — Layers in last.

### Delivery Surfaces
- Devise Sidekick app (macOS / Windows)
- Slack DM
- Microsoft Teams chat
- Email digest
- Salesforce / ServiceNow workflow injection (enterprise)

---

## Phase 4 — The Loop (Measurement Layer)

Devise owns the entire measurement loop. Observe the before state. Perform the intervention. Observe the after state. Calculate the delta.

**The causal chain is never broken. This is why Devise can prove ROI and nobody else can.**

### 4.1 Time Savings
Measured from before/after session patterns. Hours recovered per week, attributed to specific Sidekick interventions.

### 4.2 License Optimization
Redundant licenses identified. Unused purchased licenses activated through Tool Steering. Real dollars saved.

### 4.3 Adoption Velocity
Percentage of workforce effectively using AI, tracked over time. Power user density. Acceleration attributed to specific interventions.

### 4.4 Workflow Multiplication
Distinct AI use cases per employee. The compound effect of the loop measured over time.

### 4.5 Salary-Calibrated ROI
Every metric grounded in realistic loaded costs by role, seniority, and location. *"200 hours saved for legal"* also means *"$47,000 in value."*

---

## Trust & Security Layer

The behavioral data Devise collects is sensitive by nature. The engine is built with enterprise-grade security at every layer. Your data never trains models. Your employees never see the data source.

- **Privacy by design.** Professional intelligence powers the experience but is never surfaced to the end user. Employees see *"AI recommendations for your role."* The data infers; it doesn't display.
- **SOC 2 Type I compliance** (Type II underway). Controls for security, availability, confidentiality. Audited annually.
- **Data residency options.** US, EU, custom regional hosting. Enterprise customers specify exactly where their data lives.
- **SSO / SCIM provisioning.** Enterprise identity management through standard protocols. Automated provisioning tied to your identity provider.

See [06-SECURITY-COMPLIANCE.md](06-SECURITY-COMPLIANCE.md) for the full security posture.

---

## Architectural Summary — Six Subsystems

The Devise Behavioral Engine is built from six subsystems:

| Subsystem | Function |
|---|---|
| **Team Mapping** | Auto-reconstructs org structure in <60 seconds |
| **Tool Detection** | Identifies usage of 6,500+ AI tools by network traffic |
| **Behavioral Analysis** | Jobs-to-be-done inference, usage scoring |
| **Intervention Engine** | Routes the right nudge to the right person at the right time |
| **Outcome Measurement** | Before/after attribution per intervention |
| **Loop Optimization** | Cross-cycle learning + cross-customer benchmarking |

The whole stack is intentionally *infrastructural*: Devise sits underneath the AI tools your team already uses and improves the value extracted from each one.

---

## Why Network-Layer Beats Every Alternative

| Approach | Coverage | Disruption | Failure mode |
|---|---|---|---|
| **SDK instrumentation** | Only AI tools that adopt your SDK | Vendor cooperation required | Misses everything not pre-wired |
| **Browser extensions** | Browser-only AI tools | Per-user install, frequent breakage | Misses desktop apps; users uninstall |
| **Per-endpoint agents** | Everything on managed devices | MDM rollout, performance hit | Misses BYOD, partner devices, contractors |
| **Self-reporting / surveys** | What people remember to report | High user friction | Decays fast; data is fiction |
| **Devise — network layer** | **Every AI tool on every device on the network** | **Single connector to existing security stack** | **None at the visibility layer; only AI tools used off-network are missed** |

---

## See Also
- [03-PRODUCT.md](03-PRODUCT.md) — Product semantics
- [07-INTEGRATIONS-ECOSYSTEM.md](07-INTEGRATIONS-ECOSYSTEM.md) — The 22 connectors
- [06-SECURITY-COMPLIANCE.md](06-SECURITY-COMPLIANCE.md) — Compliance posture
