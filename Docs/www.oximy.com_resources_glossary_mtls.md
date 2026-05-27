---
url: "https://www.oximy.com/resources/glossary/mtls"
title: "What is Mutual TLS (mTLS)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/mtls#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Mutual TLS (mTLS)

A security protocol where both client and server authenticate each other using certificates, providing stronger authentication than standard TLS.

Also known asMutual AuthenticationTwo-Way TLS

Full Definition

## What is Mutual TLS?

Mutual TLS (mTLS) is a security protocol where both parties in a connection authenticate each other using digital certificates. Unlike standard TLS where only the server is authenticated, mTLS requires the client to also present a certificate.

### Standard TLS vs mTLS

| Standard TLS | Mutual TLS |
| --- | --- |
| Server cert only | Both have certs |
| Server verified | Both verified |
| One-way auth | Two-way auth |
| Web browsers | Service-to-service |

### How mTLS Works

1. **Client Hello**


   - Request connection
   - Supported protocols

2. **Server Certificate**


   - Server sends certificate
   - Client validates

3. **Client Certificate Request**


   - Server requests client cert

4. **Client Certificate**


   - Client sends certificate
   - Server validates

5. **Secure Connection**


   - Both authenticated
   - Encrypted channel

### Use Cases

**Service Mesh**

- Istio, Linkerd
- Zero trust networking

**API Security**

- Machine-to-machine auth
- High-security APIs

**Microservices**

- Service authentication
- Internal communications

### Implementation

**Certificate Management**

- PKI infrastructure
- Certificate rotation
- Revocation handling

**Configuration**

- Server setup
- Client configuration
- CA trust stores

### Challenges

- Certificate management
- Complexity
- Performance overhead
- Debugging difficulty

[Previous\\
\\
Multi-Factor Authentication (MFA)](https://www.oximy.com/resources/glossary/mfa) [Next\\
\\
Network Segmentation](https://www.oximy.com/resources/glossary/network-segmentation)