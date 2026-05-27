---
url: "https://www.oximy.com/resources/glossary/tls"
title: "What is TLS (Transport Layer Security)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/tls#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# TLS (Transport Layer Security)

A cryptographic protocol that provides secure communication over computer networks, ensuring privacy, integrity, and authentication for data in transit.

Also known asSSL/TLSHTTPS

Full Definition

## What is TLS?

Transport Layer Security (TLS) is a cryptographic protocol that provides secure communication over computer networks. It's the successor to SSL and is used to secure web traffic (HTTPS), email, messaging, and other communications.

### TLS Provides

**Confidentiality**
Encryption prevents eavesdropping.

**Integrity**
Detect data tampering.

**Authentication**
Verify server (and optionally client) identity.

### TLS Handshake

1. **Client Hello**


   - Supported versions
   - Cipher suites
   - Random number

2. **Server Hello**


   - Selected version/cipher
   - Certificate
   - Random number

3. **Key Exchange**


   - Establish shared secret
   - Generate session keys

4. **Finished**


   - Verify handshake
   - Begin encrypted communication

### TLS Versions

| Version | Status | Notes |
| --- | --- | --- |
| SSL 3.0 | Deprecated | Insecure |
| TLS 1.0 | Deprecated | Insecure |
| TLS 1.1 | Deprecated | Insecure |
| TLS 1.2 | Supported | Widely used |
| TLS 1.3 | Recommended | Most secure |

### TLS 1.3 Improvements

- Faster handshake (1-RTT)
- Removed weak ciphers
- Forward secrecy required
- Encrypted handshake

### Certificate Types

- Domain Validation (DV)
- Organization Validation (OV)
- Extended Validation (EV)
- Wildcard certificates
- Multi-domain (SAN)

### Best Practices

- Use TLS 1.2+ only
- Prefer TLS 1.3
- Strong cipher suites
- Valid certificates
- HSTS headers
- Regular certificate rotation

[Previous\\
\\
Threat Modeling](https://www.oximy.com/resources/glossary/threat-modeling) [Next\\
\\
Tokenization](https://www.oximy.com/resources/glossary/tokenization)