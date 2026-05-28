---
url: "https://www.oximy.com/resources/glossary/rag"
title: "What is Retrieval-Augmented Generation (RAG)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/rag#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Retrieval-Augmented Generation (RAG)

An AI architecture that enhances language model outputs by retrieving relevant information from external knowledge sources before generating responses.

Also known asRAGRetrieval Augmented Generation

Full Definition

## What is Retrieval-Augmented Generation?

Retrieval-Augmented Generation (RAG) is an AI framework that combines the generative capabilities of large language models with external knowledge retrieval. Instead of relying solely on trained parameters, RAG systems fetch relevant information from a knowledge base to inform and ground their responses.

### How RAG Works

1. **Query Processing**: User query is received
2. **Retrieval**: Relevant documents are fetched from knowledge base
3. **Augmentation**: Retrieved context is added to the prompt
4. **Generation**: LLM generates response using both query and context
5. **Response**: Grounded answer returned to user

### RAG Architecture

```
┌─────────┐     ┌─────────────┐     ┌─────────┐
│  Query  │────►│  Retriever  │────►│   LLM   │
└─────────┘     └──────┬──────┘     └────┬────┘
                       │                  │
                ┌──────▼──────┐          │
                │  Knowledge  │          │
                │    Base     │          │
                └─────────────┘          ▼
                                   ┌──────────┐
                                   │ Response │
                                   └──────────┘
```

### Benefits

- Reduces hallucinations
- Enables current information access
- Provides source attribution
- No retraining needed for new data
- Cost-effective compared to fine-tuning

### RAG Components

**Retriever**

- Dense retrieval (embeddings)
- Sparse retrieval (BM25)
- Hybrid approaches

**Knowledge Base**

- Vector databases
- Document stores
- APIs and databases

**Reranker (optional)**

- Improve retrieval relevance
- Cross-encoder models

### Best Practices

- Chunk documents appropriately
- Use quality embeddings
- Implement relevance filtering
- Consider hybrid retrieval
- Monitor retrieval quality

[Previous\\
\\
Retrieval](https://www.oximy.com/resources/glossary/retrieval) [Next\\
\\
Role-Based Access Control (RBAC)](https://www.oximy.com/resources/glossary/rbac)