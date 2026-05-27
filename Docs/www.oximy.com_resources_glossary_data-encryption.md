---
url: "https://www.oximy.com/resources/glossary/data-encryption"
title: "What is Data Encryption? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/data-encryption#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Data Encryption

The process of converting data into an encoded format that can only be read by authorized parties who possess the decryption key.

Also known asEncryptionData Encoding

Full Definition

## What is Data Encryption?

Data encryption is the process of converting readable data (plaintext) into an unreadable format (ciphertext) using an algorithm and encryption key. Only parties with the correct decryption key can convert the data back to its original form.

### Encryption States

**At Rest**
Data stored on devices:

- Database encryption
- File system encryption
- Full disk encryption

**In Transit**
Data moving between systems:

- TLS/SSL
- VPN
- Secure protocols

**In Use**
Data being processed:

- Confidential computing
- Homomorphic encryption
- Secure enclaves

### Encryption Types

**Symmetric Encryption**

```
Plaintext → [Key] → Ciphertext → [Same Key] → Plaintext
```

- AES-256
- ChaCha20
- Fast, efficient

**Asymmetric Encryption**

```
Plaintext → [Public Key] → Ciphertext → [Private Key] → Plaintext
```

- RSA
- Elliptic Curve
- Key exchange

### Common Standards

| Algorithm | Key Size | Use Case |
| --- | --- | --- |
| AES-256 | 256-bit | Data at rest |
| RSA-2048 | 2048-bit | Key exchange |
| ChaCha20 | 256-bit | TLS, mobile |
| AES-GCM | 256-bit | Authenticated |

### Best Practices

- Use strong algorithms (AES-256)
- Secure key management
- Encrypt sensitive data
- Use authenticated encryption
- Regular key rotation

[Previous\\
\\
Data Classification](https://www.oximy.com/resources/glossary/data-classification) [Next\\
\\
Data Governance](https://www.oximy.com/resources/glossary/data-governance)