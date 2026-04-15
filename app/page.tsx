"use client";

import { useState } from "react";
import CameraCapture from "@/components/CameraCapture";
import ImagePreview from "@/components/ImagePreview";
import SkinReport from "@/components/SkinReport";
import SkincareRoutine from "@/components/SkincareRoutine";
import type { AnalysisResult } from "@/lib/types";

type Step = "camera" | "preview" | "analyzing" | "results";

function stepIndex(step: Step): number {
  return { camera: 0, preview: 1, analyzing: 1, results: 2 }[step];
}

export default function HomePage() {
  const [step, setStep] = useState<Step>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (imageBase64: string) => {
    setCapturedImage(imageBase64);
    setStep("preview");
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setStep("camera");
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setStep("analyzing");
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: capturedImage }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setAnalysisResult(data as AnalysisResult);
      setStep("results");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setStep("preview");
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setStep("camera");
  };

  const idx = stepIndex(step);

  return (
    <main className="min-h-screen bg-skin-bg relative overflow-x-hidden">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-3/4 h-3/4 rounded-full bg-skin-rose/5 blur-[160px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-skin-gold/5 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-md px-5 py-10 z-10">

        {/* Header */}
        <header className="flex items-end justify-between mb-10 animate-fade-up">
          <div>
            <h1 className="font-display text-[2.4rem] font-light text-skin-cream tracking-wide leading-none">
              Lumina
            </h1>
            <p className="text-[9px] text-skin-gold font-body uppercase tracking-[0.28em] mt-2">
              AI · Skin Analysis
            </p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 pb-1">
            {["Capture", "Review", "Results"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`h-[2px] rounded-full transition-all duration-700 ${
                    i <= idx ? "w-8 bg-skin-gold" : "w-4 bg-skin-border"
                  }`}
                />
                {i < 2 && (
                  <div
                    className={`w-1 h-1 rounded-full transition-colors duration-500 ${
                      i < idx ? "bg-skin-gold/50" : "bg-skin-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="mb-5 bg-skin-red/10 border border-skin-red/25 rounded-2xl px-4 py-3 flex items-start gap-3">
            <span className="text-skin-red text-xs mt-0.5 flex-shrink-0">✕</span>
            <p className="text-sm text-skin-cream/80 font-body leading-relaxed">{error}</p>
          </div>
        )}

        {/* Step: Camera */}
        {step === "camera" && (
          <CameraCapture onCapture={handleCapture} />
        )}

        {/* Step: Preview / Analyzing */}
        {(step === "preview" || step === "analyzing") && capturedImage && (
          <ImagePreview
            imageBase64={capturedImage}
            onRetake={handleRetake}
            onAnalyze={handleAnalyze}
            isAnalyzing={step === "analyzing"}
          />
        )}

        {/* Step: Results */}
        {step === "results" && analysisResult && (
          <div className="flex flex-col gap-10">
            <SkinReport
              result={analysisResult}
              capturedImage={capturedImage}
              onReset={handleReset}
            />
            <SkincareRoutine
              morningRoutine={analysisResult.morningRoutine}
              eveningRoutine={analysisResult.eveningRoutine}
              tips={analysisResult.tips}
            />
            <div className="pb-12 flex justify-center">
              <button
                onClick={handleReset}
                className="font-body text-sm text-skin-muted hover:text-skin-gold transition-colors border border-skin-border hover:border-skin-gold/40 rounded-full px-8 py-2.5 active:scale-95"
              >
                New Analysis
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
