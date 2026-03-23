import { createAnthropic } from "@ai-sdk/anthropic";

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Default model for chat and analysis
export const AI_MODEL = "claude-sonnet-4-6";

// Cheaper model for short, structured tasks
export const AI_MODEL_FAST = "claude-haiku-4-5-20251001";
