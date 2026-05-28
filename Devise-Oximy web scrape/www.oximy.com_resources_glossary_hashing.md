---
url: "https://www.oximy.com/resources/glossary/hashing"
title: "What is Hashing? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/hashing#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Hashing

A one-way cryptographic function that converts input data into a fixed-size string of characters, used for data integrity verification and password storage.

Also known asHash FunctionsMessage Digest

Full Definition

## What is Hashing?

Hashing is the process of converting input data of any size into a fixed-size string of characters using a mathematical function called a hash function. Unlike encryption, hashing is a one-way process - the original data cannot be recovered from the hash.

### Hash Function Properties

**Deterministic**
Same input always produces same output.

**Fixed Output**
Any input produces same-length hash.

**One-Way**
Cannot reverse-engineer input from hash.

**Collision Resistant**
Hard to find two inputs with same hash.

**Avalanche Effect**
Small input change = large output change.

### Common Hash Algorithms

| Algorithm | Output Size | Status |
| --- | --- | --- |
| MD5 | 128 bits | Broken |
| SHA-1 | 160 bits | Deprecated |
| SHA-256 | 256 bits | Secure |
| SHA-3 | Variable | Secure |
| BLAKE2 | Variable | Secure |

### Use Cases

**Password Storage**
Store hash, not password.
Use with salt and key stretching.

**Data Integrity**
File checksums.
Download verification.

**Digital Signatures**
Hash then sign.
Efficiency.

**Deduplication**
Identify duplicate data.
Content addressing.

### Password Hashing

**DO NOT use raw hashes!**

Use password-specific functions:

- bcrypt
- Argon2
- scrypt
- PBKDF2

These add:

- Salting
- Key stretching
- Memory hardness

### Best Practices

- Use SHA-256 or SHA-3
- Never use MD5 or SHA-1 for security
- Use password-specific functions for credentials
- Add unique salts
- Regular algorithm updates

[Previous\\
\\
Hallucination](https://www.oximy.com/resources/glossary/hallucination) [Next\\
\\
HIPAA](https://www.oximy.com/resources/glossary/hipaa)