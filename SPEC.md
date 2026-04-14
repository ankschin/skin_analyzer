# Skin Analyze App — Product Specification

## Overview
A single-page web application that uses the device camera and AI vision to analyze facial skin condition and recommend a personalized skincare routine. No login required. Results are session-only.

---

## Features & Acceptance Criteria

### F1 — Camera Access
- **AC1**: On page load, the app requests camera permission and shows a live video feed (front camera preferred)
- **AC2**: If camera permission is denied or unavailable, a file upload input is shown as fallback
- **AC3**: A "Capture" button freezes the current video frame as the photo to analyze
- **AC4**: Works on desktop (webcam) and mobile (front-facing camera)
- **AC5**: The camera stream is stopped immediately after a photo is captured or an image is uploaded (camera indicator light turns off)

### F2 — Image Preview & Retake
- **AC1**: After capture/upload, the image is shown in a preview before analysis starts
- **AC2**: A "Retake" button returns the user to the camera/upload step
- **AC3**: An "Analyze Skin" button triggers the analysis

### F3 — Skin Analysis
- **AC1**: The captured image is sent to the backend API which calls Gemini 2.0 Flash
- **AC2**: A loading indicator is shown while analysis is in progress
- **AC3**: The following conditions are detected and scored (0–10):
  - Skin type (oily / dry / combination / normal)
  - Acne & blemishes
  - Dark spots / hyperpigmentation
  - Redness / irritation
  - Pore visibility
  - Fine lines & texture
  - Hydration level
- **AC4**: An overall Skin Health Score (0–100) is calculated and displayed
- **AC5**: Each condition has a short text description from the AI

### F4 — Skincare Routine Recommendation
- **AC1**: A morning routine and evening routine are generated based on the analysis
- **AC2**: Each routine step includes: step name, product type, key ingredients, and what to avoid
- **AC3**: Recommendations are generic (ingredient-based) — no specific brand or product names
- **AC4**: Optional lifestyle tips (hydration, diet, sleep) are included

### F5 — Error Handling
- **AC1**: If the AI call fails, a clear error message is shown with a retry option
- **AC2**: If the uploaded image does not contain a visible face, the AI response handles it gracefully

---

## User Flow

```
[App Opens]
    │
    ▼
[Camera Live Feed]  ←──────────────────────────────┐
    │ User clicks "Capture"                         │
    ▼                                               │
[Image Preview]                               [Retake]
    │ User clicks "Analyze Skin"                    │
    ▼                                               │
[Loading: "Analyzing your skin..."]                 │
    │                                               │
    ▼                                               │
[Skin Report Card]                                  │
    │ Skin Health Score                             │
    │ Condition cards (acne, spots, hydration...)   │
    ▼                                               │
[Skincare Routine]                                  │
    │ Morning Routine steps                         │
    │ Evening Routine steps                         │
    │ Lifestyle Tips                                │
    ▼                                               │
[Analyze Again button] ─────────────────────────────┘
```

---

## API Contract

### `POST /api/analyze`

**Request body:**
```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response (success):**
```json
{
  "overallScore": 72,
  "skinType": "combination",
  "conditions": {
    "acne":          { "score": 4, "description": "Mild acne present on forehead" },
    "darkSpots":     { "score": 3, "description": "Light hyperpigmentation on cheeks" },
    "redness":       { "score": 2, "description": "Minimal redness detected" },
    "pores":         { "score": 5, "description": "Moderately visible pores on nose" },
    "wrinkles":      { "score": 2, "description": "Faint fine lines around eyes" },
    "texture":       { "score": 4, "description": "Slightly uneven skin texture" },
    "hydration":     { "score": 6, "description": "Adequately hydrated overall" }
  },
  "morningRoutine": [
    {
      "step": "Cleanser",
      "productType": "Gentle foaming cleanser",
      "keyIngredients": ["salicylic acid", "niacinamide"],
      "avoid": ["sulfates", "alcohol"]
    }
  ],
  "eveningRoutine": [
    {
      "step": "Cleanser",
      "productType": "Micellar water or gentle gel cleanser",
      "keyIngredients": ["ceramides"],
      "avoid": ["harsh exfoliants"]
    }
  ],
  "tips": [
    "Drink at least 8 glasses of water daily",
    "Use SPF 30+ every morning"
  ]
}
```

**Response (error):**
```json
{
  "error": "Could not analyze the image. Please ensure your face is clearly visible."
}
```

---

## AI Prompt Template

Sent to Gemini 2.0 Flash along with the image:

```
You are a professional dermatologist assistant. Analyze the skin in this face photo carefully.

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
Do NOT recommend specific brand or product names — only ingredient types and product categories.
```

---

## Component Props

### `CameraCapture`
```ts
interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}
```

### `ImagePreview`
```ts
interface ImagePreviewProps {
  imageBase64: string;
  onRetake: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}
```

### `SkinReport`
```ts
interface SkinReportProps {
  result: AnalysisResult;  // from lib/types.ts
}
```

### `SkincareRoutine`
```ts
interface SkincareRoutineProps {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  tips: string[];
}
```

---

## Decisions Log

| Topic | Decision | Reason |
|---|---|---|
| AI Provider | Google Gemini 2.0 Flash | Free tier (1,500 req/day), multimodal, no billing required |
| Auth / History | None — session only | Simplicity; no database or login needed |
| Recommendations | Generic ingredients only | Avoids inaccurate brand suggestions; more universally applicable |
| Camera library | None — native WebRTC | No dependency; browser support is universal |
| State management | React useState only | App state is simple; no global state needed |
