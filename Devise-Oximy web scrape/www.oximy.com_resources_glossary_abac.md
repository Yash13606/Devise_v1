---
url: "https://www.oximy.com/resources/glossary/abac"
title: "What is Attribute-Based Access Control (ABAC)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/abac#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Attribute-Based Access Control (ABAC)

An access control method that evaluates attributes (user, resource, environment) against policies to make authorization decisions, enabling fine-grained access control.

Also known asABACAttribute Based Access Control

Full Definition

## What is Attribute-Based Access Control?

Attribute-Based Access Control (ABAC) is an authorization model that evaluates attributes (or characteristics) rather than roles to determine access. It considers attributes of the user, resource, action, and environment to make fine-grained access decisions.

### Attribute Categories

**Subject Attributes**

- Department
- Clearance level
- Job title
- Training completed

**Resource Attributes**

- Classification level
- Owner
- Type
- Creation date

**Action Attributes**

- Read, write, delete
- Approve, submit

**Environment Attributes**

- Time of day
- Location
- Device type
- Network zone

### ABAC vs. RBAC

| ABAC | RBAC |
| --- | --- |
| Attribute-based | Role-based |
| Fine-grained | Coarse-grained |
| Dynamic policies | Static assignments |
| Complex to manage | Simpler to manage |
| Context-aware | Position-based |

### Policy Example

```
IF subject.department == "Engineering"
AND resource.classification == "Internal"
AND action == "read"
AND environment.network == "Corporate"
THEN permit
```

### Benefits

- Granular access control
- Context-aware decisions
- Reduced role explosion
- Dynamic authorization
- Compliance support

[Previous\\
\\
Attack Surface](https://www.oximy.com/resources/glossary/attack-surface) [Next\\
\\
Audit Log](https://www.oximy.com/resources/glossary/audit-log)