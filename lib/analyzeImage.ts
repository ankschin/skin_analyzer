import Groq from "groq-sdk";
import type { AnalysisResult } from "./types";

const PROMPT = `You are a professional dermatologist assistant. Analyze the skin in this face photo and return condition scores.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact shape:
{
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

For conditions (acne, darkSpots, redness, pores, wrinkles, texture): 0 = zero visible signs, 10 = severe.
For hydration: 0 = severely dehydrated/flaky, 10 = perfectly plump and hydrated.

Be accurate and specific — use the full 0-10 range. Do not default to middle values:
- acne: 0 = no blemishes at all | 2 = 1-2 minor spots | 5 = moderate breakouts | 8+ = severe/cystic acne
- darkSpots: 0 = perfectly even tone | 2 = barely perceptible | 5 = clearly visible spots | 8+ = heavy hyperpigmentation
- redness: 0 = no redness | 2 = very faint | 5 = moderate redness across cheeks | 8+ = intense redness/rosacea
- pores: 0 = invisible pores | 2 = only visible up close | 5 = clearly visible | 8+ = very enlarged
- wrinkles: 0 = no lines | 2 = faint expression lines | 5 = moderate wrinkles | 8+ = deep wrinkles
- texture: 0 = perfectly smooth | 2 = very slightly uneven | 5 = rough/bumpy patches | 8+ = very rough
- hydration: 10 = perfectly hydrated | 7 = well hydrated | 5 = adequately hydrated | 2 = dry/tight | 0 = severely dehydrated

Also suggest foods to eat/focus on for improving based on skin condition.
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
        const data = JSON.parse(jsonText) as AnalysisResult;
        // Compute overall score from condition scores so it reflects actual analysis,
        // not the model's tendency to anchor around 70.
        const c = data.conditions;
        const severityScores = [
          c.acne.score,
          c.darkSpots.score,
          c.redness.score,
          c.pores.score,
          c.wrinkles.score,
          c.texture.score,
          10 - c.hydration.score, // invert: higher hydration = lower severity
        ];
        const avgSeverity = severityScores.reduce((a, b) => a + b, 0) / severityScores.length;
        data.overallScore = Math.round((1 - avgSeverity / 10) * 100);
        return data;
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
