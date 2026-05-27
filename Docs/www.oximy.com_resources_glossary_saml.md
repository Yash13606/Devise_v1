---
url: "https://www.oximy.com/resources/glossary/saml"
title: "What is SAML? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/saml#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# SAML

Security Assertion Markup Language - an XML-based standard for exchanging authentication and authorization data between identity providers and service providers.

Also known asSecurity Assertion Markup Language

Full Definition

## What is SAML?

Security Assertion Markup Language (SAML) is an open standard for exchanging authentication and authorization data between parties. It enables Single Sign-On (SSO) by allowing identity providers to pass authentication tokens to service providers.

### SAML Components

**Identity Provider (IdP)**
Authenticates users and issues assertions.
Examples: Okta, Azure AD, OneLogin

**Service Provider (SP)**
Relies on IdP for authentication.
Examples: Salesforce, Slack, AWS

**Assertions**
XML documents containing:

- Authentication statements
- Attribute statements
- Authorization statements

### SAML Flow

1. User accesses service provider
2. SP generates SAML request
3. User redirected to IdP
4. User authenticates with IdP
5. IdP generates SAML assertion
6. Assertion sent to SP
7. SP validates and grants access

### SAML vs. OAuth/OIDC

| SAML | OAuth/OIDC |
| --- | --- |
| XML-based | JSON-based |
| Enterprise focus | Modern apps focus |
| More complex | Simpler |
| Mature standard | Newer standard |
| Web browser SSO | APIs and mobile |

### Security Considerations

- Assertion signature validation
- Certificate management
- Replay attack prevention
- Secure attribute handling
- Proper logout implementation

### Common Vulnerabilities

- XML signature wrapping
- Missing signature validation
- Assertion replay
- Comment injection

[Previous\\
\\
Runtime Application Self-Protection (RASP)](https://www.oximy.com/resources/glossary/rasp) [Next\\
\\
Secrets Management](https://www.oximy.com/resources/glossary/secrets-management)