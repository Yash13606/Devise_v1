---
url: "https://www.oximy.com/resources/glossary/mcp"
title: "What is Model Context Protocol (MCP)? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/mcp#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[Emerging Tech](https://www.oximy.com/resources/glossary?category=emerging)

# Model Context Protocol (MCP)

An open protocol that standardizes how AI applications connect to external data sources and tools, enabling secure, structured interactions between LLMs and external systems.

Also known asMCPContext Protocol

Full Definition

## What is Model Context Protocol?

Model Context Protocol (MCP) is an open standard developed by Anthropic that provides a universal way for AI applications to connect with external data sources and tools. It creates a standardized interface for LLMs to safely interact with databases, APIs, file systems, and other resources.

### Core Concepts

**Resources**
Expose data and content to LLMs:

- Files and documents
- Database records
- API responses
- Live data feeds

**Tools**
Enable LLMs to take actions:

- Execute code
- Query databases
- Call external APIs
- Perform calculations

**Prompts**
Reusable prompt templates:

- Standardized interactions
- Consistent formatting
- Pre-defined workflows

### Architecture

```
┌─────────────┐     MCP      ┌─────────────┐
│   LLM App   │◄────────────►│ MCP Server  │
└─────────────┘   Protocol   └─────────────┘
                                    │
                              ┌─────┴─────┐
                              │           │
                           Database    API
```

### Benefits

- Standardized integration pattern
- Security through structured access
- Portable across LLM providers
- Composable server ecosystem
- Clear permission boundaries

### Use Cases

- Enterprise data access for AI
- Secure tool use in agents
- Multi-system orchestration
- Controlled AI capabilities

[Previous\\
\\
Model Cards](https://www.oximy.com/resources/glossary/model-cards) [Next\\
\\
Model Monitoring](https://www.oximy.com/resources/glossary/model-monitoring)