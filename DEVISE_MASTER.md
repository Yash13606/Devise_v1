# Devise — Master Product & Concept Document

> **Version:** 1.0  
> **Status:** Living Document  
> **Scope:** Full product definition, strategic rationale, feature breakdown, coverage scope, security glossary, governance frameworks, and technical architecture

---

## Table of Contents

1. [Vision & Mission](#1-vision--mission)
2. [The Problem: The Enterprise AI Visibility Gap](#2-the-problem-the-enterprise-ai-visibility-gap)
3. [The Core Philosophy: An Engine, Not a Dashboard](#3-the-core-philosophy-an-engine-not-a-dashboard)
4. [The Three-Phase Loop: Understand → Act → Quantify](#4-the-three-phase-loop-understand--act--quantify)
5. [The Three Product Pillars](#5-the-three-product-pillars)
6. [Shadow AI: The New Shadow IT](#6-shadow-ai-the-new-shadow-it)
7. [Agentic AI & The Shifting Security Model](#7-agentic-ai--the-shifting-security-model)
8. [From Acceptable Use to Enforceable Policy](#8-from-acceptable-use-to-enforceable-policy)
9. [AI Accountability: The Ownership Gap](#9-ai-accountability-the-ownership-gap)
10. [Build vs. Buy: AI Observability Decision Framework](#10-build-vs-buy-ai-observability-decision-framework)
11. [Employee-Level AI Observability](#11-employee-level-ai-observability)
12. [The 30-Day CISO Rollout Plan](#12-the-30-day-ciso-rollout-plan)
13. [Coverage: AI Tools Monitored](#13-coverage-ai-tools-monitored)
14. [Coverage Tiers: Network vs. Full Trace](#14-coverage-tiers-network-vs-full-trace)
15. [Data Types Monitored](#15-data-types-monitored)
16. [Compliance Frameworks Covered](#16-compliance-frameworks-covered)
17. [Security & AI Governance Glossary](#17-security--ai-governance-glossary)
18. [Technical Architecture](#18-technical-architecture)
19. [Key Metrics & Business Impact](#19-key-metrics--business-impact)
20. [Target Personas & Use Cases](#20-target-personas--use-cases)
21. [Strategic Positioning](#21-strategic-positioning)
22. [Roadmap Concepts](#22-roadmap-concepts)

---

## 1. Vision & Mission

### Vision
**Devise is the AI Adoption Engine for every company.**

We built the system that takes companies from *"we bought AI"* to *"our people are measurably better because of AI."*

### Mission
To close the enterprise AI visibility gap — providing every organization with complete, real-time observability over every AI tool used across their workforce, enforcing governance policies dynamically, and proving the financial return on AI investment.

### The One-Line Summary
> **Devise sees every AI tool your team uses, drives better adoption, and proves the savings.**

### Core Values
- **Software should do things.** Not just display dashboards.
- **Trust is the architecture.** You cannot govern what you cannot see.
- **Prove everything.** Every claim is backed by auditable data.

---

## 2. The Problem: The Enterprise AI Visibility Gap

### The Scale of the Problem

| Metric | Figure | Source |
|--------|--------|--------|
| Global generative AI spending (2026) | **$2.5B** | Gartner, 2026 — 4× increase over 2025 |
| AI in use procured outside designated channels | **~50%** (Shadow AI) | MIT / Fortune — Enterprise AI audit data |
| Average AI tools in active use per enterprise | **200+** when audited | Deloitte — Agentic AI ROI study |
| AI pilots that fail to reach production | **95%** | Industry average |
| Employees who save meaningful time with AI | **only 5%** | Deloitte ROI study |

### What Organizations Cannot Answer Today

The following questions are unanswered in most enterprises today:

- Which AI tools are employees actually using?
- Which applications are calling external models in production?
- What data is leaving the organization, and under what circumstances?
- If asked to demonstrate compliance tomorrow, could we do so with confidence?
- Who approved this AI integration?
- Who is accountable when something goes wrong?

### Why the Visibility Gap Exists

AI adoption did not follow a planned rollout. It happened organically:

- Engineers embedded models directly into product pipelines
- Employees downloaded browser extensions and desktop apps
- Product teams connected customer-facing workflows to external LLM APIs
- Platform teams experimented with agentic systems

None of this was governed. None of this was visible. And it happened **faster than security, compliance, or IT could respond.**

### Why Traditional Controls Don't Work on AI

Traditional enterprise security relied on one assumption: **systems are governable because they are observable.** Applications were static, traffic patterns were predictable, and controls were enforced at known boundaries.

AI breaks this at its foundation:

- LLMs are **dynamic systems** combining user intent, external data, probabilistic reasoning, and downstream actions in real time
- A single AI interaction can involve multiple providers, multiple data sources, and multiple execution paths — none of which are fully captured by traditional logs
- AI risk is **contextual** — the same prompt can be harmless or catastrophic depending on what data it includes and what the system is allowed to do next

Extending existing tools (CASBs, DLP, endpoint policies) into AI doesn't work. They were not designed to understand what makes AI interactions risky.

### The False Choice

Without visibility, organizations face an impossible decision:
- **Slow adoption** to reduce risk — but you lose competitive advantage
- **Move fast and hope** nothing breaks — but you accumulate invisible exposure

Devise eliminates this false choice.

---

## 3. The Core Philosophy: An Engine, Not a Dashboard

### Why "Engine" Not "Dashboard"

A dashboard shows you what happened. An engine **changes what happens**.

Devise is built as a **closed-loop system** — not a reporting tool. The difference:

| Dashboard | Engine |
|-----------|--------|
| Shows metrics | Changes behavior |
| Reactive | Proactive |
| Reports incidents | Prevents them |
| Requires human action | Automates interventions |
| Static snapshots | Continuous loop |

### The Bottleneck Is Not Technology. It's Human Behavior.

95% of AI pilots fail. The reason is not the technology — it is **human behavior at scale**. Behavior change requires a system, not a strategy deck. Devise is that system.

---

## 4. The Three-Phase Loop: Understand → Act → Quantify

The entire Devise product runs on a single continuous loop — three phases that feed into each other, running permanently in the background.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         UNDERSTAND ──────► ACT ──────► QUANTIFY            │
│              ▲                               │              │
│              └───────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1: Understand

**Goal:** See every AI tool across your organization.

- Who uses what, how often, and for what tasks
- All 6,500+ AI tools detected automatically
- Real-time adoption metrics by team, department, and application
- Network-level and full-trace capture where available
- Shadow AI detection — tools used without IT approval
- Data sensitivity classification in prompts and responses
- Cost attribution per tool, per team, per user
- **Interactive Knowledge Graphs (Understand Anything)** — Navigate internal AI dependencies and structural code via a visual graph and multi-agent pipeline

**Key Questions Answered:**
- What AI tools are being used?
- By whom?
- With what data?
- At what cost?
- With what frequency?

### Phase 2: Act

**Goal:** Steer employees to better tools and enforce policy in real time.

- Push workflows to preferred, approved AI tools
- Coach individual employees on safer/better alternatives
- Enforce governance policies dynamically at the system boundary
- Block high-risk interactions without blocking productivity
- Alert security teams to policy violations
- Remove friction where adoption is lagging
- Intervene when sensitive data approaches an external model

**Key Actions:**
- Tool steering (redirect to approved alternatives)
- Workflow coaching (just-in-time guidance)
- Policy enforcement (real-time, contextual)
- Data loss prevention (at the AI boundary)
- Anomaly alerting (unusual patterns flagged immediately)

### Phase 3: Quantify

**Goal:** Measure the real business value of AI adoption.

- Time saved per employee, per team, per workflow
- Licenses optimized (eliminate unused/duplicate tools)
- Adoption velocity tracked over time
- ROI expressed in real, auditable dollars
- Compliance posture scored and reported
- Risk reduction quantified

**Key Metrics:**
- `$128K` average waste found per organization
- Time-savings proved via behavioral data
- License consolidation opportunities identified
- Audit-ready reports generated automatically

---

## 5. The Three Product Pillars

### Pillar 1: Pulse — Real-Time Adoption Intelligence

**What it is:** Real-time monitoring of exactly how AI is being used across every team, department, and application.

**What it provides:**
- Live feed of AI tool connections as they happen
- Adoption rates by department, team, and user
- Tool usage frequency and session length
- Shadow AI detection (unapproved tool usage flagged automatically)
- Trend analysis over time (adoption velocity curves)
- Benchmarking against organizational targets

**How it works:**
- Lightweight desktop agent installed on employee machines
- Monitors network connections at the OS level
- No surveys. No guesswork. Just data.
- Detects 6,500+ AI tools by domain, IP range, and process signature

### Pillar 2: Spend — Cost Consolidation & License Optimization

**What it is:** A single view of all fragmented AI expenditures across every tool, team, and vendor.

**What it provides:**
- Consolidated AI spend across all departments
- Per-tool, per-team, per-user cost attribution
- Unused license identification
- Duplicate tool detection (same function, multiple subscriptions)
- Budget forecasting based on adoption trends
- ROI calculation tied directly to time savings

**Key insight:** The average enterprise has 200+ AI tools in active use. Without consolidation, finance and IT have no idea what is being spent, by whom, on what.

### Pillar 3: Oversight — Governance, Control & Compliance

**What it is:** Dynamic policy enforcement and compliance reporting across all AI usage.

**What it provides:**
- Contextual policy enforcement (allow/warn/block based on data sensitivity)
- Real-time alerting on policy violations
- Audit trails for every AI interaction
- Compliance reporting for SOC 2, GDPR, HIPAA, ISO 27001, and more
- Data classification (PII, PHI, financial data, IP detected automatically)
- Governance dashboards for CISOs, legal, and compliance teams

**The core principle:** Governance must operate at the same speed and complexity as the systems it governs. A policy that cannot be monitored cannot be enforced.

---

## 6. Shadow AI: The New Shadow IT

### What Is Shadow AI?

Shadow AI is any AI tool used within an organization without IT's knowledge, approval, or oversight.

It is the direct successor to Shadow IT — but with a critical difference:

> **Shadow IT moved applications. Shadow AI moves data.**

When an employee uses an unapproved AI tool, they are not just circumventing IT policy — they are **sending organizational data to an external model** that the organization has no control over, no visibility into, and no contractual protection from.

### Why Shadow AI Is Worse Than Shadow IT

| Shadow IT | Shadow AI |
|-----------|-----------|
| Application risk | Data exposure risk |
| Network/access risk | Sensitive data processed externally |
| Manageable with CASB | Invisible to traditional controls |
| Detectable at firewall level | Hidden in encrypted HTTPS traffic |
| Relatively static | Changes daily as new tools emerge |

### The Scale of Shadow AI

- **50%** of AI in enterprise use is procured outside designated channels
- **200+** AI tools discovered per enterprise when audited (vs. ~10-20 known to IT)
- New AI tools launch daily — coverage requires continuous, automated detection

### Why Employees Use Shadow AI

Shadow AI is not malicious. It is driven by:
- Genuine productivity gains from using AI tools
- Organizational approval processes that are too slow
- Lack of approved alternatives for specific use cases
- Personal accounts used at work (ChatGPT, Claude, Gemini)
- AI embedded invisibly in SaaS products (Notion AI, Grammarly, etc.)

### What Devise Does About It

Devise detects Shadow AI at the network level — no surveys, no self-reporting. Every AI tool connection is captured, attributed to a user and team, classified by risk, and surfaced to IT and security in real time.

---

## 7. Agentic AI & The Shifting Security Model

### The Fundamental Shift

Traditional AI: **Generates text. Humans decide what to do with it.**

Agentic AI: **Takes action. The agent decides what to do.**

> AI agents do not merely respond. They act. They browse the web, call APIs, write files, trigger workflows, and make decisions that have real operational consequences.

This is not a future concern. It is already happening in production systems today.

### What Agentic AI Can Do

Agentic AI systems, once given authority:
- Browse the internet autonomously
- Call external APIs and services
- Write and execute code
- Read and modify files
- Send emails and messages
- Trigger automated workflows
- Make decisions across multiple systems — faster than humans can intervene

### Why Traditional Security Assumptions No Longer Apply

Enterprise security always depended on a clear chain of accountability:
- A **user** performs an action
- An **application** executes it
- **Logs** record what happened
- **Controls** are enforced at known boundaries

AI agents blur every part of this chain:
- Actions may be triggered by **inferred intent** rather than explicit instruction
- Decisions may emerge from intermediate reasoning steps that are **not logged by default**
- Tool calls may **cascade across systems faster than human oversight can intervene**

### The Hidden Risk of "Well-Behaved" Agents

The most dangerous agents are the ones that behave exactly as designed. An agent that faithfully follows its instructions can still exceed its intended scope if:

- Those instructions are interpreted too broadly
- Context changes in unexpected ways
- Access permissions are overly permissive

> A tool-enabled agent does not need to be compromised to cause harm. It only needs access.

### Why Prompt-Level Controls Are Insufficient

Prompt engineering and instruction-based guardrails are necessary but fragile. Agents:
- Operate over extended periods
- Ingest new context dynamically
- Encounter untrusted inputs (prompt injection)
- Adapt their plans based on intermediate results

A single injected instruction or ambiguous signal can redirect an agent's behavior in ways that prompts alone cannot reliably prevent.

### The Correct Control Posture: External Enforcement

Control cannot rely on the agent's own reasoning. Safeguards must operate **outside** the model:

1. **Constrain what tools agents can access** — least-privilege principle
2. **Define conditions for access** — context-aware authorization
3. **Specify authority levels** — what the agent may decide vs. what requires human approval
4. **Enforce policy at execution time** — not by trusting self-regulation
5. **Log every meaningful decision** — so actions can be reviewed, explained, and defended

### What Devise Does for Agentic AI

- Monitors every tool call an agent makes
- Detects when agents exceed authorized scope
- Maintains immutable audit trails of autonomous decisions
- Surfaces unusual agent behavior patterns
- Enforces firewall policies on agentic network connections

---

## 8. From Acceptable Use to Enforceable Policy

### The Governance Gap

Most enterprises already have an AI policy. It is thoughtful, approved by legal and compliance, and referenced in onboarding. **And it governs almost nothing.**

The reason is not effort or seriousness. It is that **AI has changed what governance needs to do.**

### Why Traditional Policy Models Break Down with AI

Enterprise policy was designed for systems that behave predictably. AI does not:

- The same model can be used safely in one context and dangerously in another
- The same prompt can be harmless or catastrophic depending on the data it includes
- A static document cannot evaluate context in real time
- A policy that cannot be monitored **cannot be enforced**

### The Three Questions Enforceable AI Policy Must Answer in Real Time

1. **Who** is using AI, and in what capacity?
2. **What data** is being sent, processed, or generated?
3. **What actions or decisions** result from that interaction?

Answering these requires observability. Without it, governance is aspirational, not operational.

### Contextual Enforcement vs. Universal Rules

Effective governance is not rigid restriction. It is **contextual enforcement**:

| Risk Level | Response |
|------------|----------|
| Low-risk tasks | Allow unrestricted AI usage |
| Sensitive interactions | Require warnings / additional authorization |
| High-risk behaviors | Block automatically |
| Compliance-relevant interactions | Log and audit mandatory |

This nuance is impossible without understanding intent, data sensitivity, and downstream impact at the moment of interaction.

### Why Auditability Is As Important As Prevention

Even the best controls will not prevent every edge case. Enforceable policy must also be **auditable** — able to answer after the fact:

- How was AI used?
- Were policies followed?
- What data was involved?
- Who approved this?

Without an audit trail, these become speculative. With one, they become straightforward.

### Regulatory Direction

This is not just best practice — it is the direction of emerging regulatory regimes:
- **NIST AI RMF** — emphasizes traceability, monitoring, and accountability
- **EU AI Act** — requires demonstrable controls for high-risk AI systems
- **SOC 2 / ISO 27001** — audit evidence requirements extend to AI usage
- **GDPR / CCPA / HIPAA** — data processed by AI models is still subject to all existing privacy laws

---

## 9. AI Accountability: The Ownership Gap

### The Problem Nobody Wants to Own

When an AI system causes harm — a data leak, a flawed recommendation, a compliance failure — the standard question is: **who is accountable?**

In most enterprises, the answer is: **nobody clearly.**

Responsibility fragments across:
- The **employee** who initiated the interaction
- The **AI model** that processed it
- The **third-party vendor** that hosts it
- The **downstream system** that consumed the output
- The **platform team** that embedded the AI

Each component "behaved as expected." No single team feels fully responsible.

### How AI Erodes Traditional Ownership Models

Traditional enterprise software has clear lines:
- Applications have **owners**
- Data has **stewards**
- Infrastructure has **operators**

AI cuts across all of these simultaneously. It is not a layer — it is a process that **touches every layer.**

### When The Accountability Gap Becomes Visible

The gap remains invisible during normal operation. It surfaces when scrutiny arrives:
- A regulator asks how a decision was made
- A customer questions whether their data was used appropriately
- An internal review investigates an unexplainable outcome

At that moment, the organization discovers it cannot answer:
- Who approved the use of AI in this context?
- Who monitored its behavior?
- Who was responsible for its impact?

### Accountability as a System Property

Accountability cannot be assigned through org charts alone. It must be **embedded into the system itself.**

When AI interactions are observable, logged, and reviewable, accountability emerges:
- Teams can see where responsibility lies because the system records how authority was exercised
- Disagreements become resolvable because facts exist
- Oversight becomes possible without blame

### Devise's Role in Accountability

Devise provides the factual backbone accountability depends on:
- **Who** initiated every AI interaction (user attribution)
- **What system** processed it (model and vendor tracking)
- **What data** was involved (content classification)
- **What output** was produced (response capture)
- **What decision or action** followed (downstream tracing)

---

## 10. Build vs. Buy: AI Observability Decision Framework

### Why AI Observability Is Different From Traditional Observability

In traditional systems, observability is a solved problem — logs, metrics, and traces are well understood, systems behave deterministically, and instrumentation changes slowly.

AI does not behave this way:
- Models evolve continuously
- Prompt structures change as products iterate
- New providers are added regularly
- Usage shifts from centralized apps to distributed employee workflows
- Agents introduce multi-step reasoning and autonomous execution

What needs to be observed today is not what needs to be observed six months from now. The complexity is not in collecting signals — it is in **keeping visibility aligned with a moving system.**

### The Hidden Challenge: Coverage Beyond Your Own Applications

Most internal observability efforts start in the most controlled place: applications built by the platform team. But in most enterprises, the majority of AI risk sits **outside that boundary**:

- Employees use third-party AI tools directly
- Teams experiment with SaaS products that embed models invisibly
- Shadow integrations emerge long before formalization

An observability strategy covering only "what we built" will miss "what we rely on." That gap **widens rather than narrows** as adoption spreads.

### Why the System Boundary Matters

AI risk materializes when information crosses a boundary:
- Internal → External
- Trusted → Untrusted
- Human-reviewed → Autonomous

Observability inside application code or model prompts is fragile because it assumes those boundaries are stable. They are not.

Durable visibility requires observing AI interactions **at the system boundary** — where prompts, responses, and actions converge.

### Build vs. Buy Decision Matrix

| Criteria | Build | Buy (Devise) |
|----------|-------|------|
| Coverage of employee AI usage | ❌ Unlikely | ✅ Full coverage |
| Adapts as AI landscape changes | ❌ Ongoing engineering | ✅ Maintained automatically |
| Audit-ready compliance reporting | ❌ Fragmented logs | ✅ Structured audit trails |
| Scales with adoption | ❌ Requires re-engineering | ✅ Scales automatically |
| Time to visibility | ❌ Weeks to months | ✅ Hours |
| Total cost of ownership | ❌ Continuous platform overhead | ✅ Predictable subscription |

**Recommendation:** If AI is already spreading across employees, business units, vendors, and products — as it is in most enterprises — visibility becomes shared infrastructure. At that point, build is almost never the right choice.

---

## 11. Employee-Level AI Observability

### Why Employee AI Usage Is Different

Most AI observability efforts focus on **applications** — monitored at the API level, controlled by engineering teams.

But the majority of enterprise AI risk sits at the **employee level**:
- Personal AI accounts used for work tasks
- Browser extensions that invisibly process work content
- Desktop apps that sync local files to external models
- Unreviewed SaaS tools with embedded AI features

Employee-level observability is categorically different from application monitoring:

| Application Monitoring | Employee Observability |
|------------------------|------------------------|
| Controlled environment | Unpredictable user behavior |
| Known tool set | Constantly changing tool landscape |
| Developer-instrumented | Requires agent deployment |
| Process-level telemetry | User-level context required |

### What Employee AI Observability Reveals

- **Tool usage patterns** — which employees use which AI tools, how frequently
- **Data exposure** — what content employees share with external models
- **Workflow mapping** — which tasks are being AI-assisted (and which should be)
- **Adoption gaps** — who is under-using approved tools and why
- **Risk concentrations** — teams or individuals with elevated data exposure
- **License utilization** — whether paid AI subscriptions are actually being used

### The Employee Experience Imperative

Observability must not create friction or surveillance anxiety. Devise's approach:
- Monitoring is disclosed to employees transparently
- Personal activity is excluded (only work context monitored)
- Interventions feel like coaching, not policing
- The goal is to help employees use AI better — not to punish them

---

## 12. The 30-Day CISO Rollout Plan

A practical framework for CISOs to establish AI governance rapidly without disrupting operations.

### Week 1: Establish Baseline Visibility (Days 1–7)

**Goal:** Understand what is actually happening before making any policy decisions.

**Actions:**
- Deploy the Devise desktop agent across a pilot group (recommended: 50–100 employees)
- Configure network monitoring for the organization's IP range
- Run initial discovery — identify all AI tools in active use
- Map tools to categories (AI assistants, coding tools, productivity, etc.)
- Identify top-10 by usage volume

**Deliverable:** First-look AI usage report presented to IT and security leadership

### Week 2: Risk Stratification (Days 8–14)

**Goal:** Classify every AI tool by risk level and data exposure potential.

**Actions:**
- Review all discovered tools against the approved tool list
- Classify each as: Approved / Under Review / Not Approved
- Identify tools with Full Trace coverage vs. Network Only
- Map data types in use (PII, PHI, code, financial data)
- Identify the highest-risk employees and teams

**Deliverable:** Risk-stratified AI tool inventory with recommended actions per category

### Week 3: Policy Operationalization (Days 15–21)

**Goal:** Convert existing acceptable-use policies into enforced, monitored rules.

**Actions:**
- Define enforcement rules in Devise (allow / warn / block per tool per risk level)
- Configure data classification triggers (PII detection → alert)
- Set up real-time alerting for policy violations
- Brief department heads on new monitoring (transparency is essential)
- Enable audit logging for all high-risk AI interactions

**Deliverable:** Active governance policy with enforcement running in production

### Week 4: Measure & Expand (Days 22–30)

**Goal:** Prove value, expand coverage, and build the ongoing governance cadence.

**Actions:**
- Review first week of enforcement data — adjust false positive thresholds
- Present initial ROI metrics to CISO and leadership
- Roll out agent to full organization
- Establish weekly governance review meeting
- Configure quarterly compliance reporting automation

**Deliverable:** Full-org AI governance operational; first compliance report generated

---

## 13. Coverage: AI Tools Monitored

Devise monitors **6,500+ AI tools** across every category. Below is the full taxonomy.

### AI Assistants
ChatGPT · Claude · Gemini · Microsoft Copilot · Bing Chat · Amazon Q · Perplexity · Intercom AI · MusicLM · Tiledesk · Drift

### AI Coding Tools
GitHub Copilot · Cursor · Codeium · Tabnine · Replit AI · Bolt · Lovable · Windsurf · v0 · Cratecode · Nozomio

### AI Writing Tools
Grammarly · Jasper · Copy.ai · Notion AI · Blaze · Article · STORM · Shy Editor · Content Suite by Senuto

### AI Image Generation
DALL-E · Midjourney · Stable Diffusion · Adobe Firefly · Canva AI · Leonardo · Artlist · PromptHero · imgsys · Google Flow

### AI Research Tools
Elicit · Perplexity · Consensus · Open Knowledge Maps · Otherweb · Queryzy

### Productivity (AI-Enhanced)
Adobe Creative Cloud · Adobe Lightroom · Google Workspace · Notion AI · Airtable · Coda · Hubspot AI · Salesforce AI · Figma AI · Discord · Dropbox AI · OneDrive AI · Teams AI · Linear AI

### Development
Bolt · Linear · Algolia · Fast.ai · Meilisearch · Amplitude · Pixelbin · Replit · Seer

### API-Level Coverage
OpenAI API · Anthropic API · Google Gemini API · AWS Bedrock (Amazon Q) · Azure OpenAI

---

## 14. Coverage Tiers: Network vs. Full Trace

### Network Coverage (Trackable)
**What it means:** Devise detects that an AI tool is being used — who, when, how often.

**What is captured:**
- Network connection to AI service domain
- Frequency and timing of interactions
- User and device attribution
- Tool categorization

**Use case:** Tool discovery, usage analytics, license optimization

**Example tools:** Cursor, GitHub Copilot, Notion AI, Salesforce

### Full Trace Coverage
**What it means:** Devise captures complete request and response content — full observability into what was sent and what came back.

**What is captured:**
- Complete prompt text (request capture)
- Complete AI response (response capture)
- File uploads detected and classified
- Data classification applied (PII, PHI, financial data, IP)
- Policy evaluation on every interaction

**Use case:** Data loss prevention, compliance auditing, security enforcement

**Example tools:** ChatGPT, Bing Chat, Adobe Creative Cloud, Google Workspace, Bolt

---

## 15. Data Types Monitored

For tools with Full Trace coverage, Devise automatically classifies the following data types:

### Personal Data
| Type | Description |
|------|-------------|
| PII | Names, addresses, email, phone, SSN, passport |
| PHI | Medical records, diagnoses, treatment information |
| Biometric | Fingerprints, facial recognition data |
| Children's Data | Any data about minors |

### Professional / Enterprise Data
| Type | Description |
|------|-------------|
| Code Snippets | Source code, scripts, configuration |
| Repository Context | Codebase structure, commit history |
| Financial Data | Revenue figures, pricing, contracts |
| Intellectual Property | Proprietary algorithms, trade secrets |
| Legal Documents | Contracts, NDAs, legal strategy |
| HR / Employee Data | Performance reviews, compensation, personnel files |

### System Data
| Type | Description |
|------|-------------|
| API Keys | Credentials, tokens, secrets |
| Configuration Files | Infrastructure details, environment variables |
| Database Schemas | Data structure, relationships |
| Network Information | IP addresses, infrastructure topology |

---

## 16. Compliance Frameworks Covered

Devise provides coverage and audit evidence for the following frameworks:

### International
- **GDPR** — EU General Data Protection Regulation
- **ISO 27001** — Information Security Management
- **ISO 27701** — Privacy Information Management
- **EU AI Act** — High-risk AI system requirements

### United States
- **SOC 2 Type II** — Trust Services Criteria (Security, Availability, Confidentiality)
- **HIPAA** — Health Insurance Portability and Accountability Act (PHI)
- **CCPA** — California Consumer Privacy Act
- **PCI DSS** — Payment Card Industry Data Security Standard
- **FedRAMP** — Federal Risk and Authorization Management Program
- **NIST 800-53** — Security and Privacy Controls for Federal Systems
- **NIST AI RMF** — Artificial Intelligence Risk Management Framework

### Other
- **OWASP Top 10 for LLMs** — AI-specific application security risks
- **OWASP LLM Vulnerability Coverage** — Prompt injection, data leakage, etc.

---

## 17. Security & AI Governance Glossary

A comprehensive reference of every security, AI, governance, and compliance term relevant to Devise's domain. All 150 terms from the corpus, organized by category.

---

### A: AI-Specific Concepts

**Agentic AI**
AI systems that can autonomously perform tasks, make decisions, and take actions with minimal human intervention, often using tools and APIs to accomplish goals. Also known as: AI Agents, Autonomous AI.

Key characteristics: Autonomy, Tool Use, Planning, Persistence, Self-Correction.
Security concern: Permission management, action auditing, scope enforcement.

**AI Agent**
An autonomous AI system capable of perceiving its environment, making decisions, and taking actions to achieve specific goals with minimal human intervention.

Architectures: ReAct (Reason + Act), Plan-and-Execute, Reflexion, Multi-Agent.
Components: Language Model, Tools/Functions, Memory, Planning, Observation.

**AI Ethics**
The study and application of moral principles and values in the design, development, and deployment of artificial intelligence systems.

Core principles: Fairness, Transparency, Accountability, Privacy, Safety, Beneficence.

**AI Governance**
The frameworks, policies, and processes organizations use to manage AI systems responsibly, ethically, and in compliance with regulations.

Components: Risk Management, Oversight, Accountability, Transparency, Compliance.

**AI Risk Management**
The systematic process of identifying, assessing, and mitigating risks associated with AI systems throughout their lifecycle.

Frameworks: NIST AI RMF, ISO 23894, EU AI Act requirements.

**Adversarial Attacks**
Techniques that manipulate inputs to machine learning models to cause misclassification or unexpected behavior.

Types: Evasion Attacks (inference-time), Poisoning Attacks (training-time), Model Extraction, Model Inversion.
Methods: White-Box (FGSM, PGD), Black-Box (transfer attacks, boundary attacks).

**Anomaly Detection**
The identification of patterns in data that do not conform to expected behavior, used to detect security threats, fraud, or system issues.

**Bias Detection**
The process of identifying and measuring systematic errors in AI/ML models that create unfair or discriminatory outcomes.

**Chain of Thought**
A prompting technique where AI models are instructed to show their reasoning steps before providing a final answer, improving accuracy and transparency.

**Context Length / Context Window**
The maximum number of tokens an LLM can process in a single interaction; determines how much information the model can consider at once.

**Embedding Models / Embeddings**
Neural network models that convert text, images, or other data into numerical vector representations for semantic similarity calculations.

**Explainability**
The ability to describe AI model decisions in human-understandable terms; critical for governance, compliance, and trust.

**Federated Learning**
A machine learning approach where models are trained across multiple decentralized devices without sharing raw data, preserving privacy.

**Few-Shot Learning**
The ability of an ML model to learn new tasks with very limited training examples.

**Fine-Tuning**
The process of adapting a pre-trained model to a specific task or domain using additional targeted training.

**Function Calling**
A capability that allows LLMs to invoke external functions or APIs, enabling them to interact with real-world systems and take actions.

**Grounding**
The process of connecting AI outputs to verifiable, current information sources to improve accuracy and reduce hallucinations.

**Guardrails**
Safety mechanisms and constraints implemented to prevent AI systems from generating harmful, inappropriate, or policy-violating content.

**Hallucination**
When AI models generate plausible-sounding but factually incorrect, fabricated, or nonsensical information.

**Inference**
The process of running a trained ML model on new data to generate predictions or outputs.

**Jailbreaking**
Techniques used to bypass AI safety measures and content policies by crafting specific prompts that circumvent built-in restrictions.

**Knowledge Base**
A structured repository of information that AI systems can query to provide accurate, up-to-date responses.

**LLM (Large Language Model)**
AI models trained on large text datasets to understand and generate human-like text; examples include GPT-4, Claude, Gemini.

**MLOps**
Practices for deploying, monitoring, and maintaining machine learning models in production environments reliably.

**Model Cards**
Documentation describing an AI model's intended uses, limitations, performance metrics, and ethical considerations.

**Model Monitoring**
Continuous tracking of ML model performance in production to detect drift, degradation, and unexpected behavior.

**Model Risk Management**
Frameworks for identifying, assessing, and mitigating risks arising from the use of quantitative models including AI/ML.

**Prompt Engineering**
The practice of designing and optimizing input prompts to guide AI model outputs toward desired results.

**Prompt Injection**
An attack where malicious instructions are embedded in inputs to manipulate AI system behavior, override safety measures, or extract sensitive information.

**Quantization**
Reducing the precision of model weights to decrease size and improve inference speed with minimal accuracy loss.

**RAG (Retrieval-Augmented Generation)**
Combining information retrieval with LLM generation: the model retrieves relevant documents before generating a response.

**Responsible AI**
The practice of developing and deploying AI systems in ways that are ethical, transparent, fair, accountable, and safe.

**Semantic Search**
Search that understands the meaning and context of queries rather than just matching keywords.

**Synthetic Data**
Artificially generated data that mimics real data distributions without containing actual sensitive information.

**Temperature**
A parameter controlling AI output randomness; lower values produce more focused, deterministic responses.

**Tokens**
The basic units of text that LLMs process; models have limits on how many tokens they can handle per interaction.

**Vector Database**
A database optimized for storing and querying high-dimensional vector embeddings for semantic similarity search.

---

### B: Security Fundamentals

**ABAC (Attribute-Based Access Control)**
Access control based on combinations of user attributes, resource attributes, and environmental conditions.

**ACL (Access Control List)**
A list of permissions attached to a resource specifying which users or processes are granted access and what operations they can perform.

**API Key**
A unique identifier used to authenticate requests from applications to APIs; must be protected as a secret credential.

**Attack Surface**
The sum of all potential entry points where an attacker could gain unauthorized access to a system.

**Audit Log**
A chronological record of system events and user actions, essential for security monitoring, compliance, and forensic investigation.

**Authentication**
The process of verifying the identity of a user, device, or system attempting to access resources.

**Authorization**
The process of determining what resources or operations an authenticated entity is permitted to access.

**Blue Team**
The defensive security team responsible for protecting systems, monitoring for threats, and responding to incidents.

**Business Continuity**
Plans and procedures ensuring critical operations can continue during and after a disaster or significant disruption.

**Certificate Authority (CA)**
A trusted organization that issues digital certificates verifying the identity of websites and entities.

**CIA Triad**
The three core principles of information security: Confidentiality, Integrity, Availability.

**CI/CD (Continuous Integration/Continuous Deployment)**
Development practices that automate building, testing, and deploying code changes, reducing risk and accelerating delivery.

**Cloud-Native Security**
Security approaches designed specifically for cloud environments: containers, microservices, serverless functions.

**Credential Stuffing**
Using stolen username/password combinations from one breach to attempt access to other services.

**Cryptography**
Mathematical techniques for securing data through encryption, digital signatures, and related methods.

**CSPM (Cloud Security Posture Management)**
Tools that continuously monitor cloud configurations for security risks and compliance violations.

**CVSS (Common Vulnerability Scoring System)**
A standardized framework for rating the severity of software security vulnerabilities.

**Data Breach**
An incident where unauthorized parties gain access to confidential data.

**Data Classification**
The process of organizing data into categories based on sensitivity and value, informing protection requirements.

**Data Encryption**
Converting data into a format unreadable without the decryption key.

**Data Governance**
Policies and processes ensuring data is managed consistently, accurately, and in compliance with regulations throughout its lifecycle.

**Data Lineage**
Tracking data from its origin through all transformations and movements; critical for compliance and debugging.

**Data Masking**
Obscuring specific data elements to protect sensitive information while preserving data utility.

**Data Minimization**
The principle of collecting only the minimum data necessary for a specific purpose.

**Data Privacy**
The right of individuals to control how their personal information is collected, used, and shared.

**Data Residency**
Requirements specifying where data must be physically stored, often mandated by regulation.

**DevSecOps**
Integrating security practices throughout the software development and operations lifecycle.

**Differential Privacy**
Mathematical privacy technique adding controlled noise to datasets to protect individual privacy while preserving statistical utility.

**Digital Signature**
Cryptographic mechanism proving authenticity and integrity of digital messages or documents.

**Disaster Recovery**
Plans and procedures for restoring systems and data following a catastrophic event.

**DLP (Data Loss Prevention)**
Technologies and policies preventing unauthorized transfer of sensitive data outside organizational boundaries.

**Domain-Driven Security**
Applying domain knowledge to security design, ensuring security controls reflect actual business risks.

**EDR (Endpoint Detection and Response)**
Security solutions monitoring endpoint devices for threat detection, investigation, and response.

**Encryption**
The process of encoding data so only authorized parties can access it.

**Firewall**
A network security device controlling incoming and outgoing traffic based on predefined rules.

**GRC (Governance, Risk, and Compliance)**
Integrated framework for managing organizational governance, enterprise risk management, and regulatory compliance.

**Hashing**
Converting data of any size to a fixed-size value; used for data integrity verification and password storage.

**Homomorphic Encryption**
Advanced encryption allowing computations on encrypted data without decrypting it first.

**IAM (Identity and Access Management)**
Frameworks for managing digital identities and controlling resource access.

**Identity Provider (IdP)**
A service that creates, maintains, and manages identity information and provides authentication services.

**Incident Management**
Structured process for identifying, analyzing, and resolving security incidents.

**Incident Response**
The organized approach for preparing, detecting, containing, and recovering from security breaches.

**Intrusion Detection**
Systems that monitor networks or hosts for malicious activity or policy violations.

**JWT (JSON Web Token)**
A compact, URL-safe token format for securely transmitting claims between parties.

**Key Management**
Processes for generating, storing, distributing, and retiring cryptographic keys securely.

**Least Privilege**
Security principle granting users and systems only the minimum permissions necessary to perform their functions.

**Logging**
Recording system events and activities for security monitoring, debugging, and compliance.

**Malware**
Malicious software designed to disrupt, damage, or gain unauthorized access to systems.

**MCP (Model Context Protocol)**
A protocol enabling standardized communication between AI models and external tools/systems.

**MFA (Multi-Factor Authentication)**
Authentication requiring two or more verification factors for stronger identity assurance.

**mTLS (Mutual TLS)**
Authentication where both client and server verify each other's certificates, providing stronger security for service-to-service communication.

**Network Segmentation**
Dividing a network into isolated segments to limit the spread of breaches and control traffic flow.

**OAuth**
An authorization framework enabling applications to access resources on behalf of users without sharing credentials.

**Observability**
The ability to understand a system's internal state from its external outputs — logs, metrics, and traces. For AI, this extends to prompts, responses, model decisions, and tool calls.

**OWASP**
Open Web Application Security Project; publishes security guidelines including the OWASP Top 10 for LLMs.

**PAM (Privileged Access Management)**
Security for managing, monitoring, and controlling access to critical systems by privileged users.

**Patch Management**
Systematic process for acquiring, testing, and applying software updates to address vulnerabilities.

**Penetration Testing**
Authorized simulated cyberattacks to evaluate security posture and identify vulnerabilities.

**PHI (Protected Health Information)**
Health information that can identify an individual, regulated under HIPAA in the United States.

**Phishing**
Social engineering attacks using deceptive communications to steal credentials or deliver malware.

**PII (Personally Identifiable Information)**
Data that can identify a specific individual, such as name, SSN, email address, or biometrics.

**Policy Engine**
A system that evaluates and enforces rules and policies in real time based on context, attributes, and conditions.

**Privacy by Design**
Embedding privacy protection into system design from the outset rather than adding it later.

**Ransomware**
Malware encrypting data and demanding payment for decryption; a major enterprise threat.

**RASP (Runtime Application Self-Protection)**
Security technology integrated into an application to detect and prevent attacks in real time.

**Rate Limiting**
Controlling the rate of requests to prevent abuse, ensure availability, and protect against DDoS.

**RBAC (Role-Based Access Control)**
Access control based on user roles within the organization rather than individual permissions.

**Red Team**
A group authorized to simulate real-world attacks to identify vulnerabilities before malicious actors do.

**Retrieval**
Fetching relevant information from a knowledge source based on a query; foundational to RAG architectures.

**SAML (Security Assertion Markup Language)**
XML-based standard for exchanging authentication and authorization data between identity providers and service providers.

**SAST (Static Application Security Testing)**
Analyzing source code for security vulnerabilities without executing the program.

**SBOM (Software Bill of Materials)**
A formal record of all components and dependencies in a software product, enabling vulnerability tracking.

**Secrets Management**
Secure storage, distribution, and lifecycle management of credentials, API keys, and other secrets.

**Secure SDLC**
Integrating security activities throughout the software development lifecycle from requirements to deployment.

**Security Awareness**
Training programs educating employees about security risks and best practices.

**Service Mesh**
Infrastructure layer managing service-to-service communication, security, and observability in microservices architectures.

**SIEM (Security Information and Event Management)**
Systems collecting, analyzing, and correlating security events across infrastructure for threat detection and compliance.

**SLA (Service Level Agreement)**
Formal commitment specifying performance standards, uptime guarantees, and responsibilities between provider and customer.

**SOC (Security Operations Center)**
A team responsible for monitoring, detecting, investigating, and responding to security incidents.

**SOC 2 (System and Organization Controls 2)**
AICPA framework for auditing service organizations' controls over security, availability, processing integrity, confidentiality, and privacy.

**SSO (Single Sign-On)**
Authentication scheme allowing users to access multiple systems with one set of credentials.

**Supply Chain Security**
Protecting software and hardware from vulnerabilities introduced through the development and distribution chain.

**Threat Intelligence**
Evidence-based knowledge about existing or emerging threats used to inform security decisions.

**Threat Modeling**
Structured process for identifying potential security threats and vulnerabilities in system design.

**TLS (Transport Layer Security)**
Cryptographic protocol providing secure communication over networks; successor to SSL.

**Tokenization (Data)**
Replacing sensitive data with non-sensitive tokens while maintaining a mapping in a secure token vault.

**Trust Services Criteria**
AICPA framework forming the basis of SOC 2 attestations across security, availability, confidentiality, and privacy.

**VPN (Virtual Private Network)**
Encrypted tunnel extending a private network over a public network, protecting data in transit.

**Vulnerability Management**
Continuous process of identifying, evaluating, and remediating security vulnerabilities.

**WAF (Web Application Firewall)**
Security system filtering and monitoring HTTP traffic to protect web applications from common attacks.

**Web3 Security**
Security considerations specific to decentralized applications, blockchain, and smart contracts.

**XDR (Extended Detection and Response)**
Security approach integrating multiple security tools for comprehensive threat detection across the enterprise.

**YAML**
Human-readable data serialization format used extensively for configuration files in modern infrastructure.

**Zero-Day**
A previously unknown vulnerability with no available patch; highly dangerous as defenders have zero days to prepare.

**Zero Trust**
Security model assuming no user or device is trusted by default, requiring continuous verification regardless of location.

---

### C: Compliance & Regulatory Frameworks (Detailed)

**CCPA (California Consumer Privacy Act)**
California privacy law giving consumers control over their personal information collected by businesses.

Rights granted: Know, Delete, Opt-out of sale, Non-discrimination.
Applicability: Businesses collecting CA residents' personal information above defined thresholds.

**EU AI Act**
World's first comprehensive AI regulation, categorizing AI systems by risk level with proportional requirements.

Risk categories: Unacceptable (banned) → High Risk (strict requirements) → Limited Risk → Minimal Risk.
Impact on Devise: All enterprise AI systems must have human oversight, audit trails, and risk management.

**FedRAMP**
US government program providing standardized security assessment, authorization, and monitoring for cloud services.

**GDPR (General Data Protection Regulation)**
EU regulation governing the collection and processing of personal data of EU residents.

Key principles: Lawfulness, Purpose Limitation, Data Minimization, Accuracy, Storage Limitation, Integrity & Confidentiality.
For AI: Any personal data processed by AI models is subject to full GDPR requirements.

**HIPAA (Health Insurance Portability and Accountability Act)**
US law protecting the privacy and security of health information.
PHI sent to AI models creates immediate HIPAA compliance obligations.

**ISO 27001**
International standard for information security management systems (ISMS); requires comprehensive security controls.

**ISO 27701**
Extension to ISO 27001 addressing privacy information management; maps to GDPR requirements.

**NIST 800-53**
Catalog of security and privacy controls for US federal information systems and organizations.

**NIST AI RMF (AI Risk Management Framework)**
NIST framework for managing AI risks across four functions: Govern, Map, Measure, Manage.

Relevance: Increasingly referenced in enterprise AI governance policies globally.

**PCI DSS (Payment Card Industry Data Security Standard)**
Security standard for organizations handling payment card data.

**SOC 2 Type II**
Independent audit of service organization controls over a period of time (typically 12 months).

Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy.

---

## 18. Technical Architecture

### How Devise Works: The Technical Stack

```
┌──────────────────────────────────────────────────────────────┐
│                     EMPLOYEE DEVICES                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Devise Desktop Agent                        │    │
│  │  • Network connection monitoring (OS-level)          │    │
│  │  • Process attribution (which app made connection)   │    │
│  │  • DNS resolution for tool identification            │    │
│  │  • Full-trace capture (request/response intercept)   │    │
│  │  • Local data classification (PII/PHI detection)     │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ Encrypted telemetry
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                   DEVISE CLOUD PLATFORM                      │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐   │
│  │  Ingestion    │  │  Classification│  │  Policy        │   │
│  │  Pipeline     │→ │  Engine        │→ │  Enforcement   │   │
│  └───────────────┘  └───────────────┘  └────────────────┘   │
│           │                │                    │             │
│           ▼                ▼                    ▼             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │              Analytics & Reporting Layer               │   │
│  │  Pulse Dashboard │ Spend Console │ Oversight Center    │   │
│  └───────────────────────────────────────────────────────┘   │
│           │                                                   │
│           ▼                                                   │
│  ┌───────────────────────────────────────────────────────┐   │
│  │              Audit & Compliance Store                  │   │
│  │  Immutable logs │ Compliance reports │ Export API      │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    INTEGRATIONS                              │
│  SIEM (Splunk, Sentinel) │ SOAR │ HRIS │ SSO/IdP │ Slack    │
│  ServiceNow │ Jira │ API (REST) │ Webhook │ SCIM             │
└──────────────────────────────────────────────────────────────┘
```

### The Desktop Agent

The Devise desktop agent operates at the OS network layer, providing:

- **Connection monitoring:** Every network connection is captured, attributed to a process, and tagged with user identity
- **Tool identification:** A continuously updated registry of 6,500+ AI tool domains, IP ranges, and TLS signatures
- **Process attribution:** Connecting network activity to the specific application responsible
- **Full-trace capture:** For supported tools, request and response content is captured via TLS inspection or browser extension integration
- **Local classification:** Sensitive data patterns (PII, PHI, API keys) detected locally before transmission to cloud
- **Deduplication:** Intelligent deduplication prevents duplicate events within configurable windows
- **Offline buffering:** Events queued locally when connectivity is interrupted, delivered on reconnection

### AI Tool Registry

The tool registry is the heart of Devise's coverage capability:
- **6,500+ entries** with domain patterns, IP ranges, and process signatures
- **Automatically updated** as new AI tools launch
- **Category taxonomy** mapping tools to usage type (AI Assistant, Coding, Writing, etc.)
- **Risk classification** per tool (low / medium / high) based on data types handled
- **Coverage tier** metadata (Network Only vs. Full Trace)

### Data Classification Pipeline

Every AI interaction passes through a multi-stage classification pipeline:

1. **Pattern matching** — regex-based detection for PII, PHI, API keys, credit card numbers
2. **Semantic classification** — embedding-based detection for sensitive content types
3. **Context enrichment** — tool identity, user identity, department, data sensitivity score
4. **Policy evaluation** — compare against configured rules for allow/warn/block decision
5. **Event emission** — structured event to the analytics and audit store

### Security Design

- All telemetry encrypted in transit (TLS 1.3) and at rest (AES-256)
- Agent operates with minimal OS permissions (read-only network monitoring)
- No employee personal browsing data captured
- Data residency options for EU, US, and APAC
- Role-based access control for the management console
- SOC 2 Type II certified infrastructure

---

## 19. Key Metrics & Business Impact

### Discovery Metrics (From Deployed Organizations)

| Metric | Typical Finding |
|--------|-----------------|
| AI tools discovered at deployment | **6–10× more** than IT knew about |
| Shadow AI as % of total AI usage | **40–60%** |
| Data incidents identified within 30 days | **Multiple per organization** |
| Unused AI licenses identified | **15–30%** of paid subscriptions |

### ROI Metrics

| Metric | Typical Range |
|--------|---------------|
| License waste eliminated | `$50K–$300K` per year |
| Time to first visibility | `< 24 hours` |
| Compliance audit preparation time reduced | `60–80%` |
| Mean time to detect policy violation | `< 5 minutes` (real-time) |

### Platform Statistics

- **6,500+** AI tools detected
- **62,598+** apps and websites covered
- **671+** tools with Full Trace Coverage
- **1,247** tools tracked in a typical large enterprise deployment
- **$128K** average waste found per organization
- **$340K** average annual savings for mid-enterprise customers

---

## 20. Target Personas & Use Cases

### Primary Personas

#### CISO (Chief Information Security Officer)
**Pain:** AI is spreading faster than security controls. No visibility into what data is going to external models.
**Goal:** Establish AI governance without blocking productivity or triggering employee backlash.
**Devise value:** Real-time threat detection, policy enforcement, audit-ready compliance reports, agentic AI monitoring.

#### CIO / IT Leadership
**Pain:** AI spend is fragmented. 200+ tools discovered during audits. No consolidated view.
**Goal:** Rationalize AI spend, reduce shadow procurement, standardize on approved tools.
**Devise value:** Complete tool inventory, spend consolidation, license optimization, Shadow AI detection.

#### Compliance Officer / Legal
**Pain:** Cannot prove AI governance is operational. Cannot answer regulators with evidence.
**Goal:** Demonstrate compliance with GDPR, SOC 2, HIPAA, EU AI Act requirements.
**Devise value:** Structured audit logs, automated compliance reports, policy enforcement history, data classification records.

#### VP of Engineering / Platform Teams
**Pain:** AI is embedded in product pipelines without complete visibility into data flows.
**Goal:** Ensure production AI usage is secure, attributable, and within policy.
**Devise value:** API-level monitoring, agentic AI oversight, developer workflow integration.

#### CFO / Finance
**Pain:** AI budget requests from every department. No consolidated spend view. ROI unclear.
**Goal:** Understand total AI spend, eliminate waste, prove business value.
**Devise value:** Spend consolidation, license optimization, time-saved quantification, auditable ROI reporting.

### Key Use Cases by Industry

#### Financial Services
- PII/financial data detection in AI prompts (GDPR, PCI DSS)
- Trading / investment decision AI oversight
- Customer data protection in AI tools
- Regulatory audit evidence for AI usage

#### Healthcare & Life Sciences
- PHI detection before external model transmission (HIPAA)
- Clinical decision support AI monitoring
- Research data protection
- FDA AI/ML guidance compliance

#### Legal & Professional Services
- Client privileged information protection
- Attorney-client communication AI monitoring
- Contract data in AI writing tools
- Conflict-of-interest AI usage detection

#### Technology / Software
- Source code protection in AI coding tools (IP risk)
- Developer AI tool governance
- Agent-based development oversight
- SBOM integration for AI model dependencies

#### Enterprise / Manufacturing
- IP and trade secret protection
- Employee productivity AI tracking
- Supply chain AI tool governance
- Compliance with EU AI Act for operational AI

---

## 21. Strategic Positioning

### The Competitive Landscape

| Category | Who | What They Do | Devise Difference |
|----------|-----|--------------|-------------------|
| CASB | Netskope, Zscaler, McAfee | Web/cloud app security | Not AI-native; no LLM context understanding |
| DLP | Symantec, Forcepoint | Data loss prevention | Detects data leaving; doesn't understand AI context |
| AI Safety | Lakera, Protect AI | LLM-specific guardrails | API-level only; misses employee direct usage |
| AI Governance | Various startups | Policy frameworks | Documentation-only; no enforcement |
| **Devise** | — | Full-stack AI observability | End-to-end: detection → context → enforcement → ROI |

### Why Devise Wins

1. **Coverage breadth:** 6,500+ tools vs. competitors' dozens
2. **Full-trace depth:** Not just "is it being used" but "what was sent and what came back"
3. **The engine model:** Not a dashboard. A closed loop that changes behavior.
4. **ROI proof:** The only solution that quantifies the financial return on AI governance
5. **Employee-level:** Captures direct employee usage that API-level monitoring misses entirely

### The "System of Record for Enterprise AI" Category

Devise is creating a new software category: **the System of Record for Enterprise AI.**

Just as Salesforce became the system of record for customer relationships, and Workday for HR, Devise becomes the definitive record of how an enterprise uses AI — every tool, every interaction, every decision, every dollar.

---

## 22. Roadmap Concepts

Based on the full corpus analysis, these are the natural product extensions:

### Near-Term
- **AI Activity Feed** — Real-time stream of all AI interactions across the organization, filterable by team, tool, and risk level
- **Automated Tool Approval Workflow** — Self-service tool request portal with automated risk scoring and approval routing
- **Cost Allocation API** — Integration with finance systems to allocate AI spend to cost centers automatically
- **SIEM Integration** — Push Devise events to Splunk, Microsoft Sentinel, and other SIEM platforms

### Medium-Term
- **Agentic Activity Map** — Visual representation of all autonomous agent actions, tool calls, and downstream effects
- **AI Spend Forecasting** — ML-based prediction of AI spend growth by team and tool category
- **Benchmark Intelligence** — Compare AI adoption metrics against anonymized industry benchmarks
- **Compliance Autopilot** — Automatically generate SOC 2, GDPR, and ISO 27001 evidence packages

### Longer-Term
- **AI Supply Chain Risk** — Track AI model dependencies (like SBOM but for models) and monitor for supply chain vulnerabilities
- **Regulatory Change Monitoring** — Automatically update governance controls as EU AI Act and other regulations evolve
- **Cross-Enterprise Graph** — Map AI tool relationships across the enterprise knowledge graph (how tools connect and share data)
- **Autonomous Governance** — AI-assisted policy recommendations based on observed behavior patterns

---

## Appendix: Key Concepts Quick Reference

| Concept | One-Line Definition |
|---------|---------------------|
| Shadow AI | AI tools used without IT knowledge or approval |
| Full Trace Coverage | Complete request + response capture for an AI tool |
| Network Coverage | Detection of AI tool usage without content capture |
| The Adoption Engine | Devise's closed-loop system: Understand → Act → Quantify |
| System of Record | Definitive, auditable record of all enterprise AI usage |
| Agentic AI | AI that takes autonomous actions, not just generates text |
| Prompt Injection | Attack redirecting AI behavior via malicious input |
| Contextual Enforcement | Policy decisions made based on real-time context, not static rules |
| Observability (AI) | Understanding AI system state from prompts, responses, actions |
| Visibility Gap | The space between AI usage and organizational knowledge of it |

---

*This document is the master reference for the Devise product, derived from a comprehensive synthesis of 293 source documents covering Oximy's product vision, blog content, tool coverage, compliance scope, and security glossary — rebranded and adapted for Devise.*

*Last Updated: May 2026*
