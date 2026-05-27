# 10 — Competitive Positioning

> *Dashboards report. Devise intervenes.*

Devise is a category-defining product. It does not slot neatly into an existing buyer category — which is the point. This document maps how Devise compares to adjacent categories, and the talking points that make the difference clear.

---

## Adjacent Categories — and Why None Of Them Are Devise

### vs. AI Observability (SDK-First / DevTools)
**Examples of the pattern:** LangSmith, Helicone, OpenTelemetry-for-LLM, application APM extensions.

| Dimension | SDK-First AI Observability | Devise |
|---|---|---|
| What they see | Calls that pass through *their* SDK | Every AI tool on the network (6,500+) |
| Buyer | Engineering team building AI apps | CIO / CISO / Chief AI Officer governing the workforce |
| Action | Logs and traces. Reporting. | Real-time interventions on user behavior |
| Workforce coverage | Zero — they instrument applications, not employees | The whole workforce |
| Coverage gap | Anything not pre-instrumented is invisible | None at the network layer |

**Positioning:** SDK-first observability is for **app developers**. Devise is for **enterprises**. We don't compete; we cover what they can't.

---

### vs. CASB (Cloud Access Security Broker)
**Examples:** Netskope (also a Devise *partner*), McAfee MVISION, Zscaler ZIA, Microsoft Defender for Cloud Apps.

| Dimension | CASB | Devise |
|---|---|---|
| Primary job | Catalog SaaS apps, enforce policy | Drive AI adoption + governance |
| AI-specificity | AI is one of thousands of categories | AI is the only category |
| Action | Block / allow / log | Steer / coach / discover / measure ROI |
| ROI story | Risk reduction (compliance) | Risk reduction *and* dollar-denominated adoption value |
| Who buys | CISO | CISO + COO + CFO + Chief AI Officer |

**Positioning:** A CASB is a *gate*. Devise is an *engine*. CASBs sit beside Devise — many customers feed Devise from their CASB. *"Your CASB tells you what's there. Devise makes it work."*

---

### vs. DLP (Data Loss Prevention)
**Examples:** Symantec DLP, Forcepoint, Microsoft Purview, Nightfall, Strac.

| Dimension | DLP | Devise |
|---|---|---|
| Primary job | Block sensitive data egress | Drive AI value while governing usage |
| Tone | Restrictive | Enabling (with regulated-vertical modes for restriction) |
| AI coverage | Often partial; AI prompts not always parsed | Native; AI is the whole product |
| ROI | Avoided incident cost | Adoption value + avoided incident cost |

**Positioning:** DLP says *no*. Devise says *yes, but better*. In Healthcare and Financial Services, Devise integrates DLP-style PHI/PII detection alongside its adoption engine — combining the *enable* and *restrict* motions in one system.

---

### vs. License Management / SaaS Management Platforms
**Examples:** Zylo, Productiv, Vendr, Cledara, Torii.

| Dimension | SaaS Management | Devise |
|---|---|---|
| What they see | Which licenses exist; rough utilization | Which workflows, which roles, which interventions work |
| Granularity | License-level | Person × task × tool × outcome |
| Action | Surface unused seats | *Move people to* unused seats and measure the result |
| Output | Spend report | ROI proof tied to specific interventions |

**Positioning:** SaaS management knows you bought 340 Copilot seats and 187 are unused. Devise knows *which* 187 engineers should be using them, *why* they aren't, and *how to get them there.*

---

### vs. LMS / Corporate AI Training Platforms
**Examples:** Section, Maven, AI Academies on Coursera-for-Business, Cornerstone OnDemand AI tracks.

| Dimension | LMS / Training | Devise |
|---|---|---|
| Mechanism | Courses | Coaching delivered in the flow of work |
| Personalization | Curriculum-driven | Behavior-driven, per individual |
| Measurement | Course completion | Hours saved per person, attributable |
| Latency | Quarterly cohorts | Real-time |

**Positioning:** Training platforms teach *what AI is*. Devise teaches *what your team's top 10% are already doing* — and spreads it.

---

### vs. BI Dashboards / Custom Analytics
**Examples:** Tableau / Looker / Power BI / internal data team built dashboards.

| Dimension | BI Dashboards | Devise |
|---|---|---|
| Output | Charts | Actions |
| Direction | Reads the past | Changes the future |
| Loop | Open (human must act) | Closed (engine acts) |
| Causal attribution | Correlated only | Causal — before/after per intervention |

**Positioning:** A dashboard is a report card. Devise is the tutor.

---

## Head-to-Head Battle Card

| Customer concern | If competitor says... | Devise says... |
|---|---|---|
| Coverage | "We integrate with the top 50 AI tools" | "We see all 6,500+. The long tail is where shadow AI lives, and that's where the risk is" |
| Deployment | "Roll out our agent to every endpoint" | "We read from your existing security stack. Zero new agents" |
| Privacy | "We instrument prompts" | "We observe usage patterns, not prompts (except in regulated modes). Employees never see the data source" |
| ROI | "Adoption went from 22% to 47%" | "Specifically, these 14 interventions caused 23% of that gain — here's the dollar value" |
| Time to value | "POC in 60 days" | "60 seconds to map your team. 5 minutes to your AI Opportunity Assessment" |
| Vertical fit | "We have a healthcare dashboard" | "We have HIPAA BAA, PHI detection, and OCR-ready audit trail — and the same engine drives administrative adoption" |

---

## What Makes Devise Unfair

1. **Network-layer detection** — Coverage no SDK-first tool can match.
2. **Professional Intelligence Layer (800M profiles)** — Day-zero usefulness no behavioral analytics tool can match.
3. **The four-intervention engine** — Action no dashboard can match.
4. **End-to-end causal measurement** — ROI proof no correlated tool can match.
5. **Cross-customer learning** — Compounding moat no single-tenant tool can match.

These are not features. They are the architecture. They cannot be added later by a dashboard vendor; the system has to be built around the loop from day one.

---

## What Devise Is Honest About

- We do not (yet) cover every regional network vendor. Roadmap includes Fortinet, Cisco Umbrella, Forcepoint.
- We do not cover deeply offline scenarios where employees use AI on non-managed networks. For that, the desktop sidekick fills the gap.
- We do not provide agent governance today — though the workforce foundation makes us the natural place to add it.
- We are not the first stop for a customer who only wants DLP-style blocking. We're the first stop for the customer who wants AI to *work*.

---

## Customer Quote Template (How They Describe Us)

> *"We had three different tools telling us what AI we'd bought. Devise was the first one that told us whether anyone was using it — and then made them use it better. Within 60 days we'd consolidated $340K in licenses and could finally answer the board's AI question with a real number."*

That's the story we tell, and the story we ship every customer to be able to tell themselves.

---

## See Also
- [08-MARKET-THESIS.md](08-MARKET-THESIS.md) — Why the category is up for grabs
- [03-PRODUCT.md](03-PRODUCT.md) — What we actually ship
- [MASTER.md](MASTER.md) — One-page master summary
