---
url: "https://www.oximy.com/resources/glossary/temperature"
title: "What is Temperature (LLM)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/temperature#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Temperature (LLM)

A parameter that controls the randomness of language model outputs, with higher values producing more creative responses and lower values producing more deterministic ones.

Also known asSampling TemperatureGeneration Temperature

Full Definition

## What is Temperature in LLMs?

Temperature is a hyperparameter that controls the randomness of language model outputs. It affects the probability distribution of token selection during text generation, influencing how creative or deterministic the responses are.

### How Temperature Works

**Low Temperature (0.0-0.3)**

- More deterministic
- Focused, consistent
- Less creative
- Good for factual tasks

**Medium Temperature (0.4-0.7)**

- Balanced
- Some creativity
- Generally coherent
- Good default

**High Temperature (0.8-1.0+)**

- More random
- Creative, diverse
- May be less coherent
- Good for brainstorming

### Technical Explanation

Temperature scales the logits before softmax:

```
P(token) = softmax(logits / temperature)
```

- Temperature = 1.0: Standard distribution
- Temperature < 1.0: Sharper distribution
- Temperature > 1.0: Flatter distribution

### Use Case Guidelines

| Task | Recommended Temperature |
| --- | --- |
| Code generation | 0.0-0.2 |
| Factual Q&A | 0.0-0.3 |
| Translation | 0.3-0.5 |
| General chat | 0.5-0.7 |
| Creative writing | 0.7-1.0 |
| Brainstorming | 0.8-1.2 |

### Related Parameters

**Top-P (Nucleus Sampling)**
Cumulative probability threshold.

**Top-K**
Limit to top K tokens.

**Frequency Penalty**
Reduce repetition.

### Best Practices

- Start with defaults
- Adjust based on task
- Test different values
- Consider combination with top-p
- Document chosen settings

[Previous\\
\\
Synthetic Data](https://www.oximy.com/resources/glossary/synthetic-data) [Next\\
\\
Threat Intelligence](https://www.oximy.com/resources/glossary/threat-intelligence)