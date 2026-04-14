import Groq from "groq-sdk";
import type { AnalysisResult } from "./types";

const PROMPT = `You are a professional dermatologist assistant. Analyze the skin in this face photo carefully.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact shape:
{
  "overallScore": <number 0-100>,
  "skinType": <"oily" | "dry" | "combination" | "normal">,
  "conditions": {
    "acne":      { "score": <0-10>, "description": "<1 sentence>" },
    "darkSpots": { "score": <0-10>, "description": "<1 sentence>" },
    "redness":   { "score": <0-10>, "description": "<1 sentence>" },
    "pores":     { "score": <0-10>, "description": "<1 sentence>" },
    "wrinkles":  { "score": <0-10>, "description": "<1 sentence>" },
    "texture":   { "score": <0-10>, "description": "<1 sentence>" },
    "hydration": { "score": <0-10>, "description": "<1 sentence>" }
  },
  "morningRoutine": [
    { "step": "<step name>", "productType": "<type>", "keyIngredients": ["<ingredient>"], "avoid": ["<ingredient>"] }
  ],
  "eveningRoutine": [
    { "step": "<step name>", "productType": "<type>", "keyIngredients": ["<ingredient>"], "avoid": ["<ingredient>"] }
  ],
  "tips": ["<lifestyle tip>"]
}

Score interpretation: 0 = none/perfect, 10 = severe/very poor.
overallScore: 100 = perfect skin, 0 = very poor condition.
Do NOT recommend specific brand or product names — only ingredient types and product categories.`;

export async function analyzeImage(imageBase64: string): Promise<AnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const groq = new Groq({ apiKey });

  const mimeType = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  let lastError: Error = new Error("Unknown error");
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: dataUrl } },
              { type: "text", text: PROMPT },
            ],
          },
        ],
      });

      const text = completion.choices[0]?.message?.content?.trim() ?? "";
      const jsonText = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

      try {
        return JSON.parse(jsonText) as AnalysisResult;
      } catch {
        throw new Error("Could not analyze the image. Please ensure your face is clearly visible.");
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const isRetryable = lastError.message.includes("503") || lastError.message.includes("429");
      if (!isRetryable || attempt === 3) throw lastError;
      await new Promise((r) => setTimeout(r, attempt * 2000));
    }
  }

  throw lastError;
}
