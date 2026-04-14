# Skin Analyze App — Claude Code Guide

## Project Purpose
A web-based skin analysis app that opens the device camera, captures a face photo, analyzes skin condition using AI, and recommends a personalized skincare routine.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS only — no CSS modules, no inline styles
- **AI**: Google Gemini 2.0 Flash via `@google/generative-ai` SDK
- **Camera**: WebRTC `navigator.mediaDevices.getUserMedia()` — no camera library
- **State**: React `useState` / `useRef` only — no Redux, no Zustand
- **Auth/DB**: None — session-only, no persistence

## Running the App

```bash
npm install
npm run dev      # starts at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint check
```

## Environment Variables

Create a `.env.local` file in the project root (never commit this):

```
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

Get a free API key at: https://aistudio.google.com

## Project Structure

```
app/
  page.tsx                  # Main page — orchestrates state flow
  layout.tsx                # Root layout, fonts, metadata
  api/
    analyze/
      route.ts              # POST /api/analyze — calls Gemini, returns JSON
components/
  CameraCapture.tsx         # Live camera feed + capture button + upload fallback
  ImagePreview.tsx          # Shows captured image, Retake / Analyze buttons
  SkinReport.tsx            # Displays skin condition cards + overall score
  SkincareRoutine.tsx       # Morning & evening routine steps
lib/
  analyzeImage.ts           # Gemini API call logic (used by API route)
  types.ts                  # Shared TypeScript types for analysis result
```

## Key Conventions
- Components are in `/components`, all named with PascalCase `.tsx` files
- All Gemini API calls go through `/app/api/analyze/route.ts` — never call Gemini directly from client components (keeps API key server-side)
- The AI returns a single JSON object — shape is defined in `lib/types.ts`
- Camera logic lives entirely in `CameraCapture.tsx` — do not spread camera state into parent
- Tailwind only for styling — no extra CSS files unless absolutely necessary

## App State Flow
```
camera → preview → analyzing → results
```
State is managed in `app/page.tsx` using a `step` enum.
