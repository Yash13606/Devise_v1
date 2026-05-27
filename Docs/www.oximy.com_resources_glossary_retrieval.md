---
url: "https://www.oximy.com/resources/glossary/retrieval"
title: "What is Retrieval? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/retrieval#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Retrieval

The process of finding and fetching relevant information from a knowledge base or document store to provide context for AI model responses.

Also known asInformation RetrievalDocument Retrieval

Full Definition

## What is Retrieval in AI?

Retrieval is the process of finding and fetching relevant documents or information from a knowledge base to augment AI model responses. It's a core component of RAG (Retrieval-Augmented Generation) systems.

### Retrieval Methods

**Sparse Retrieval**

- Keyword-based (BM25, TF-IDF)
- Fast and interpretable
- Exact match focused

**Dense Retrieval**

- Embedding-based
- Semantic similarity
- Vector databases

**Hybrid Retrieval**

- Combines sparse and dense
- Best of both approaches
- Improved recall

### Retrieval Pipeline

```
Query → Query Processing → Retrieval → Ranking → Results
                ↓
         Vector DB / Search Index
```

### Key Metrics

**Recall@K**
Percentage of relevant docs in top K.

**Precision@K**
Relevance of retrieved docs.

**MRR (Mean Reciprocal Rank)**
Position of first relevant result.

**NDCG**
Normalized Discounted Cumulative Gain.

### Chunking Strategies

**Fixed Size**

- Simple implementation
- May split context

**Semantic**

- Preserve meaning
- Variable sizes

**Hierarchical**

- Parent-child chunks
- Summary + details

### Ranking and Reranking

**Initial Retrieval**
Fast, approximate ranking.

**Reranking**

- Cross-encoder models
- Better relevance scoring
- More compute intensive

### Best Practices

- Optimize chunk size for use case
- Use hybrid retrieval
- Implement reranking
- Monitor retrieval quality
- Regular index updates

[Previous\\
\\
Responsible AI](https://www.oximy.com/resources/glossary/responsible-ai) [Next\\
\\
Retrieval-Augmented Generation (RAG)](https://www.oximy.com/resources/glossary/rag)