---
url: "https://www.oximy.com/resources/glossary/jwt"
title: "What is JWT (JSON Web Token)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/jwt#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# JWT (JSON Web Token)

A compact, URL-safe token format used to securely transmit information between parties as a JSON object, commonly used for authentication and information exchange.

Also known asJSON Web TokenJWT Token

Full Definition

## What is a JWT?

A JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact, self-contained way to securely transmit information between parties as a JSON object. JWTs are commonly used for authentication and authorization in web applications and APIs.

### JWT Structure

A JWT consists of three parts separated by dots:

**Header**

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload (Claims)**

```
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Signature**
Created by signing header + payload with a secret.

### Common Claims

- **iss**: Issuer
- **sub**: Subject (user ID)
- **aud**: Audience
- **exp**: Expiration time
- **iat**: Issued at
- **nbf**: Not before

### JWT Best Practices

- Use strong signing algorithms (RS256, ES256)
- Set appropriate expiration times
- Validate all claims
- Don't store sensitive data in payload
- Use HTTPS for transmission
- Implement token refresh mechanisms

### JWT vs Session Cookies

| JWT | Sessions |
| --- | --- |
| Stateless | Stateful |
| Scalable | Server storage needed |
| Cross-domain friendly | Same-domain typically |
| Larger payload | Smaller cookies |

[Previous\\
\\
Jailbreaking (AI)](https://www.oximy.com/resources/glossary/jailbreaking) [Next\\
\\
Key Management](https://www.oximy.com/resources/glossary/key-management)