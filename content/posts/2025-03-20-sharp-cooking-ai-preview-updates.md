---
layout: post
title: "Sharp Cooking - AI Preview updates"
date: 2025-03-20
categories:
  - javascript
  - SharpCooking
description: >-
    Discover how Sharp Cooking leverages AI with LLMs and LangGraph to power smarter recipe suggestions, ingredient updates, and interactive cooking assistance.
cover:
    image: "/images/posts/sharp-cooking-ai-preview-2.jpeg"
    alt: "Sharp Cooking AI Preview"
    caption: "Sharp Cooking AI Preview"
---

When I first designed Sharp Cooking, my goal was to provide smart features that other cooking apps lacked. Features like unit conversion (e.g., cups to grams) and recipe suggestions based on the ingredients you have at home were at the core of my vision. Over time, some of these features have been gradually implemented, but it’s been a challenging journey.

Before large language models (LLMs) became widely accessible, using AI for these features was a significant challenge. Training custom AI models required extensive time, effort, and infrastructure. Hosting them also wasn’t straightforward. But with the rise of LLMs, leveraging AI capabilities has become more accessible—and even better, LLMs are well-suited to the kinds of interactions I envisioned for Sharp Cooking.

In September 2024, I launched the first basic preview of AI Chat in Sharp Cooking. This feature allowed users to chat with OpenAI models using a simple prompt:

```prompt
You are a helpful chef's assistant. 

You answer any questions about cooking, baking, and food. Do not answer questions that are not related to cooking, baking, and food.

When you provide answers, keep them as short as possible and without explanation.

The following recipe is the current recipe:

{RecipeText}
```

With this setup, Sharp Cooking sent user queries and chat history to the OpenAI API via the endpoint `${openAIBaseApiUrl}/v1/chat/completions` and displayed the model’s responses in a simple chat UI. 

This basic version worked well and introduced new interactions I hadn’t been able to offer before. However, it had some limitations. Adding context for more complex interactions was difficult, and the chat was read-only — the AI couldn’t update recipes.

In recent months, I’ve been working on a new AI Chat preview that supports more complex interactions. This version includes RAG (Retrieval-Augmented Generation) capabilities and allows the agent to update recipe ingredients directly in the local recipe book. Now, users can ask questions like, “What recipe should I cook tonight?” or “What’s the hydration percentage of my current bread recipe?” The built-in tools provide enough context for the agent to give accurate, useful answers.

To implement these capabilities, I used [LangGraph](https://langchain-ai.github.io/langgraphjs/tutorials/quickstart/), which helps create a ReAct agent. This agent can reason about user requests and take action using predefined tools.

Here's what the agent currently looks like:

![LangGraph](/images/posts/ReActAgent.jpg)

Tools are essential for enriching the agent’s context. They’re fairly simple to define. For example, here’s the tool that retrieves a recipe by name:

```javascript
const lookupRecipeByName = tool(
    async ({ name }) => {
      const recipe = await getRecipeByName(name);

      return recipeAsText(recipe);
    },
    {
      name: "getRecipeByName",
      description: "Get a recipe by name",
      schema: z.object({
        name: z.string(),
      }),
    }
  )
```

Creating and configuring the agent with LangGraph is straightforward. Below is a simplified example of how I set it up:

```javascript
// First create the model itself including its api key
const llm = new ChatOpenAI({
    model: openAIModel,
    apiKey: openAIAuthorizationHeader,
    streaming: true,
  });

// Bind the tools to the model
const tools = [getAllRecipes, getCurrentRecipe, lookupRecipeByName, updateRecipeIngredientsByName];
toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
llmWithTools = llm.bindTools(tools);

// define the llm node
function llmCall(state: typeof MessagesAnnotation.State) {
  // Call the OpenAI model with the tools
}

// define the tools node
function toolNode(state: typeof MessagesAnnotation.State) {
  // Call tools when asked by the agent
}

// create actual ReAct agent
agentBuilder = new StateGraph(MessagesAnnotation)
    .addNode("llmCall", llmCall)
    .addNode("tools", toolNode)
    .addEdge("__start__", "llmCall")
    .addConditionalEdges(
      "llmCall",
      shouldContinue,
      {
        "Action": "tools",
        "__end__": "__end__",
      }
    )
    .addEdge("tools", "llmCall")
    .compile();
```

When the user makes a query, the agent processes it as an event stream:

```javascript
const eventStream = await agentBuilder.streamEvents(
      { messages: llmMessages },
      { version: "v2", signal: controller.signal });

for await (const { event, data } of eventStream) {
  // process each chunk of data
}
```

In this implementation, the entire agent runs on the frontend. Since it doesn’t rely on the Sharp Cooking API, hosting the model yourself could lead to CORS issues. Keep that in mind if you plan to deploy your own instance.

The new preview is live and ready for testing! As with any preview, it’s still a work in progress, so you might encounter some rough edges. Feel free to explore, experiment, and report any issues in the [GitHub repository](https://github.com/jlucaspains/sharp-cooking-web).

Cheers,\
Lucas