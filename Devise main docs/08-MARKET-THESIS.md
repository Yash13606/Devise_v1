# 08 — Market Thesis

> Every company bought AI. Almost none got value from it. We built the system that takes companies from *"we bought AI"* to *"our people are measurably better because of AI."*

This document explains why we believe Devise is inevitable — not just possible.

---

## The Numbers That Frame Everything

| Number | Source | What it tells us |
|---|---|---|
| **$2.5B** | Gartner, 2026 | 2026 global generative AI spend — 4× over 2025 |
| **50%** | MIT / Fortune | Share of AI procured outside designated channels |
| **200+** | Enterprise AI audits | Average AI tools in active use per enterprise |
| **95%** | Deloitte | AI pilots that fail to reach production |
| **~5%** | Internal benchmarks | Employees who save meaningful time with AI today |

Read together, the picture is clear: **money in, value out is broken**. Companies are spending an unprecedented amount on AI and getting unprecedented little for it.

---

## The Diagnosis

Most market explanations for the value gap focus on the wrong thing:

- *"The models aren't good enough."* — They are. ChatGPT, Claude, Gemini, Copilot are best-in-class general assistants.
- *"The use cases aren't there."* — They are. Every job has 10+ task patterns AI can accelerate.
- *"The price is wrong."* — It isn't. At $10–$30/user/month, AI is the cheapest seat software anyone has ever sold.
- *"Pilots aren't moving to production."* — Symptom, not cause.

**The actual diagnosis:** AI adoption is a *behavior-change problem at scale*. Tools that don't get used don't generate value. Employees don't know which tool to pick for which task. The best workflows are invisible because they live in 2 people's heads. License waste compounds. Policy memos don't change real-time decisions.

**Behavior change needs a system, not a strategy deck.**

---

## Why Existing Categories Don't Solve It

| Category | What they do | Why they don't close the loop |
|---|---|---|
| **DLP (Data Loss Prevention)** | Block sensitive data egress | Restricts AI; doesn't drive adoption. Treats AI as a threat surface only. |
| **CASB** | Discover & control SaaS apps | Lists tools; doesn't intervene at the workflow level. |
| **AI Observability / AI Security (SDK-first)** | Instrument approved AI apps | Misses everything that isn't pre-wired. SDK adoption is voluntary. |
| **LMS / Training Platforms** | Run AI training courses | Generic content; not tied to actual usage patterns. People click "Complete." |
| **BI Dashboards** | Display AI adoption metrics | Read-only. Reports the gap. Doesn't close it. |
| **License Management** | Track seat utilization | Knows which seats are unused; doesn't know which workflows would use them. |

**Devise is the only system that does all of this — and crucially, does the *intervention*.** Observation alone is a report. Devise is an engine.

---

## Pillar 1 — Workforce-First Beats Agent-First

> *You cannot secure agents you do not yet have. But you can secure the people who are already using AI every day.*

Most of the AI risk conversation today is dominated by autonomous agents — systems that reason, plan, and act with minimal human oversight. This framing is understandable. Agents feel new, powerful, and potentially dangerous.

But it misallocates attention. Inside most enterprises, **AI adoption does not look like autonomous agents executing complex workflows.** It looks far more ordinary:

- Employees use AI to summarize documents, draft emails, prepare presentations, analyze data, translate text, generate code snippets, and brainstorm ideas.
- These interactions are frequent, informal, and woven into everyday work.
- They occur across departments, roles, and seniority levels.

This usage is not driven by centralized AI programs. It is driven by productivity pressure.

### The Risk Aggregation Argument

Individual employee interactions with AI are usually low-impact in isolation. A single prompt rarely constitutes a catastrophic event. But these interactions happen at massive scale. **Thousands of small, unobserved interactions every day across the org.**

High-frequency, low-visibility activity involving real enterprise data creates a larger cumulative exposure than low-frequency, high-visibility agent systems. The likelihood of data leakage, policy violation, or misuse is far higher simply because of *volume and informality*.

**Securing agents without securing workforce behavior is therefore not forward-looking. It is backwards.**

### Why Agent-First Strategies Fail

1. **Over-engineering rare scenarios** while under-engineering common ones.
2. **False sense of security** — visibility into a narrow subset of AI feels like coverage.
3. **Misallocated attention** — security, legal, IT teams debate complex futures while everyday usage proliferates.

The result is not reduced risk — it's delayed understanding.

Devise starts where the risk and value actually live: **the workforce.**

---

## Pillar 2 — Network-Layer Beats SDK-First

The dominant "AI observability" pattern today is SDK-first: vendors ship an SDK, ask AI app builders to instrument their apps, and observe what flows through the SDK.

**This is structurally broken** for enterprise AI governance because:

- **AI app builders won't all adopt your SDK.** Coverage is voluntary and partial.
- **Most workforce AI usage isn't through internal apps at all** — it's browser-based ChatGPT, desktop Cursor, embedded SaaS features, mobile assistants.
- **Self-reporting decays.** Every survey-based approach loses fidelity within 90 days.

Devise operates at the **network layer**. We read patterns from the customer's existing security stack (Zscaler, Palo Alto, Netskope). The result: every AI tool on every device on the network is visible — including the 6,500+ in the long tail of shadow AI.

**The network sees everything the network sees, regardless of vendor cooperation.**

---

## Pillar 3 — The Measurement Moat

Most "AI ROI" claims today are anecdotal: "We saved X hours" without an attribution chain back to a specific intervention. Boards are starting to notice.

Devise is the only system that owns the full chain:

```
Observe before  →  Intervene  →  Observe after  →  Attribute the delta
```

Because Devise both **performs** the intervention and **measures** the result, ROI is causal, not correlated. This is structurally different from any dashboard.

**Practical consequence:** customers can't easily replace Devise once installed without losing the proof that justified the spend in the first place. This is the retention moat.

---

## Pillar 4 — The Data Network Effect

Every customer's roles, tasks, and workflow patterns sharpen the engine for every other customer:

- **More roles observed** → better jobs-to-be-done inference for the next customer.
- **More workflows discovered** → larger "winners' library" to distribute across the install base.
- **More benchmarks** → sharper ROI projections in the demo for the next customer.
- **More friction patterns** → faster intervention for everyone.

Each new customer makes the engine smarter for everyone. **A true data network effect.**

Combined with the Professional Intelligence Layer (800M-profile cold-start data), Devise is useful on day zero and irreplaceable by year two.

---

## Pillar 5 — The Three Waves Are Converging

The market is moving on three vectors at once, and Devise sits at their intersection:

1. **Visibility wave** — *"We need to see our AI usage."* Most tools today show fragments.
2. **Adoption wave** — *"Seeing is not enough; the 95% pilot-failure rate is a behavior problem."* Devise is the only system that *acts*.
3. **Accountability wave** — *"What ROI did AI actually deliver?"* Boards, CFOs, and regulators are starting to ask. Owning the measurement loop is the only way to answer honestly.

Other vendors are picking one of the three. Devise unifies them.

---

## The Five-Year Vision

- **Year 1 (2026)** — Standard for workforce AI visibility in 1,000 mid-market companies. The "default install" alongside SSO.
- **Year 2** — Sanctioned-AI procurement decisions made through Devise. Workflow distribution at scale across the install base.
- **Year 3** — Devise becomes a measurable board-level KPI. "Adoption velocity" and "AI ROI per role" become standard report-out metrics.
- **Year 4** — Agent governance built on top of the workforce-AI observation layer. As autonomous agents proliferate, Devise is the only company that can govern *both* humans-with-AI and agents-with-humans.
- **Year 5** — Devise is the operating system for AI inside companies — what Salesforce became to revenue and Workday became to people.

---

## What Has To Be True

The thesis depends on a small number of bets:

1. **AI adoption keeps growing.** ✓ Empirically true; AI spend grew 4× in 2026.
2. **Companies will measure AI value seriously.** ✓ CFOs are already asking; the macro environment forces it.
3. **Behavior change requires a system, not a memo.** ✓ Confirmed by every enterprise AI program post-mortem we've read.
4. **The network layer remains the most complete observation surface.** ✓ Browser-extension and SDK-first approaches keep losing ground to encryption and edge AI.
5. **Cross-customer learning is permitted.** ✓ Customers consistently opt into anonymized benchmarks when they trust the data is theirs first.

If those five remain true, Devise is the inevitable category leader.

---

## See Also
- [03-PRODUCT.md](03-PRODUCT.md) — The system that closes the loop
- [04-TECHNOLOGY-ARCHITECTURE.md](04-TECHNOLOGY-ARCHITECTURE.md) — Why network-layer wins
- [10-COMPETITIVE-POSITIONING.md](10-COMPETITIVE-POSITIONING.md) — Side-by-side against adjacent categories
