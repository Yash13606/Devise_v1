---
url: "https://www.oximy.com/resources/glossary/tokens"
title: "What is Tokens (LLM)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/tokens#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Tokens (LLM)

The basic units of text that language models process, typically representing words, subwords, or characters, used to measure input/output length and pricing.

Also known asLLM TokensText Units

Full Definition

## What are Tokens in LLMs?

Tokens are the fundamental units of text that large language models process. They can represent words, subwords, characters, or punctuation. Tokenization converts text into these units before processing and affects context limits and pricing.

### Token Characteristics

**Not Always Words**

- "unhappy" → \["un", "happy"\]
- "don't" → \["don", "'t"\]
- Common words often = 1 token

**Language Dependent**

- English: ~4 characters/token
- Other languages: May use more tokens

**Special Tokens**

- \[BOS\] - Beginning of sequence
- \[EOS\] - End of sequence
- \[PAD\] - Padding

### Tokenization Methods

**BPE (Byte-Pair Encoding)**

- GPT models
- Learns common pairs
- Efficient vocabulary

**WordPiece**

- BERT models
- Similar to BPE
- ## prefix for subwords


**SentencePiece**

- Language-agnostic
- Unigram model
- Works on raw text

### Token Estimation

**English Approximation**

- ~750 words ≈ 1,000 tokens
- ~4 characters ≈ 1 token

**Counting Tools**

- OpenAI tokenizer
- tiktoken library
- HuggingFace tokenizers

### Why Tokens Matter

**Context Limits**
Total tokens = input + output.

**Pricing**
APIs charge per token.

**Performance**
More tokens = more processing.

### Best Practices

- Count tokens before API calls
- Optimize prompts for efficiency
- Consider token limits in design
- Monitor token usage
- Use efficient formatting

[Previous\\
\\
Tokenization](https://www.oximy.com/resources/glossary/tokenization) [Next\\
\\
Trust Services Criteria](https://www.oximy.com/resources/glossary/trust-services-criteria)