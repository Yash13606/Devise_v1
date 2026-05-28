---
url: "https://www.oximy.com/resources/glossary/sso"
title: "What is Single Sign-On (SSO)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/sso#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Single Sign-On (SSO)

An authentication method that allows users to access multiple applications with one set of login credentials, improving user experience and security management.

Also known asSSOSingle Sign On

Full Definition

## What is Single Sign-On?

Single Sign-On (SSO) is an authentication scheme that allows users to log in once and gain access to multiple related but independent software systems. Instead of maintaining separate credentials for each application, users authenticate once with an identity provider.

### How SSO Works

1. User attempts to access an application
2. Application redirects to identity provider (IdP)
3. User authenticates with IdP (if not already)
4. IdP issues token/assertion
5. Application validates token and grants access
6. User can access other connected apps without re-authenticating

### SSO Protocols

**SAML 2.0**

- XML-based
- Enterprise standard
- Complex but mature

**OpenID Connect (OIDC)**

- Built on OAuth 2.0
- JSON/REST-based
- Modern and flexible

**OAuth 2.0**

- Authorization (not authentication)
- Often combined with OIDC

### Benefits

**For Users**

- Single set of credentials
- Reduced password fatigue
- Faster access to applications

**For Organizations**

- Centralized access control
- Easier user provisioning
- Better security posture
- Simplified compliance

### SSO Providers

- Okta
- Azure AD / Entra ID
- Google Workspace
- OneLogin
- Auth0
- Ping Identity

### Security Considerations

- SSO is a high-value target
- Requires strong MFA
- Session management critical
- Token security important
- IdP availability matters

[Previous\\
\\
SIEM](https://www.oximy.com/resources/glossary/siem) [Next\\
\\
SOC 2](https://www.oximy.com/resources/glossary/soc-2)