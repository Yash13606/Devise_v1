---
url: "https://www.oximy.com/resources/glossary/certificate-authority"
title: "What is Certificate Authority (CA)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/certificate-authority#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Certificate Authority (CA)

A trusted entity that issues digital certificates used to verify the identity of websites, organizations, or individuals in secure communications.

Also known asCACertification Authority

Full Definition

## What is a Certificate Authority?

A Certificate Authority (CA) is a trusted organization that issues digital certificates. These certificates verify the identity of entities (websites, organizations, individuals) and enable secure encrypted communications through PKI.

### CA Hierarchy

**Root CA**

- Top of trust chain
- Self-signed certificate
- Highly protected

**Intermediate CA**

- Signed by Root CA
- Issues end-entity certificates
- Limits root exposure

**End-Entity**

- Websites, servers
- Users, devices
- Issued by Intermediate

### Certificate Types

**Domain Validation (DV)**

- Verifies domain control
- Automated issuance
- Basic trust

**Organization Validation (OV)**

- Verifies organization
- Manual validation
- Business identity

**Extended Validation (EV)**

- Rigorous verification
- Legal entity validation
- Highest trust

### Certificate Lifecycle

1. **Generation**


   - Key pair creation
   - CSR submission

2. **Validation**


   - Identity verification
   - Domain control

3. **Issuance**


   - Certificate creation
   - Distribution

4. **Renewal**


   - Before expiration
   - Revalidation

5. **Revocation**


   - If compromised
   - CRL/OCSP updates

### Public CAs

- Let's Encrypt
- DigiCert
- Sectigo
- GlobalSign

[Previous\\
\\
CCPA](https://www.oximy.com/resources/glossary/ccpa) [Next\\
\\
Chain-of-Thought Prompting](https://www.oximy.com/resources/glossary/chain-of-thought)