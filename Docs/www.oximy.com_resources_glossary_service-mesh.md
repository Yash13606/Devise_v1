---
url: "https://www.oximy.com/resources/glossary/service-mesh"
title: "What is Service Mesh? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/service-mesh#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Cloud & Infrastructure](https://www.oximy.com/resources/glossary?category=cloud)

# Service Mesh

A dedicated infrastructure layer that handles service-to-service communication in microservices architectures, providing features like encryption, observability, and traffic management.

Also known asSidecar MeshMicroservices Mesh

Full Definition

## What is a Service Mesh?

A service mesh is a dedicated infrastructure layer that handles service-to-service communication in microservices architectures. It provides features like mutual TLS, load balancing, traffic management, and observability without requiring changes to application code.

### Core Components

**Data Plane**

- Sidecar proxies
- Handle all traffic
- Policy enforcement

**Control Plane**

- Configuration management
- Service discovery
- Certificate management

### Key Features

**Security**

- Mutual TLS (mTLS)
- Certificate management
- Access policies

**Traffic Management**

- Load balancing
- Canary deployments
- Circuit breaking

**Observability**

- Distributed tracing
- Metrics collection
- Access logging

**Resilience**

- Retries
- Timeouts
- Rate limiting

### Popular Service Meshes

**Istio**

- Most full-featured
- Envoy-based
- Complex

**Linkerd**

- Lightweight
- Simple setup
- CNCF graduated

**Consul Connect**

- HashiCorp
- Service discovery
- Multi-platform

### Architecture

```
┌─────────────────────────────────────┐
│          Control Plane              │
└─────────────────────────────────────┘
           ↓            ↓
┌──────────────┐  ┌──────────────┐
│  Service A   │  │  Service B   │
│ ┌──────────┐ │  │ ┌──────────┐ │
│ │  Sidecar │←┼──┼→│  Sidecar │ │
│ └──────────┘ │  │ └──────────┘ │
└──────────────┘  └──────────────┘
```

### Benefits

- Zero-trust networking
- Consistent observability
- Traffic control
- Language-agnostic

### Considerations

- Added complexity
- Resource overhead
- Learning curve
- Debugging challenges

[Previous\\
\\
Service Level Agreement (SLA)](https://www.oximy.com/resources/glossary/sla) [Next\\
\\
SIEM](https://www.oximy.com/resources/glossary/siem)