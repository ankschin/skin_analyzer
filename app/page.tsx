"use client";

import { useState } from "react";
import CameraCapture from "@/components/CameraCapture";
import ImagePreview from "@/components/ImagePreview";
import SkinReport from "@/components/SkinReport";
import SkincareRoutine from "@/components/SkincareRoutine";
import type { AnalysisResult } from "@/lib/types";

type Step = "camera" | "preview" | "analyzing" | "results";

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
        throw new Error(
          data.error ?? "Something went wrong. Please try again."
        );
      }

      setAnalysisResult(data as AnalysisResult);
      setStep("results");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100 mb-4">
            <span className="text-lg">✨</span>
            <span className="text-sm font-medium text-indigo-600">AI-Powered Analysis</span>
          </div>
        </header>

        {/* Step: Camera */}
        {step === "camera" && (
          <CameraCapture onCapture={handleCapture} />
        )}

        {/* Step: Preview / Analyzing */}
        {(step === "preview" || step === "analyzing") && capturedImage && (
          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                  <p className="font-semibold mb-0.5">Analysis failed</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
            <ImagePreview
              imageBase64={capturedImage}
              onRetake={handleRetake}
              onAnalyze={handleAnalyze}
              isAnalyzing={step === "analyzing"}
            />
          </div>
        )}

        {/* Step: Results */}
        {step === "results" && analysisResult && (
          <div className="flex flex-col gap-8">
            <SkinReport result={analysisResult} capturedImage={capturedImage} />
            <SkincareRoutine
              morningRoutine={analysisResult.morningRoutine}
              eveningRoutine={analysisResult.eveningRoutine}
              tips={analysisResult.tips}
            />

            <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Want to check again?</p>
              <button
                onClick={handleReset}
                className="rounded-xl bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Analyze Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
