---
url: "https://www.oximy.com/resources/glossary/quantization"
title: "What is Quantization? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/quantization#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Quantization

A model optimization technique that reduces the precision of model weights and activations to decrease memory usage and improve inference speed.

Also known asModel QuantizationWeight Quantization

Full Definition

## What is Quantization?

Quantization is a technique that reduces the numerical precision of a model's weights and activations. By using lower-precision numbers (e.g., INT8 instead of FP32), quantization decreases model size and speeds up inference while maintaining acceptable accuracy.

### Precision Levels

| Type | Bits | Memory | Use Case |
| --- | --- | --- | --- |
| FP32 | 32 | 4 bytes | Training |
| FP16 | 16 | 2 bytes | Mixed precision |
| BF16 | 16 | 2 bytes | Training/inference |
| INT8 | 8 | 1 byte | Inference |
| INT4 | 4 | 0.5 bytes | LLM inference |

### Quantization Types

**Post-Training Quantization (PTQ)**

- Applied after training
- No retraining needed
- Some accuracy loss

**Quantization-Aware Training (QAT)**

- Simulates quantization during training
- Better accuracy preservation
- More compute required

**Dynamic Quantization**

- Quantize at runtime
- Weights static, activations dynamic
- Easy to apply

### Quantization Methods

**GPTQ**

- Layer-by-layer quantization
- Popular for LLMs
- Good quality

**AWQ (Activation-Aware)**

- Preserves important weights
- Better than uniform quantization

**GGML/GGUF**

- Format for CPU inference
- Various quantization levels
- llama.cpp ecosystem

### Benefits

- 2-4x memory reduction
- 2-4x faster inference
- Enables edge deployment
- Reduces costs

### Trade-offs

- Potential accuracy loss
- Task-dependent impact
- Calibration required
- Not all operations supported

### Best Practices

- Start with higher precision
- Evaluate on your tasks
- Use calibration data
- Test edge cases

[Previous\\
\\
Protected Health Information (PHI)](https://www.oximy.com/resources/glossary/phi) [Next\\
\\
Ransomware](https://www.oximy.com/resources/glossary/ransomware)