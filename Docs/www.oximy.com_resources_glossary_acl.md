---
url: "https://www.oximy.com/resources/glossary/acl"
title: "What is Access Control List (ACL)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/acl#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Access Control List (ACL)

A list of permissions attached to a resource that specifies which users or system processes are granted access and what operations they can perform.

Also known asACLPermission List

Full Definition

## What is an Access Control List?

An Access Control List (ACL) is a table that defines which users or system processes have access to a specific resource and what operations they are permitted to perform. ACLs are fundamental to enforcing security policies.

### ACL Components

**Principal**
Who is granted access (user, group, role).

**Permission**
What actions are allowed (read, write, delete).

**Resource**
What is being protected (file, database, API).

### ACL Types

**Discretionary ACL (DACL)**

- Owner controls access
- Flexible permissions
- Common in file systems

**System ACL (SACL)**

- Auditing and logging
- Track access attempts
- Windows security

**Network ACLs**

- Firewall rules
- Traffic filtering
- IP/port based

### Example ACL

| Principal | Permission | Resource |
| --- | --- | --- |
| admin | read, write, delete | /data/\* |
| user1 | read | /data/reports |
| group:devs | read, write | /code/\* |

### ACL vs RBAC

| ACL | RBAC |
| --- | --- |
| Per-resource | Per-role |
| Fine-grained | Scalable |
| Can be complex | Easier management |
| Direct assignment | Role assignment |

### Best Practices

- Default deny
- Least privilege
- Regular audits
- Remove stale entries
- Document permissions

[Next\\
\\
Adversarial Attacks](https://www.oximy.com/resources/glossary/adversarial-attacks)