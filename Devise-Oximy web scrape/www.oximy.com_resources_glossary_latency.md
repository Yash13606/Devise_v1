---
url: "https://www.oximy.com/resources/glossary/latency"
title: "What is Latency? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/latency#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Latency

The time delay between a request and its corresponding response, critical for measuring the performance of AI systems and APIs.

Also known asResponse TimeDelay

Full Definition

## What is Latency?

Latency is the time delay between when a request is initiated and when a response begins or completes. In AI and computing contexts, it measures the speed of system responses and is critical for user experience and system performance.

### Latency Metrics

**Time to First Byte (TTFB)**
Time until first response byte.

**Time to First Token (TTFT)**
Time until first AI token generated.

**Total Latency**
Complete request-response time.

**P50/P95/P99 Latency**
Percentile-based measurements.

### Latency in AI Systems

**LLM API Latency**

- Model inference time
- Network round trip
- Token generation

**RAG System Latency**

- Retrieval time
- Embedding generation
- LLM inference

### Contributing Factors

**Network**

- Distance to server
- Bandwidth
- Congestion

**Processing**

- Model size
- Compute resources
- Batch size

**Infrastructure**

- Server location
- Load balancing
- Caching

### Optimization Strategies

**Model-Level**

- Smaller models
- Quantization
- Speculative decoding

**Infrastructure**

- Edge deployment
- CDN usage
- GPU acceleration

**Architecture**

- Caching
- Streaming responses
- Async processing

### Acceptable Latency Targets

| Use Case | Target |
| --- | --- |
| Interactive chat | < 500ms TTFT |
| Real-time | < 100ms |
| Batch processing | Less critical |
| Streaming | < 200ms TTFT |

[Previous\\
\\
Large Language Model (LLM)](https://www.oximy.com/resources/glossary/llm) [Next\\
\\
Least Privilege](https://www.oximy.com/resources/glossary/least-privilege)