---
url: "https://www.oximy.com/resources/glossary/data-masking"
title: "What is Data Masking? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/data-masking#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Data & Privacy](https://www.oximy.com/resources/glossary?category=data)

# Data Masking

A technique that replaces sensitive data with realistic but fictional data to protect it in non-production environments while maintaining data utility.

Also known asData ObfuscationData Anonymization

Full Definition

## What is Data Masking?

Data masking (also called data obfuscation) is a method of creating a structurally similar but inauthentic version of data. It protects sensitive information while allowing the data to remain usable for testing, development, or analytics.

### Types of Data Masking

**Static Data Masking**

- Masks data at rest
- Creates sanitized copies
- For non-production environments

**Dynamic Data Masking**

- Masks data in real-time
- Based on user permissions
- Original data unchanged

**On-the-Fly Masking**

- Masks during data transfer
- ETL processes
- Data migrations

### Masking Techniques

**Substitution**
Replace with realistic values.
John Smith → Jane Doe

**Shuffling**
Rearrange within columns.
Randomize between rows.

**Number Variance**
Add random variance.
$50,000 → $52,347

**Encryption**
Reversible transformation.
Requires key management.

**Nulling/Deletion**
Replace with null/empty.
Simple but loses utility.

**Character Masking**
Partial visibility.
123-45-6789 → XXX-XX-6789

### Use Cases

- Development and testing
- Analytics and reporting
- Training environments
- Third-party sharing
- Compliance requirements

### Best Practices

- Maintain referential integrity
- Preserve data formats
- Test masked data utility
- Document masking rules
- Secure masking processes

[Previous\\
\\
Data Loss Prevention (DLP)](https://www.oximy.com/resources/glossary/dlp) [Next\\
\\
Data Minimization](https://www.oximy.com/resources/glossary/data-minimization)