---
url: "https://www.oximy.com/resources/glossary/model-monitoring"
title: "What is Model Monitoring? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/model-monitoring#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Model Monitoring

The continuous observation and tracking of machine learning models in production to detect performance degradation, data drift, and anomalies.

Also known asML MonitoringAI Observability

Full Definition

## What is Model Monitoring?

Model monitoring is the practice of continuously tracking the performance, behavior, and reliability of machine learning models deployed in production. It helps detect issues like performance degradation, data drift, and anomalies before they impact business outcomes.

### What to Monitor

**Performance Metrics**

- Accuracy, precision, recall
- F1 score
- Business KPIs
- Error rates

**Data Quality**

- Input data distribution
- Missing values
- Schema violations
- Outliers

**Drift Detection**

- Data drift (input changes)
- Concept drift (relationship changes)
- Prediction drift

**Operational Metrics**

- Latency
- Throughput
- Resource utilization
- Error rates

### Drift Types

**Data Drift**
Input distribution changes.
Example: Customer demographics shift.

**Concept Drift**
Underlying relationships change.
Example: User behavior evolution.

**Prediction Drift**
Output distribution changes.
Symptom of other drift types.

### Monitoring Approaches

**Statistical Methods**

- KL divergence
- Chi-squared tests
- Population Stability Index (PSI)

**Window-Based**

- Compare recent vs. reference
- Sliding windows
- Periodic sampling

**Real-Time**

- Stream processing
- Continuous evaluation
- Alert thresholds

### Tools and Platforms

- Evidently AI
- Fiddler
- Arize
- Weights & Biases
- MLflow

### Best Practices

- Define baseline metrics
- Set appropriate thresholds
- Automate alerts
- Regular retraining triggers
- Document incidents

[Previous\\
\\
Model Context Protocol (MCP)](https://www.oximy.com/resources/glossary/mcp) [Next\\
\\
Model Risk Management](https://www.oximy.com/resources/glossary/model-risk-management)