---
url: "https://www.oximy.com/resources/glossary/homomorphic-encryption"
title: "What is Homomorphic Encryption? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/homomorphic-encryption#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Homomorphic Encryption

A form of encryption that allows computations to be performed on encrypted data without decrypting it, preserving privacy while enabling data processing.

Also known asHEFHE

Full Definition

## What is Homomorphic Encryption?

Homomorphic encryption (HE) is a cryptographic technique that allows computations to be performed directly on encrypted data. The results, when decrypted, match what would have been obtained by performing the same operations on the unencrypted data.

### How It Works

```
Encrypt(A) + Encrypt(B) = Encrypt(A + B)
```

Compute on ciphertext, get encrypted result.

### Types of Homomorphic Encryption

**Partially Homomorphic**

- Supports one operation type
- Either addition OR multiplication
- RSA (multiplication), Paillier (addition)

**Somewhat Homomorphic**

- Limited number of operations
- Both addition and multiplication
- Noise accumulates

**Fully Homomorphic (FHE)**

- Unlimited operations
- Any computation possible
- Bootstrapping to manage noise

### Use Cases

**Healthcare**
Analyze patient data without decryption.

**Financial Services**
Process encrypted transactions.

**Machine Learning**
Train on encrypted data.

**Cloud Computing**
Compute on encrypted cloud data.

### Current Limitations

**Performance**

- 1,000-1,000,000x slower
- Significant overhead
- Large ciphertext expansion

**Complexity**

- Specialized programming
- Limited libraries
- Expert knowledge required

### Standards and Libraries

**Libraries**

- Microsoft SEAL
- HElib
- TFHE
- OpenFHE

**Standards**

- Emerging standardization efforts
- ISO/IEC ongoing work

[Previous\\
\\
HIPAA](https://www.oximy.com/resources/glossary/hipaa) [Next\\
\\
Identity and Access Management (IAM)](https://www.oximy.com/resources/glossary/iam)