---
url: "https://www.oximy.com/resources/glossary/digital-signature"
title: "What is Digital Signature? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/digital-signature#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Digital Signature

A cryptographic mechanism that verifies the authenticity and integrity of digital messages or documents, providing proof of origin and non-repudiation.

Also known asElectronic SignatureCryptographic Signature

Full Definition

## What is a Digital Signature?

A digital signature is a cryptographic technique that verifies the authenticity and integrity of a digital message, document, or software. It provides proof that the content was created by the claimed sender and hasn't been altered.

### How It Works

1. **Signing**


   - Hash the message
   - Encrypt hash with private key
   - Attach signature to message

2. **Verification**


   - Decrypt signature with public key
   - Hash the received message
   - Compare hashes

### Properties

**Authentication**
Verifies sender identity.

**Integrity**
Detects any modifications.

**Non-repudiation**
Sender cannot deny signing.

### Signature Algorithms

| Algorithm | Key Type | Security |
| --- | --- | --- |
| RSA | RSA | Well-established |
| ECDSA | Elliptic Curve | Efficient |
| EdDSA | Edwards Curve | Modern, fast |
| DSA | DSA | Legacy |

### Use Cases

- Code signing
- Document signing
- Email (S/MIME, PGP)
- Blockchain transactions
- API authentication
- Software distribution

### Standards

- PKCS #7
- XML DSig
- PDF signatures
- CMS (Cryptographic Message Syntax)

### Best Practices

- Protect private keys
- Use strong algorithms
- Include timestamps
- Verify certificates
- Maintain key security

[Previous\\
\\
Differential Privacy](https://www.oximy.com/resources/glossary/differential-privacy) [Next\\
\\
Disaster Recovery (DR)](https://www.oximy.com/resources/glossary/disaster-recovery)