---
url: "https://www.oximy.com/resources/glossary/rbac"
title: "What is Role-Based Access Control (RBAC)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/rbac#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Role-Based Access Control (RBAC)

An access control method that assigns permissions to users based on their roles within an organization, simplifying permission management at scale.

Also known asRBACRole Based Access

Full Definition

## What is Role-Based Access Control?

Role-Based Access Control (RBAC) is a method of regulating access to resources based on the roles of individual users within an organization. Instead of assigning permissions directly to users, permissions are assigned to roles, and users are assigned to roles.

### Core Concepts

**Users**: Individual accounts
**Roles**: Named collections of permissions
**Permissions**: Allowed actions on resources
**Sessions**: User's active roles

### RBAC Models

**RBAC0 (Core)**

- Users assigned to roles
- Roles have permissions
- Basic model

**RBAC1 (Hierarchical)**

- Role inheritance
- Senior roles inherit junior permissions
- Reduces redundancy

**RBAC2 (Constrained)**

- Separation of duties
- Cardinality constraints
- Prerequisite roles

**RBAC3 (Consolidated)**

- Combines RBAC1 and RBAC2
- Full feature set

### Implementation Example

```
Role: Developer
  - Read: source code
  - Write: source code
  - Execute: CI/CD pipelines

Role: Security Admin
  - Read: security logs
  - Write: security policies
  - Execute: vulnerability scans

User: Alice
  - Roles: [Developer]

User: Bob
  - Roles: [Developer, Security Admin]
```

### Benefits

- Simplified administration
- Reduced errors
- Compliance support
- Scalability
- Audit capability

### RBAC vs. ABAC

| RBAC | ABAC |
| --- | --- |
| Role-based | Attribute-based |
| Simpler | More flexible |
| Coarse-grained | Fine-grained |
| Easier to audit | Complex policies |

[Previous\\
\\
Retrieval-Augmented Generation (RAG)](https://www.oximy.com/resources/glossary/rag) [Next\\
\\
Runtime Application Self-Protection (RASP)](https://www.oximy.com/resources/glossary/rasp)