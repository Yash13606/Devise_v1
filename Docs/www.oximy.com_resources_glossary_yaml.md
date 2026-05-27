---
url: "https://www.oximy.com/resources/glossary/yaml"
title: "What is YAML? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/yaml#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Cloud & Infrastructure](https://www.oximy.com/resources/glossary?category=cloud)

# YAML

A human-readable data serialization format commonly used for configuration files, CI/CD pipelines, and infrastructure as code.

Also known asYAML Ain't Markup Language

Full Definition

## What is YAML?

YAML (YAML Ain't Markup Language) is a human-readable data serialization format. It's widely used for configuration files, CI/CD pipelines, Kubernetes manifests, and infrastructure as code due to its readability and ease of use.

### YAML Syntax

**Key-Value Pairs**

```
name: John Doe
age: 30
```

**Lists**

```
fruits:
  - apple
  - banana
  - orange
```

**Nested Objects**

```
person:
  name: John
  address:
    city: New York
    zip: 10001
```

**Multiline Strings**

```
description: |
  This is a multiline
  string in YAML
```

### Common Use Cases

**Kubernetes**

- Pod definitions
- Deployments
- ConfigMaps

**CI/CD**

- GitHub Actions
- GitLab CI
- CircleCI

**Configuration**

- Application config
- Docker Compose
- Ansible playbooks

### Security Considerations

**YAML Bombs**
Recursive aliases can cause DoS.

**Arbitrary Code Execution**
Some parsers execute code in tags.

**Injection**
User input in YAML can be dangerous.

### Best Practices

- Use safe YAML parsers
- Validate YAML input
- Avoid loading untrusted YAML
- Lint configuration files
- Use schema validation
- Version control configs

### Comparison

| Format | Readability | Comments | Use Case |
| --- | --- | --- | --- |
| YAML | High | Yes | Config |
| JSON | Medium | No | APIs |
| TOML | High | Yes | Config |
| XML | Low | Yes | Legacy |

[Previous\\
\\
Web3 Security](https://www.oximy.com/resources/glossary/web3-security) [Next\\
\\
Zero Trust](https://www.oximy.com/resources/glossary/zero-trust)