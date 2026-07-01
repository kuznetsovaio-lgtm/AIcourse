# Portfolio + Digital Twin Tutorial

This tutorial explains, in beginner-friendly language, what was built in this project, how the pieces fit together, and how the "Digital Twin" chat works.

The goal of this project was to build:

- a professional Next.js portfolio website
- a polished frontend with custom styling
- an AI chat assistant that can answer questions about Ilona Kuznetsova's career
- a safe backend route that talks to OpenRouter without exposing the API key to the browser

---

## 1. What We Built

We built a personal portfolio site for Ilona Kuznetsova that includes:

- a hero section with strong branding
- an about section
- a career journey timeline
- project highlights
- a skills section
- future portfolio links
- a contact section
- a "Digital Twin" chat section powered by OpenRouter

The chat acts like an AI version of the portfolio. A visitor can ask questions like:

- "What kind of machine learning problems do you enjoy most?"
- "Tell me about your cryobiology project."
- "What are you looking for in your next role?"

The AI answers using the information from the CV and portfolio content.

---

## 2. Technology Summary

Here is the main technology stack used in this project.

### Next.js

Next.js is a React framework. It helps us build modern web apps with:

- pages
- layouts
- server routes
- good performance defaults

In this project, Next.js handles both:

- the frontend website
- the backend API route for the AI chat

### React

React is the library used to build user interfaces from components.

In this project:

- the homepage is a React component
- the Digital Twin chat box is a React component
- React state is used to track messages, loading, errors, and chat status

### TypeScript

TypeScript is JavaScript with type checking.

It helps catch mistakes early. For example:

- a message must have a `role`
- a message must have `content`
- the OpenRouter response must match an expected shape

### CSS Modules

CSS Modules let us write styles in separate `.module.css` files and attach them to components safely.

This means:

- styles do not leak everywhere
- class names are easier to manage
- the code stays organized

### OpenRouter

OpenRouter is the AI gateway used for the chat.

Instead of calling a model provider directly from the browser, the app sends requests from a server-side API route to OpenRouter.

That keeps the API key private.

### Lucide React

This package provides icons such as:

- mail
- phone
- sparkles
- bot
- arrows

These icons help the site feel more polished and modern.

---

## 3. Project Structure

Here are the most important files:

```text
src/
  app/
    api/
      digital-twin/
        route.ts
    layout.tsx
    page.tsx
    page.module.css
    globals.css
  components/
    DigitalTwinChat.tsx
    DigitalTwinChat.module.css
  lib/
    careerProfile.ts
    openrouter.ts

README.md
.env.local.example
tutorial.md
```

What each part does:

- `src/app/page.tsx`: builds the homepage layout
- `src/app/page.module.css`: styles the homepage
- `src/components/DigitalTwinChat.tsx`: builds the chat interface
- `src/components/DigitalTwinChat.module.css`: styles the chat box
- `src/app/api/digital-twin/route.ts`: backend route that talks to OpenRouter
- `src/lib/careerProfile.ts`: stores portfolio content and AI context
- `src/lib/openrouter.ts`: reads environment variables and picks the model
- `src/app/layout.tsx`: page metadata and app shell

---

## 4. High-Level Walkthrough

Let’s follow the app from top to bottom.

### Step 1: The browser opens the website

When you visit `http://localhost:3000`, Next.js renders the homepage using:

- `src/app/layout.tsx`
- `src/app/page.tsx`

### Step 2: The page displays static portfolio content

The homepage imports data from `careerProfile.ts`, such as:

- `expertise`
- `journey`
- `metrics`
- `projectCards`
- `skillGroups`

This is a smart pattern because content is separated from layout.

### Step 3: The Digital Twin component loads

The homepage includes:

```tsx
<DigitalTwinChat />
```

This component is interactive, so it is a client component.

### Step 4: The chat checks whether AI is configured

When the chat loads, it sends a `GET` request to:

```text
/api/digital-twin
```

That route replies with:

- whether an OpenRouter key exists
- which model is being used

### Step 5: The user asks a question

When the user submits a question:

- React stores the user message
- the component sends a `POST` request to `/api/digital-twin`
- the server route calls OpenRouter
- OpenRouter returns an answer
- React adds the answer to the chat

### Step 6: The answer appears on the page

The conversation list updates automatically because React state changed.

---

## 5. Detailed Code Review

This section reviews the major files in more detail.

## 5.1 `src/app/layout.tsx`

This file wraps the whole application.

```tsx
export const metadata: Metadata = {
  title: "Ilona Kuznetsova | Data Scientist",
  description:
    "Professional portfolio for Ilona Kuznetsova, a data scientist specializing in machine learning, computer vision, NLP, and applied mathematics.",
};
```

Why this matters:

- `title` changes the browser tab title
- `description` helps with SEO
- the layout ensures every page shares the same base structure

The render part is simple:

```tsx
<html lang="en">
  <body>{children}</body>
</html>
```

`children` means: "put the current page here."

---

## 5.2 `src/lib/careerProfile.ts`

This file stores reusable content and data structures.

For example:

```ts
export const expertise = [
  "Machine Learning",
  "Computer Vision",
  "NLP",
  "PyTorch",
];
```

And:

```ts
export const starterQuestions = [
  "What kind of machine learning problems do you enjoy most?",
  "Can you tell me about your cryobiology project?",
];
```

Why this is a good design:

- content is centralized
- the page component stays cleaner
- the AI prompt can reuse the same information

The most important part for the AI is `digitalTwinProfile`.

That string is essentially the AI's knowledge base for this project. It includes:

- name
- title
- education
- languages
- skills
- achievements
- projects
- speaking style

That means the AI is not answering from nowhere. It is answering from a structured summary of the portfolio.

---

## 5.3 `src/lib/openrouter.ts`

This file handles OpenRouter configuration.

```ts
export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-5-mini";
```

This means:

- if no model is configured in environment variables
- the app will use `openai/gpt-5-mini`

The model is resolved like this:

```ts
export function resolveOpenRouterModel() {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    process.env.OPENROUTER_CHAT_MODEL?.trim() ||
    DEFAULT_OPENROUTER_MODEL
  );
}
```

This is a fallback chain:

1. try `OPENROUTER_MODEL`
2. if missing, try `OPENROUTER_CHAT_MODEL`
3. if still missing, use the default

This is useful because it makes the app flexible without changing code.

---

## 5.4 `src/app/page.tsx`

This is the main homepage.

It imports:

- icons
- the Digital Twin component
- portfolio data
- CSS styles

Example:

```tsx
import { DigitalTwinChat } from "@/components/DigitalTwinChat";
import {
  expertise,
  journey,
  metrics,
  portfolioLinks,
  projectCards,
  skillGroups,
} from "@/lib/careerProfile";
```

### What this page does

It renders sections like:

- top navigation
- hero
- metrics
- about
- career journey
- projects
- skills
- digital twin
- portfolio links
- contact

### Example: rendering repeated content with `map`

React often uses `map()` to generate UI from arrays.

```tsx
{metrics.map((metric) => (
  <article key={metric.label} className={styles.metricCard}>
    <strong>{metric.value}</strong>
    <span>{metric.label}</span>
  </article>
))}
```

How to read this:

- `metrics` is an array
- `map()` loops through it
- each item becomes an `<article>`
- `key` helps React track each item efficiently

This is much better than copying and pasting HTML three times.

### Example: including the AI section

```tsx
<section id="digital-twin" className={styles.sectionBlock}>
  <div className={styles.sectionHeading}>
    <p>AI Layer</p>
    <h2>A portfolio that can answer back.</h2>
  </div>

  <DigitalTwinChat />
</section>
```

This shows good component composition:

- the page controls the layout
- the child component handles the chat behavior

---

## 5.5 `src/app/page.module.css`

This file creates the visual identity of the site.

It controls:

- layout
- spacing
- colors
- cards
- typography
- responsive behavior
- animation

### Example: page background

```css
.backgroundMesh {
  position: fixed;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(circle at 18% 20%, rgba(90, 202, 255, 0.22), transparent 30%),
    radial-gradient(circle at 82% 18%, rgba(193, 255, 114, 0.18), transparent 24%),
    linear-gradient(135deg, #071119 0%, #0a1320 45%, #06080d 100%);
}
```

This creates layered glowing gradients behind the page.

### Example: responsive layout

```css
@media (max-width: 1080px) {
  .hero,
  .aboutGrid,
  .projectGrid,
  .skillsGrid,
  .linkGrid,
  .metrics {
    grid-template-columns: 1fr;
  }
}
```

This means:

- on smaller screens
- multi-column sections collapse into one column

That is one of the key ideas in responsive design.

### Example: animation

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

This gives sections a smooth entrance animation.

---

## 5.6 `src/components/DigitalTwinChat.tsx`

This is the most interactive part of the app.

At the top, it says:

```tsx
"use client";
```

This is important.

It tells Next.js:

- this component runs in the browser
- this component can use state, effects, and event handlers

### State

The component tracks several pieces of data:

```tsx
const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
const [input, setInput] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [status, setStatus] = useState<ChatStatus | null>(null);
```

What each state value means:

- `messages`: the conversation history
- `input`: the text typed by the user
- `error`: any API or network error
- `isLoading`: whether a request is in progress
- `status`: whether OpenRouter is configured and what model is active

### Checking configuration on load

This happens inside `useEffect()`:

```tsx
useEffect(() => {
  async function loadStatus() {
    const response = await fetch("/api/digital-twin", {
      method: "GET",
      cache: "no-store",
    });
  }
}, []);
```

The empty dependency array `[]` means:

- run this once after the component loads

The purpose is to determine whether the chat should be active.

### Sending a question

The main action happens in `submitQuestion()`:

```tsx
const response = await fetch("/api/digital-twin", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: nextMessages.slice(1),
  }),
});
```

Important idea:

- the browser does not call OpenRouter directly
- the browser calls the local Next.js API route

This is safer, because the OpenRouter API key stays on the server.

### Rendering messages

```tsx
messages.map((message, index) => (
  <article
    key={`${message.role}-${index}`}
    className={
      message.role === "user" ? styles.messageUser : styles.message
    }
  >
    <span className={styles.messageMeta}>
      {message.role === "user" ? "You" : "Ilona AI"}
    </span>
    <p className={styles.messageBody}>{message.content}</p>
  </article>
))
```

This pattern says:

- loop through messages
- choose a different style for user vs assistant
- show a label and the text

That is how the chat visually separates both sides of the conversation.

---

## 5.7 `src/components/DigitalTwinChat.module.css`

This file styles the chat panel.

Key things it handles:

- the card container
- the status badge
- starter question buttons
- conversation bubbles
- textarea
- submit button
- error box

Example:

```css
.submitButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 22px;
  border-radius: 999px;
}
```

This builds a rounded modern button.

Example:

```css
.messageUser {
  justify-self: end;
  max-width: min(560px, 100%);
}
```

This makes user messages align toward the right side, like common chat apps.

---

## 5.8 `src/app/api/digital-twin/route.ts`

This is the server-side backend for the AI chat.

It has two endpoints:

- `GET`: tells the frontend whether the chat is configured
- `POST`: sends conversation messages to OpenRouter

### The system prompt

This is one of the most important pieces:

```ts
const systemPrompt = `
You are the Digital Twin for Ilona Kuznetsova's portfolio website.
...
Career profile:
${digitalTwinProfile}
`.trim();
```

A system prompt tells the model how to behave.

In this case, it tells the model:

- answer as Ilona
- answer career-related questions
- stay grounded in the provided data
- do not invent missing facts

### Message validation

Before sending data to OpenRouter, the route cleans the incoming messages:

```ts
function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }
  ...
}
```

Why this matters:

- users or buggy code can send bad data
- the API route should protect itself
- only valid messages should be forwarded

### The OpenRouter request

```ts
const openRouterResponse = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getOpenRouterSiteUrl(),
      "X-OpenRouter-Title": getOpenRouterSiteName(),
    },
    body: JSON.stringify({
      model,
      temperature: 0.5,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
    }),
  },
);
```

This is the real AI call.

Important parts:

- `Authorization`: sends the secret API key
- `model`: picks the OpenRouter model
- `temperature`: controls creativity
- `max_tokens`: limits response length
- `messages`: sends the prompt plus conversation

### Error handling

The route also handles problems safely:

- missing API key
- invalid request body
- empty messages
- OpenRouter API failure
- empty AI response

This is a good backend habit: never assume the happy path is the only path.

---

## 6. How the Full Data Flow Works

Here is the complete journey of one user question.

### 1. The user types a question

For example:

```text
How did you improve the facial biometrics model?
```

### 2. React stores it locally

The question is pushed into the `messages` state.

### 3. The frontend sends a request to the local API route

The browser sends a `POST` request to:

```text
/api/digital-twin
```

### 4. The Next.js route reads environment variables

It uses `getOpenRouterApiKey()` and `resolveOpenRouterModel()`.

### 5. The route builds a prompt

It combines:

- the system instructions
- the digital twin profile
- the conversation messages

### 6. The route sends the request to OpenRouter

OpenRouter calls the configured AI model.

### 7. The route receives the answer

It extracts the assistant message and sends it back to the browser.

### 8. React displays the new AI message

The chat updates without reloading the page.

This is a classic frontend-backend interaction cycle.

---

## 7. Why the API Key Stays Safe

A very important rule in web development is:

Never put secret API keys in browser code.

Why?

Because anything sent to the browser can be inspected by users.

In this project, the key is safe because:

- it lives in environment variables
- it is read only on the server
- the browser only talks to `/api/digital-twin`
- the browser never sees the real OpenRouter key

This is one of the most important architectural decisions in the whole project.

---

## 8. Environment Variables

The project provides:

```text
.env.local.example
```

Expected variables:

```env
OPENROUTER_API_KEY=replace-with-your-openrouter-key
OPENROUTER_MODEL=openai/gpt-5-mini
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_SITE_NAME=Ilona Kuznetsova Portfolio
```

### Which model is used?

The app first checks:

- `OPENROUTER_MODEL`
- `OPENROUTER_CHAT_MODEL`

If neither is set, it falls back to:

```ts
openai/gpt-5-mini
```

That fallback is defined in:

```text
src/lib/openrouter.ts
```

---

## 9. Beginner Notes on Styling Decisions

This project intentionally avoids a plain template look.

The visual direction is:

- dark but not flat
- premium but not sterile
- technical but still human

Some design choices used to create that feeling:

- layered background gradients
- blurred glass-like navigation
- strong rounded cards
- tight typography
- accent color for highlights
- timeline structure for career history
- a chat UI that feels integrated, not bolted on

This is a reminder that frontend work is not only about function. It is also about visual communication.

---

## 10. Troubleshooting Note About the Hydration Warning in Your Screenshot

The hydration warning shown in your screenshot is very likely not caused by this app's logic.

The screenshot shows extra attributes being added to the `<body>` element, including values like:

- `bis_register`
- a processed extension-style attribute

That usually means a browser extension modified the HTML before React finished hydrating.

Why that matters:

- Next.js server-rendered one version of the HTML
- the browser extension changed it
- React then compared the server version and client version
- they no longer matched

That type of warning commonly disappears if you:

- disable the extension for `localhost`
- open the site in an incognito window without extensions
- test in another browser profile

So this is best treated as a local browser-environment issue, not a core application bug.

---

## 11. A Simple Mental Model for the Whole App

If you are brand new to frontend coding, here is the easiest way to think about the project:

### Content layer

This is the raw information.

Files:

- `careerProfile.ts`

### Presentation layer

This is what the user sees.

Files:

- `page.tsx`
- `page.module.css`
- `DigitalTwinChat.tsx`
- `DigitalTwinChat.module.css`

### Configuration layer

This is how the app knows which AI model and key to use.

Files:

- `openrouter.ts`
- `.env.local`

### Server logic layer

This is the code that safely talks to OpenRouter.

Files:

- `route.ts`

If you remember just those four layers, you already understand a big part of how this project works.

---

## 12. What You Can Practice Next as a Beginner

If you want to learn from this project actively, try these exercises:

1. Change one of the hero texts in `page.tsx`.
2. Add a new starter question in `careerProfile.ts`.
3. Change the accent color in `globals.css`.
4. Add a new project card in `careerProfile.ts`.
5. Change the default AI model in `openrouter.ts`.
6. Add a loading spinner or animated dots to the chat.
7. Add a "Clear chat" button in `DigitalTwinChat.tsx`.

These are great beginner exercises because they touch both UI and logic without being too risky.

---

## 13. Final Self-Review: 5 Ways This Code Could Be Improved

Here are five honest improvement ideas based on a self-review.

1. The Digital Twin could use a more stable message ID system.
   Right now, chat messages use `role-index` as the React key. A better approach would be to generate a unique ID for each message to reduce the chance of rendering edge cases.

2. The chat state could be managed more carefully on failed requests.
   In the current version, the error path restores messages using a closure-based value. This works, but a more robust pattern would use only functional state updates or a reducer.

3. The API route could add stronger rate limiting and abuse protection.
   For a local demo this is fine, but for a public deployment we would want limits, request validation rules, and possibly bot protection.

4. The AI context could be structured in a more maintainable format.
   Right now, `digitalTwinProfile` is a large string. A cleaner long-term design would store the profile as structured data and generate the prompt from that data.

5. The site could benefit from tests.
   The code is validated by linting and building, but there are no automated tests yet for the chat UI, API route behavior, or key user flows.

---

## 14. Closing Summary

This project is a good example of a modern full-stack frontend application because it combines:

- visual design
- React components
- typed data structures
- local state management
- server-side API logic
- external AI integration
- environment-based configuration

The most important lesson is this:

The frontend is not just "what the page looks like." It is the combination of:

- structure
- style
- interaction
- data flow
- safe communication with backend services

That is exactly what this portfolio and Digital Twin demonstrate.
