---
url: "https://www.oximy.com/resources/glossary/mfa"
title: "What is Multi-Factor Authentication (MFA)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/mfa#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Multi-Factor Authentication (MFA)

A security mechanism that requires users to provide two or more verification factors to gain access, combining something they know, have, or are.

Also known asMFATwo-Factor Authentication2FAMulti-Step Verification

Full Definition

## What is Multi-Factor Authentication?

Multi-Factor Authentication (MFA) is a security method that requires users to provide multiple forms of verification before accessing an account or system. It combines two or more independent credentials from different categories to create a layered defense.

### Authentication Factors

**Something You Know**

- Passwords
- PINs
- Security questions

**Something You Have**

- Mobile phone (SMS, authenticator app)
- Hardware token
- Smart card
- Security key (FIDO2/WebAuthn)

**Something You Are**

- Fingerprint
- Face recognition
- Iris scan
- Voice recognition

### MFA Methods (Best to Worst)

1. **Hardware Security Keys** (FIDO2) - Phishing resistant
2. **Authenticator Apps** (TOTP) - Good security
3. **Push Notifications** \- Convenient but can be MFA-bombed
4. **SMS/Voice** \- Vulnerable to SIM swapping
5. **Email** \- Weakest, not recommended

### Implementation Best Practices

- Require MFA for all users
- Prioritize phishing-resistant methods
- Provide backup/recovery options
- Enable MFA for privileged accounts first
- Consider adaptive/risk-based MFA
- Train users on MFA importance

### Common Attacks on MFA

- Phishing for OTP codes
- SIM swapping
- MFA fatigue/bombing
- Session hijacking
- Social engineering helpdesk

[Previous\\
\\
Model Risk Management](https://www.oximy.com/resources/glossary/model-risk-management) [Next\\
\\
Mutual TLS (mTLS)](https://www.oximy.com/resources/glossary/mtls)