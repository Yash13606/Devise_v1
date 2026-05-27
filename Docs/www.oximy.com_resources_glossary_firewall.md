---
url: "https://www.oximy.com/resources/glossary/firewall"
title: "What is Firewall? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/firewall#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Security](https://www.oximy.com/resources/glossary?category=security)

# Firewall

A network security device or software that monitors and controls incoming and outgoing traffic based on predetermined security rules.

Also known asNetwork FirewallSecurity Gateway

Full Definition

## What is a Firewall?

A firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules. It establishes a barrier between a trusted network and untrusted networks, such as the Internet.

### Types of Firewalls

**Packet Filtering**

- Examines packets individually
- Based on IP, port, protocol
- Stateless, simple rules

**Stateful Inspection**

- Tracks connection state
- Context-aware decisions
- More intelligent filtering

**Application Layer (WAF)**

- HTTP/HTTPS inspection
- Application-specific rules
- Protects web applications

**Next-Generation (NGFW)**

- Deep packet inspection
- IPS integration
- Application awareness
- User identity tracking

### Deployment Models

**Network Firewalls**

- Hardware appliances
- Perimeter protection
- Internal segmentation

**Host-Based Firewalls**

- Software on endpoints
- OS-level protection
- Personal firewalls

**Cloud Firewalls**

- Cloud-native (AWS SGs, Azure NSGs)
- Firewall-as-a-Service
- Virtual appliances

### Common Rules

| Direction | Source | Destination | Port | Action |
| --- | --- | --- | --- | --- |
| Inbound | Any | Web Server | 443 | Allow |
| Inbound | Any | Any | \* | Deny |
| Outbound | Internal | Any | 443 | Allow |

### Best Practices

- Default deny policy
- Principle of least privilege
- Regular rule review
- Logging and monitoring
- Change management

[Previous\\
\\
Fine-Tuning](https://www.oximy.com/resources/glossary/fine-tuning) [Next\\
\\
Function Calling](https://www.oximy.com/resources/glossary/function-calling)