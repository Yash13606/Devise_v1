---
url: "https://www.oximy.com/resources/glossary/cvss"
title: "What is CVSS? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/cvss#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# CVSS

Common Vulnerability Scoring System - a standardized framework for rating the severity of security vulnerabilities on a scale of 0 to 10.

Also known asVulnerability ScoringCVE Scoring

Full Definition

## What is CVSS?

The Common Vulnerability Scoring System (CVSS) is an open framework for communicating the characteristics and severity of software vulnerabilities. It produces a numerical score (0-10) reflecting the severity of a vulnerability.

### CVSS Score Ranges

| Score | Severity |
| --- | --- |
| 0.0 | None |
| 0.1-3.9 | Low |
| 4.0-6.9 | Medium |
| 7.0-8.9 | High |
| 9.0-10.0 | Critical |

### CVSS v3.1 Metric Groups

**Base Metrics**
Intrinsic characteristics:

- Attack Vector (AV)
- Attack Complexity (AC)
- Privileges Required (PR)
- User Interaction (UI)
- Scope (S)
- Impact: CIA

**Temporal Metrics**
Change over time:

- Exploit Code Maturity
- Remediation Level
- Report Confidence

**Environmental Metrics**
Organization-specific:

- Modified Base Metrics
- CIA Requirements

### Example Calculation

**CVE-2021-44228 (Log4Shell)**

- Base Score: 10.0 (Critical)
- Vector: Network
- Complexity: Low
- Privileges: None
- Impact: Complete

### Using CVSS

**Prioritization**

- Rank vulnerabilities
- Resource allocation
- Risk decisions

**Limitations**

- Doesn't consider context
- No threat intelligence
- Requires supplementation

### Best Practices

- Combine with threat intel
- Consider asset criticality
- Use environmental scores
- Don't rely solely on CVSS

[Previous\\
\\
Cryptography](https://www.oximy.com/resources/glossary/cryptography) [Next\\
\\
Data Breach](https://www.oximy.com/resources/glossary/data-breach)