# 03 — The Devise Product

## Product Position

> **Dashboards report. Devise intervenes.**

Devise is **not** a BI dashboard, **not** a CASB, **not** a DLP. It is an *adoption engine* — a system that observes AI usage, takes action to improve it, and measures the result. The entire value of Devise is in closing that loop.

---

## The Closed Loop

Three phases. Continuous. Always on.

```
       ┌──────────────┐
       │  Understand  │  ← every AI tool, every user, every task
       └──────┬───────┘
              ↓
       ┌──────────────┐
       │     Act      │  ← real-time interventions
       └──────┬───────┘
              ↓
       ┌──────────────┐
       │   Quantify   │  ← salary-calibrated ROI, attributed
       └──────┬───────┘
              └────────► back to Understand (smarter every cycle)
```

The loop never stops. Every cycle detects more, nudges smarter, measures sharper. **It is a flywheel, not a push.**

---

## Phase 1 — Understand

### What it does
- Detects every AI tool across the organization — all 6,500+, named and categorized.
- Maps who uses what, how often, in what context, for what tasks.
- Surfaces shadow AI, license waste, and adoption gaps.

### How it does it
- **Network-layer signal extraction** — reads traffic patterns from existing security infrastructure (Zscaler, Palo Alto, Netskope, etc.). No browser extensions. No API keys. No SDK instrumentation.
- **Desktop sidekick (Mac/Windows)** — for SMB customers without enterprise network gear; detects app activity at the OS layer.
- **Identity correlation** — via Microsoft Entra ID or Google Workspace; maps usage to roles in the org chart.
- **Professional Intelligence Layer** — pre-populates org structure from 800M-profile data so detection is meaningful on day zero, not after months of accumulation.

### What you see
- Live tool inventory grouped by department, role, and seniority.
- Tool-overlap maps ("3 licenses for the same job").
- Shadow AI audit (tools used outside official procurement).
- AI Opportunity Assessment — every role scored for AI automatability, with $-denominated potential.

---

## Phase 2 — Act

This is the layer that separates Devise from everything else. **It does things.** It takes behavioral intelligence and uses it to actively drive adoption, efficiency, and skill across the org.

### The Sidekick

The Sidekick is the act layer surface. Sequenced by data maturity — Tool Steering ships first with existing network data; Workflow Discovery follows with customer density; Coaching and Friction Detection layer in over time.

### Four Intervention Types

#### 1. Intelligent Tool Steering
When someone uses a suboptimal tool, the Sidekick intervenes in real time. It sees both *demand* (what they're doing) and *supply* (what the org pays for).

> *"4 engineers using ChatGPT for code tasks. You have 6 unused Cursor seats. Engineers who switched to Cursor saw 3× faster debugging. Nudging your team to switch."*
> Result: $2,400/yr in unused licenses recovered.

#### 2. Workflow Discovery & Distribution
Finds high-performing AI workflows employees built organically. Packages them. Distributes to similar roles.

> *"AI prospecting workflow discovered in Sales. 2 people saving 6 hrs/week each. 8 others doing this manually. Distributing the workflow now."*
> Result: 48 hrs/week saved org-wide.

#### 3. Personalized AI Coaching
Micro-coaching based on actual usage patterns. Knows what the individual does, what good looks like for their role, and the gap.

> *"Marketing: AI used for copy but not research. Top marketers get 3× leverage from research workflows. Delivered micro-coaching to 4 marketers on AI-powered audience research."*
> Result: Average workflows per person 2.1 → 5.7.

#### 4. Friction Detection & Removal
Spots struggling employees — high abandonment, repeated attempts, rapid tool-switching — and intervenes with specific fixes.

> *"Ops team member abandoned 3 ChatGPT sessions on the same document. Document exceeds context window. Suggested Claude with chunked approach."*
> Result: Abandoned session becomes a success.

### Where interventions appear
- Inside the Sidekick app (macOS / Windows).
- Slack / Microsoft Teams (DM nudges).
- Email digests (weekly per-team rollups).
- Salesforce / ServiceNow workflows for enterprise.

---

## Phase 3 — Quantify

Devise owns the entire measurement loop:

1. Observe the **before** state (baseline behavior).
2. Perform the **intervention** (one of the four types).
3. Observe the **after** state.
4. Calculate the **delta**.

The causal chain is never broken. *This is why Devise can prove ROI and nobody else can.* A dashboard that only samples adoption at a point in time cannot attribute change to a specific cause.

### Metrics produced

| Metric | What it measures |
|---|---|
| **Time savings** | Hours recovered per week, attributed to specific Sidekick interventions |
| **License optimization** | Redundant licenses identified; unused purchased licenses activated through steering |
| **Adoption velocity** | % of workforce effectively using AI over time; power-user density; acceleration attributed to interventions |
| **Workflow multiplication** | Distinct AI use cases per employee — the compound effect of the loop |
| **Salary-calibrated ROI** | Every metric grounded in loaded costs by role, seniority, location. "200 hours saved for legal" = "$47,000 in value." |

---

## Why the Loop Compounds

> *Adoption compounds because the loop never stops.*

- **1×** — See everything. Detect every AI tool. Map who uses what. Surface shadow AI, waste, gaps.
- **2×** — Intervene. Nudge employees to better tools. Coach on usage. Spread winning workflows.
- **4×** — Compound. Each cycle is smarter. More data, better nudges, faster coaching. The gap widens every week.

Each cycle improves detection (more tool signatures), interventions (better targeting), and measurement (cleaner attribution). Combined with cross-customer benchmarking, the engine gets sharper for every customer with each new customer onboarded.

---

## What's *Not* in the Product

We are deliberate about what we don't do:

- **No content surveillance.** We don't read individual prompts; we observe usage patterns. (Except in regulated modes — see Healthcare PHI detection.)
- **No browser extensions.** Brittle, missed coverage, user-hostile.
- **No per-endpoint agents at enterprise scale.** Network-layer is cleaner.
- **No SDK requirement.** We don't ask AI vendors to instrument anything for us.
- **No model training on customer data.** Contractually guaranteed.

---

## See Also
- [04-TECHNOLOGY-ARCHITECTURE.md](04-TECHNOLOGY-ARCHITECTURE.md) — How each phase is built
- [07-INTEGRATIONS-ECOSYSTEM.md](07-INTEGRATIONS-ECOSYSTEM.md) — Connectors that feed the engine
- [MASTER.md](MASTER.md)
