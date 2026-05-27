---
url: "https://www.oximy.com/resources/glossary/fine-tuning"
title: "What is Fine-Tuning? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/fine-tuning#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Fine-Tuning

The process of taking a pre-trained AI model and further training it on a specific dataset to adapt it for a particular task or domain.

Also known asModel Fine-TuningTransfer Learning

Full Definition

## What is Fine-Tuning?

Fine-tuning is a transfer learning technique where a pre-trained model is further trained on a smaller, task-specific dataset. Instead of training from scratch, fine-tuning adapts the model's existing knowledge to perform well on a specific use case, requiring less data and compute than training from scratch.

### How Fine-Tuning Works

1. Start with a pre-trained base model
2. Prepare task-specific training data
3. Continue training on the new data
4. Adjust hyperparameters as needed
5. Evaluate on held-out test set
6. Deploy the specialized model

### Fine-Tuning Approaches

**Full Fine-Tuning**

- Update all model parameters
- Most flexible
- Requires more compute

**Parameter-Efficient (PEFT)**

- Update only some parameters
- LoRA, adapters, prefix tuning
- Less compute, smaller storage

**Instruction Tuning**

- Train on instruction-response pairs
- Improves task following
- Used for chat models

### When to Fine-Tune

- Specialized domain knowledge needed
- Consistent output format required
- Performance on specific tasks is critical
- Prompt engineering is insufficient

### Considerations

- Data quality is crucial
- Risk of catastrophic forgetting
- Ongoing maintenance required
- Cost-benefit analysis

[Previous\\
\\
Few-Shot Learning](https://www.oximy.com/resources/glossary/few-shot-learning) [Next\\
\\
Firewall](https://www.oximy.com/resources/glossary/firewall)