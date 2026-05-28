---
url: "https://www.oximy.com/resources/glossary/sast"
title: "What is Static Application Security Testing (SAST)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/sast#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Static Application Security Testing (SAST)

A testing methodology that analyzes application source code, bytecode, or binaries for security vulnerabilities without executing the program.

Also known asStatic AnalysisSource Code Analysis

Full Definition

## What is SAST?

Static Application Security Testing (SAST) is a white-box testing methodology that analyzes source code, bytecode, or binaries to find security vulnerabilities. It identifies issues early in development without executing the application.

### How SAST Works

**1\. Code Analysis**

- Parse source code
- Build code model
- Analyze data flows

**2\. Pattern Matching**

- Known vulnerability patterns
- Security rules
- Best practice violations

**3\. Reporting**

- Vulnerability list
- Code locations
- Remediation guidance

### Vulnerability Detection

- SQL injection
- Cross-site scripting (XSS)
- Buffer overflows
- Hardcoded credentials
- Insecure configurations
- Path traversal

### SAST vs DAST

| SAST | DAST |
| --- | --- |
| White-box | Black-box |
| Source code | Running application |
| Early in SDLC | Later in SDLC |
| All code paths | Exercised paths |
| Language-specific | Language-agnostic |

### Integration Points

**IDE**

- Real-time feedback
- Developer workflow

**CI/CD**

- Automated scanning
- Build gates

**Pull Requests**

- Code review
- Change analysis

### Challenges

- False positives
- Performance on large codebases
- Language support
- Developer adoption
- Remediation effort

### Tools

**Commercial**

- Checkmarx
- Fortify
- Veracode
- Snyk Code

**Open Source**

- Semgrep
- SonarQube
- Bandit (Python)

[Previous\\
\\
Software Bill of Materials (SBOM)](https://www.oximy.com/resources/glossary/sbom) [Next\\
\\
Supply Chain Security](https://www.oximy.com/resources/glossary/supply-chain-security)