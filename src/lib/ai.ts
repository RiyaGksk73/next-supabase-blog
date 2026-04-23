import OpenAI from "openai";

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
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OpenAI summary generation skipped: OPENAI_API_KEY is not configured.");
    return fallback;
  }

  const input = `Summarize the following blog into ~200 words. Return plain text only.\n\n${content}`;

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input,
      max_output_tokens: 320,
    });

    const summary = (response.output_text ?? "").trim();
    if (!summary) {
      console.error("OpenAI summary generation returned empty output. Using fallback summary.");
      return fallback;
    }

    return summary;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OpenAI error";
    console.error(`OpenAI summary generation failed. Using fallback summary. ${message}`);
    return fallback;
  }
}