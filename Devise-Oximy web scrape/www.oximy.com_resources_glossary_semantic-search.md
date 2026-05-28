---
url: "https://www.oximy.com/resources/glossary/semantic-search"
title: "What is Semantic Search? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/semantic-search#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Semantic Search

Search that understands the meaning and context of queries rather than just matching keywords, using embeddings and vector similarity.

Also known asVector SearchSimilarity Search

Full Definition

## What is Semantic Search?

Semantic search is a search approach that aims to understand the intent and contextual meaning of search queries, rather than just matching keywords. It uses embeddings and vector similarity to find results that are conceptually related to the query.

### Keyword vs. Semantic Search

| Keyword Search | Semantic Search |
| --- | --- |
| Exact matching | Meaning matching |
| Fast, simple | More compute |
| Miss synonyms | Understands synonyms |
| No context | Context-aware |

### How It Works

1. **Convert to Embeddings**
Query and documents → vectors

2. **Compute Similarity**
Cosine similarity, dot product

3. **Retrieve Results**
Top-K most similar

4. **Rank and Return**
Present to user


### Similarity Metrics

**Cosine Similarity**

```
similarity = (A · B) / (||A|| × ||B||)
```

Range: -1 to 1

**Euclidean Distance**

```
distance = √(Σ(ai - bi)²)
```

Lower is more similar.

**Dot Product**

```
similarity = Σ(ai × bi)
```

With normalized vectors = cosine.

### Use Cases

- Enterprise search
- RAG systems
- Product search
- Document discovery
- FAQ matching
- Code search

### Implementation Components

**Embedding Model**
Convert text to vectors.

**Vector Database**
Store and search vectors.

**Indexing**
ANN (Approximate Nearest Neighbor).

### Best Practices

- Choose appropriate embedding model
- Optimize chunk size
- Consider hybrid search
- Implement relevance feedback
- Monitor search quality

[Previous\\
\\
Security Operations Center (SOC)](https://www.oximy.com/resources/glossary/soc) [Next\\
\\
Service Level Agreement (SLA)](https://www.oximy.com/resources/glossary/sla)