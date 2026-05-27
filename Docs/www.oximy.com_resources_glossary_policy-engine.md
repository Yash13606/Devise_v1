---
url: "https://www.oximy.com/resources/glossary/policy-engine"
title: "What is Policy Engine? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/policy-engine#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Policy Engine

A software component that evaluates and enforces access control policies, making authorization decisions based on defined rules and attributes.

Also known asAuthorization EngineAccess Control Engine

Full Definition

## What is a Policy Engine?

A policy engine is a software component that evaluates access control policies and makes authorization decisions. It separates policy decisions from application code, enabling centralized, consistent, and auditable access control across systems.

### Core Concepts

**Policy**
Rules defining who can do what.

**Evaluation**
Processing requests against policies.

**Decision**
Allow, deny, or conditional result.

**Enforcement**
Acting on the decision.

### Architecture

```
Application → Policy Enforcement Point (PEP)
                      ↓
              Policy Decision Point (PDP)
                      ↓
              Policy Information Point (PIP)
```

### Policy Languages

**Rego (OPA)**

```
allow {
  input.method == "GET"
  input.user.role == "admin"
}
```

**Cedar (AWS)**

```
permit(
  principal == User::"alice",
  action == Action::"read",
  resource == Document::"report"
);
```

### Popular Policy Engines

**Open Policy Agent (OPA)**

- General purpose
- Rego language
- CNCF project

**Cedar**

- AWS-developed
- Authorization focused
- Verified security

**Casbin**

- Multiple models
- Many languages
- Flexible

**Zanzibar-Based**

- Google Zanzibar paper
- SpiceDB, Authzed

### Use Cases

- API authorization
- Kubernetes admission control
- Infrastructure policies
- Data access control
- Feature flags

### Benefits

- Centralized management
- Audit trail
- Consistent enforcement
- Policy as code
- Separation of concerns

[Previous\\
\\
Phishing](https://www.oximy.com/resources/glossary/phishing) [Next\\
\\
Privacy by Design](https://www.oximy.com/resources/glossary/privacy-by-design)