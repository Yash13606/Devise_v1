---
url: "https://www.oximy.com/resources/glossary/oauth"
title: "What is OAuth 2.0? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/oauth#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# OAuth 2.0

An open authorization framework that enables applications to obtain limited access to user accounts on third-party services without exposing user credentials.

Also known asOAuthOpen Authorization

Full Definition

## What is OAuth 2.0?

OAuth 2.0 is an industry-standard authorization framework that allows applications to obtain limited access to user accounts on an HTTP service. It works by delegating user authentication to the service hosting the user account and authorizing third-party applications to access that account.

### Key Roles

**Resource Owner**: The user who authorizes access
**Client**: The application requesting access
**Authorization Server**: Issues access tokens
**Resource Server**: Hosts protected resources

### Grant Types

**Authorization Code**

- Most secure for web apps
- Involves redirect flow
- Exchanges code for token

**Client Credentials**

- Machine-to-machine auth
- No user involvement
- Service account access

**Device Code**

- For devices without browsers
- TV apps, CLI tools
- User authorizes on separate device

**Refresh Token**

- Obtain new access tokens
- Without re-authentication
- Long-lived sessions

### OAuth 2.0 vs OpenID Connect

| OAuth 2.0 | OpenID Connect |
| --- | --- |
| Authorization | Authentication + Authorization |
| Access tokens | ID tokens + Access tokens |
| API access | User identity |

### Security Best Practices

- Use PKCE for public clients
- Validate redirect URIs
- Short-lived access tokens
- Secure token storage
- Implement token revocation

[Previous\\
\\
NIST AI Risk Management Framework](https://www.oximy.com/resources/glossary/nist-ai-rmf) [Next\\
\\
Observability](https://www.oximy.com/resources/glossary/observability)