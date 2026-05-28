---
url: "https://www.oximy.com/resources/glossary/rate-limiting"
title: "What is Rate Limiting? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/rate-limiting#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Rate Limiting

A technique that controls the number of requests a user or system can make to an API or service within a specified time period.

Also known asThrottlingRequest Limiting

Full Definition

## What is Rate Limiting?

Rate limiting is a technique used to control the rate of requests that clients can make to an API or service. It protects against abuse, ensures fair usage, maintains service stability, and manages costs.

### Why Rate Limit?

**Security**

- Prevent brute force attacks
- Block credential stuffing
- Mitigate DDoS
- Stop scraping

**Stability**

- Protect backend systems
- Ensure availability
- Manage load

**Business**

- Enforce usage tiers
- Control costs
- Fair resource sharing

### Rate Limiting Strategies

**Fixed Window**

- X requests per time window
- Simple to implement
- Burst at window boundaries

**Sliding Window**

- Smooth request distribution
- More complex
- Better protection

**Token Bucket**

- Allows controlled bursts
- Refills over time
- Flexible

**Leaky Bucket**

- Constant output rate
- Queues excess requests
- Smooths traffic

### Implementation Levels

**Application**
Per-endpoint limits.

**User/API Key**
Per-account limits.

**IP Address**
Per-source limits.

**Global**
Total service capacity.

### Response Handling

**HTTP 429**
Too Many Requests.

**Retry-After Header**
When to retry.

**X-RateLimit Headers**

- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset

### Best Practices

- Use multiple strategies
- Communicate limits clearly
- Provide rate limit headers
- Allow reasonable bursts
- Consider tiered limits

[Previous\\
\\
Ransomware](https://www.oximy.com/resources/glossary/ransomware) [Next\\
\\
Red Team](https://www.oximy.com/resources/glossary/red-team)