export const DEFAULT_OPENROUTER_MODEL = "openai/gpt-5-mini";

export function resolveOpenRouterModel() {
  return (
    process.env.OPENROUTER_MODEL?.trim() ||
    process.env.OPENROUTER_CHAT_MODEL?.trim() ||
    DEFAULT_OPENROUTER_MODEL
  );
}

export function getOpenRouterApiKey() {
  return (
    process.env.OPENROUTER_API_KEY?.trim() ||
    process.env.OPENROUTER_KEY?.trim() ||
    ""
  );
}

export function getOpenRouterSiteUrl() {
  return process.env.OPENROUTER_SITE_URL?.trim() || "http://localhost:3000";
}

export function getOpenRouterSiteName() {
  return process.env.OPENROUTER_SITE_NAME?.trim() || "Ilona Kuznetsova Portfolio";
}
