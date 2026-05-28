---
url: "https://www.oximy.com/resources/glossary/differential-privacy"
title: "What is Differential Privacy? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/differential-privacy#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Data & Privacy](https://www.oximy.com/resources/glossary?category=data)

# Differential Privacy

A mathematical framework for sharing information about a dataset while protecting the privacy of individuals in that dataset through controlled noise addition.

Also known asDPStatistical Privacy

Full Definition

## What is Differential Privacy?

Differential Privacy is a mathematical definition of privacy that provides provable guarantees about the privacy of individuals in a dataset. It works by adding carefully calibrated noise to query results or data, ensuring that individual records cannot be identified.

### Core Concept

**Definition**
A mechanism M satisfies ε-differential privacy if for any two databases D and D' differing by one record:

P\[M(D) ∈ S\] ≤ e^ε × P\[M(D') ∈ S\]

### Key Parameters

**Epsilon (ε)**

- Privacy loss parameter
- Lower = more privacy
- Trade-off with accuracy

**Delta (δ)**

- Probability of privacy breach
- Usually very small
- Relaxed definition

### Noise Mechanisms

**Laplace Mechanism**
For numerical queries.
Adds Laplace noise.

**Gaussian Mechanism**
For (ε,δ)-DP.
Adds Gaussian noise.

**Exponential Mechanism**
For categorical outputs.
Probabilistic selection.

### Applications

- Census data release
- Machine learning
- Location data
- Health analytics
- Search queries

### Benefits

- Provable guarantees
- Composition theorems
- Flexible implementation
- Regulatory compliance

### Challenges

- Accuracy trade-offs
- Parameter selection
- Complex to implement
- Computational cost

### Implementations

- Google DP library
- Apple (device analytics)
- US Census Bureau
- OpenDP

[Previous\\
\\
DevSecOps](https://www.oximy.com/resources/glossary/devsecops) [Next\\
\\
Digital Signature](https://www.oximy.com/resources/glossary/digital-signature)