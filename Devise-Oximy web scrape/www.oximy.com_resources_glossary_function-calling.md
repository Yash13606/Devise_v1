---
url: "https://www.oximy.com/resources/glossary/function-calling"
title: "What is Function Calling? | Oximy"
---

[Skip to main content](https://www.oximy.com/resources/glossary/function-calling#main-content)

[![Oximy](https://www.oximy.com/images/oximy-white.svg)](https://www.oximy.com/)

Get a Demo

[AI & Machine Learning](https://www.oximy.com/resources/glossary?category=ai)

# Function Calling

A capability that allows language models to generate structured outputs that invoke external functions or APIs based on user requests.

Also known asTool UseTool Calling

Full Definition

## What is Function Calling?

Function calling (also called tool use) is a capability that allows language models to generate structured outputs that trigger external functions or APIs. Instead of generating text, the model outputs structured parameters for predefined functions.

### How It Works

1. **Define Functions**


   - Name and description
   - Parameter schema
   - Expected behavior

2. **User Query**


   - Natural language request
   - Context about task

3. **Model Decision**


   - Determine if function needed
   - Select appropriate function
   - Generate parameters

4. **Execution**


   - Call external function
   - Return results to model

5. **Response**


   - Model uses results
   - Generates final answer

### Function Definition Example

```
{
  "name": "get_weather",
  "description": "Get weather for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"]
      }
    },
    "required": ["location"]
  }
}
```

### Use Cases

- API integrations
- Database queries
- Calculations
- Data retrieval
- System actions

### Best Practices

- Clear function descriptions
- Validate parameters
- Handle errors gracefully
- Limit available functions
- Secure function execution

[Previous\\
\\
Firewall](https://www.oximy.com/resources/glossary/firewall) [Next\\
\\
GDPR](https://www.oximy.com/resources/glossary/gdpr)