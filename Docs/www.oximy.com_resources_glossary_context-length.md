---
url: "https://www.oximy.com/resources/glossary/context-length"
title: "What is Context Length? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/context-length#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Context Length

The maximum number of tokens a language model can process in a single request, determining how much text can be used as input and output combined.

Also known asContext WindowToken Limit

Full Definition

## What is Context Length?

Context length (also called context window) is the maximum number of tokens that a large language model can process in a single interaction. It includes both the input prompt and the generated output.

### Context Length by Model

| Model | Context Length |
| --- | --- |
| GPT-4 | 8K-128K tokens |
| Claude 3 | 200K tokens |
| Gemini 1.5 | 1M+ tokens |
| Llama 3 | 8K-128K tokens |

### Why It Matters

**Input Capacity**
How much context you can provide.

**Output Length**
Combined with input must fit.

**Use Cases**

- Long document analysis
- Code review
- Research synthesis
- Extended conversations

### Token Estimation

**English**

- ~4 characters per token
- ~0.75 words per token
- 1000 tokens ≈ 750 words

**Code**

- More variable
- Depends on language
- Typically more tokens

### Strategies for Long Content

**Chunking**
Break into smaller pieces.

**Summarization**
Compress information.

**RAG**
Retrieve relevant portions.

**Hierarchical**
Summary + details approach.

### Considerations

- Cost scales with tokens
- Attention limitations
- "Lost in the middle" phenomenon
- Quality vs. quantity trade-off

[Previous\\
\\
Confidential Computing](https://www.oximy.com/resources/glossary/confidential-computing) [Next\\
\\
Context Window](https://www.oximy.com/resources/glossary/context-window)