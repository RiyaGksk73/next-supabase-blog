import { GoogleGenerativeAI } from "@google/generative-ai";

const SUMMARY_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"] as const;

function buildFallbackSummary(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "No content available to summarize.";
  }

  const sentenceCandidates = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 25);

  if (sentenceCandidates.length >= 2) {
    const selected = sentenceCandidates.slice(0, Math.min(6, Math.max(4, sentenceCandidates.length)));
    const paragraph = selected.join(" ").trim();
    if (paragraph.length >= 80) {
      return paragraph;
    }
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  const targetCount = Math.min(150, Math.max(120, words.length));
  const clipped = words.slice(0, targetCount).join(" ");
  return clipped.trim();
}

export async function generateSummary(content: string) {
  const fallback = buildFallbackSummary(content);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini summary generation skipped: GEMINI_API_KEY is not configured.");
    return fallback;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `Summarize this blog in approximately 180-220 words:\n\n${content}`;

    for (const modelName of SUMMARY_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text().trim();

        if (summary) {
          return summary;
        }

        console.error(`Gemini model ${modelName} returned empty output.`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown Gemini error";
        console.error(`Gemini model ${modelName} failed. ${message}`);
      }
    }

    console.error("Gemini summaries failed on all models. Using fallback summary.");
    return fallback;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gemini error";
    console.error(`Gemini failed, using fallback. ${message}`);
    return fallback;
  }
}
