---
url: "https://www.oximy.com/resources/glossary/federated-learning"
title: "What is Federated Learning? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/federated-learning#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Federated Learning

A machine learning approach where models are trained across decentralized devices or servers holding local data, without exchanging raw data.

Also known asCollaborative LearningDistributed Learning

Full Definition

## What is Federated Learning?

Federated learning is a machine learning technique that trains algorithms across multiple decentralized edge devices or servers holding local data samples, without exchanging them. This approach addresses data privacy, security, and access rights concerns.

### How It Works

1. **Central Model Distribution**


   - Server sends model to clients
   - Same initial weights

2. **Local Training**


   - Each client trains on local data
   - Data never leaves device

3. **Update Aggregation**


   - Clients send model updates
   - Server aggregates updates

4. **Model Update**


   - Combined model distributed
   - Process repeats

### Types of Federated Learning

**Horizontal (Sample-Based)**

- Same features, different samples
- Mobile devices with similar data types

**Vertical (Feature-Based)**

- Same samples, different features
- Organizations with different data about same entities

**Federated Transfer**

- Different samples and features
- Transfer learning across domains

### Privacy Techniques

**Differential Privacy**
Add noise to updates.

**Secure Aggregation**
Encrypt individual updates.

**Homomorphic Encryption**
Compute on encrypted data.

### Use Cases

- Mobile keyboard prediction
- Healthcare research
- Financial fraud detection
- Smart home devices
- Autonomous vehicles

### Challenges

- Communication efficiency
- Non-IID data distribution
- Client selection and availability
- Aggregation attacks
- Model convergence

[Previous\\
\\
Extended Detection and Response (XDR)](https://www.oximy.com/resources/glossary/xdr) [Next\\
\\
FedRAMP](https://www.oximy.com/resources/glossary/fedramp)