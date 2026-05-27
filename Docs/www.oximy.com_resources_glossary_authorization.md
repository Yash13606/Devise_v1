---
url: "https://www.oximy.com/resources/glossary/authorization"
title: "What is Authorization? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/authorization#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Authorization

The process of determining what actions, resources, or services an authenticated user or system is permitted to access.

Also known asAuthZAccess Control

Full Definition

## What is Authorization?

Authorization (AuthZ) is the security process that determines whether an authenticated entity has permission to access a resource or perform an action. It follows authentication and enforces access policies based on identity, roles, or attributes.

### Authorization vs Authentication

| Authentication | Authorization |
| --- | --- |
| Who are you? | What can you do? |
| Identity verification | Permission granting |
| Occurs first | Occurs after authN |
| Login process | Access control |

### Authorization Models

**Role-Based (RBAC)**
Access based on user roles.
Simple, widely adopted.

**Attribute-Based (ABAC)**
Access based on attributes.
Fine-grained, context-aware.

**Policy-Based (PBAC)**
Access based on policies.
Flexible, complex rules.

**Relationship-Based (ReBAC)**
Access based on relationships.
Social/graph-based access.

### Implementation Patterns

**Access Control Lists (ACLs)**

- Resource-centric
- List of permissions per resource

**Capabilities**

- User-centric
- Tokens representing permissions

**Policy Engines**

- Centralized decision-making
- OPA, Cedar, Casbin

### Best Practices

- Implement least privilege
- Use centralized authorization
- Audit access decisions
- Regular permission reviews
- Separate authN from authZ

[Previous\\
\\
Authentication](https://www.oximy.com/resources/glossary/authentication) [Next\\
\\
Bias Detection](https://www.oximy.com/resources/glossary/bias-detection)