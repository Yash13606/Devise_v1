# 06 — Security & Compliance

> Built on trust. Verified by design.
> Built for the CISO conversation *before* the deal closes.

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
Inputs, outputs, and documents from customer environments are **never** used to train AI models. Contractually guaranteed in every MSA.

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
- Access is always verified, limited, and logged. **No implicit trust.**
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

> *"Employees see 'AI recommendations for your role.' The data infers, it doesn't display."*

The Professional Intelligence Layer (used to map team structure and infer jobs-to-be-done) powers the experience but is **never surfaced to end users**. Employees never see raw inference data; they see useful, role-relevant recommendations.

Practically, this means:
- A salesperson coached on AI prospecting sees: "Try this workflow — 6 hrs/wk for similar roles."
- They do *not* see: "Inferred role: Senior SDR, Mid-Market segment, US East Region."
- The first is useful. The second would be creepy. Devise only ships the first.

---

## AI Standards Alignment

Devise is aligned with all major AI security and governance frameworks, not as marketing claims but as concrete control mappings published in the Trust Center.

| Framework | What it covers | Why we align |
|---|---|---|
| **OWASP LLM Top 10** | Critical LLM vulnerabilities (prompt injection, training data poisoning, etc.) | Protection across all 10 listed risks |
| **NIST AI RMF** | AI Risk Management Framework | Our governance posture maps to RMF Govern / Map / Measure / Manage functions |
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

## What Customers Get During Security Review

A pre-built **CISO Pack**:
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

## See Also
- [04-TECHNOLOGY-ARCHITECTURE.md](04-TECHNOLOGY-ARCHITECTURE.md) — Where security is enforced architecturally
- [05-VERTICALS-AND-SOLUTIONS.md](05-VERTICALS-AND-SOLUTIONS.md) — Vertical-specific compliance angles
- [07-INTEGRATIONS-ECOSYSTEM.md](07-INTEGRATIONS-ECOSYSTEM.md) — Connector security model
