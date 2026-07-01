# Ilona Kuznetsova Portfolio

This is a Next.js portfolio website with an integrated OpenRouter-powered "Digital Twin" chat that can answer career questions based on Ilona Kuznetsova's CV and portfolio content.

## Local setup

1. Create a local env file from `.env.local.example`.
2. Set `OPENROUTER_API_KEY` to a valid OpenRouter key.
3. Optionally override `OPENROUTER_MODEL`.
4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## OpenRouter configuration

The Digital Twin reads configuration from server-side environment variables:

- `OPENROUTER_API_KEY`: required for live chat.
- `OPENROUTER_MODEL`: optional.
- `OPENROUTER_SITE_URL`: optional attribution header, defaults to `http://localhost:3000`.
- `OPENROUTER_SITE_NAME`: optional attribution header, defaults to `Ilona Kuznetsova Portfolio`.

If no model is configured, the app falls back to `openai/gpt-5-mini` in [`src/lib/openrouter.ts`](./src/lib/openrouter.ts). This was chosen as the default because OpenRouter documents it as a lower-latency, lower-cost GPT-5 variant suitable for lighter-weight reasoning and instruction-following chat.

## Digital Twin implementation

- UI: [`src/components/DigitalTwinChat.tsx`](./src/components/DigitalTwinChat.tsx)
- API route: [`src/app/api/digital-twin/route.ts`](./src/app/api/digital-twin/route.ts)
- Career context: [`src/lib/careerProfile.ts`](./src/lib/careerProfile.ts)
- Model/env resolution: [`src/lib/openrouter.ts`](./src/lib/openrouter.ts)

The API key stays server-side and is never exposed to the browser.
