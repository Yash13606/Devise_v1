---
url: "https://www.oximy.com/resources/glossary/few-shot-learning"
title: "What is Few-Shot Learning? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/few-shot-learning#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Few-Shot Learning

A machine learning approach where models learn to perform tasks from only a small number of examples, often by leveraging prior knowledge from pre-training.

Also known asK-Shot LearningLow-Shot Learning

Full Definition

## What is Few-Shot Learning?

Few-shot learning is a machine learning approach where models can learn new tasks or concepts from only a small number of examples (typically 1-10). It contrasts with traditional ML that requires large datasets and leverages knowledge from pre-training.

### Learning Paradigms

**Zero-Shot Learning**
No examples provided.
Uses task description only.

**One-Shot Learning**
Single example provided.
Common in image recognition.

**Few-Shot Learning**
2-10 examples provided.
Balance of guidance and efficiency.

### In Large Language Models

**Few-Shot Prompting**

```
Translate English to French:
cat → chat
dog → chien
house → ?
```

### Techniques

**Meta-Learning**

- Learn to learn
- MAML, Prototypical Networks
- Task-agnostic representations

**Transfer Learning**

- Pre-trained models
- Fine-tuning on few examples
- Domain adaptation

**In-Context Learning**

- Examples in prompt
- No weight updates
- LLM capability

### Applications

- Personalization
- Rare class classification
- Drug discovery
- Robotics
- Language tasks

### Challenges

- Example selection importance
- Task ambiguity
- Overfitting to few examples
- Evaluation difficulty

### Best Practices

- Choose representative examples
- Use diverse examples
- Order matters in prompts
- Test with different examples
- Combine with clear instructions

[Previous\\
\\
FedRAMP](https://www.oximy.com/resources/glossary/fedramp) [Next\\
\\
Fine-Tuning](https://www.oximy.com/resources/glossary/fine-tuning)