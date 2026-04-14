"use client";

import type { AnalysisResult, ConditionScore } from "@/lib/types";

interface SkinReportProps {
  result: AnalysisResult;
  capturedImage?: string | null;
}

const CONDITION_LABELS: Record<keyof AnalysisResult["conditions"], string> = {
  acne: "Acne & Blemishes",
  darkSpots: "Dark Spots",
  redness: "Redness",
  pores: "Pore Visibility",
  wrinkles: "Fine Lines",
  texture: "Skin Texture",
  hydration: "Hydration",
};

const CONDITION_ICONS: Record<keyof AnalysisResult["conditions"], string> = {
  acne: "🔴",
  darkSpots: "🟤",
  redness: "🌹",
  pores: "🔬",
  wrinkles: "〰️",
  texture: "🪨",
  hydration: "💧",
};

function getScoreBarColor(score: number): string {
  if (score <= 3) return "bg-emerald-400";
  if (score <= 6) return "bg-amber-400";
  return "bg-rose-400";
}

function getScoreTextColor(score: number): string {
  if (score <= 3) return "text-emerald-600";
  if (score <= 6) return "text-amber-600";
  return "text-rose-600";
}

function getOverallGradient(score: number): string {
  if (score >= 75) return "from-emerald-400 to-teal-500";
  if (score >= 50) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-pink-500";
}

function getOverallLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Attention";
}

const SKIN_TYPE_COLORS: Record<AnalysisResult["skinType"], string> = {
  oily: "bg-yellow-100 text-yellow-800 border-yellow-200",
  dry: "bg-blue-100 text-blue-800 border-blue-200",
  combination: "bg-purple-100 text-purple-800 border-purple-200",
  normal: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const SKIN_TYPE_LABELS: Record<AnalysisResult["skinType"], string> = {
  oily: "Oily",
  dry: "Dry",
  combination: "Combination",
  normal: "Normal",
};

function ConditionCard({
  conditionKey,
  condition,
}: {
  conditionKey: keyof AnalysisResult["conditions"];
  condition: ConditionScore;
}) {
  const label = CONDITION_LABELS[conditionKey];
  const icon = CONDITION_ICONS[conditionKey];
  const isHydration = conditionKey === "hydration";
  const effectiveScore = isHydration ? 10 - condition.score : condition.score;
  const barWidth = `${(10 - effectiveScore) * 10}%`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-gray-800 text-sm">{label}</span>
        </div>
        <span className={`font-bold text-sm px-2 py-0.5 rounded-full ${
          effectiveScore <= 3
            ? "bg-emerald-50 text-emerald-700"
            : effectiveScore <= 6
            ? "bg-amber-50 text-amber-700"
            : "bg-rose-50 text-rose-700"
        }`}>
          {condition.score}/10
        </span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(effectiveScore)}`}
          style={{ width: barWidth }}
        />
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{condition.description}</p>
    </div>
  );
}

export default function SkinReport({ result, capturedImage }: SkinReportProps) {
  const conditionKeys = Object.keys(result.conditions) as Array<keyof AnalysisResult["conditions"]>;
  const gradient = getOverallGradient(result.overallScore);

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Score Card */}
      <div className={`rounded-3xl bg-gradient-to-br ${gradient} p-6 shadow-lg text-white`}>
        {/* Captured photo */}
        {capturedImage && (
          <div className="flex justify-center mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={capturedImage}
              alt="Your skin photo"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-lg"
            />
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          {/* Score ring */}
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-white/30 bg-white/10">
            <div className="text-center">
              <div className="text-5xl font-extrabold leading-none">{result.overallScore}</div>
              <div className="text-xs font-medium opacity-80 mt-0.5">/ 100</div>
            </div>
          </div>

          {/* Label */}
          <div className="text-center">
            <p className="text-2xl font-bold">{getOverallLabel(result.overallScore)}</p>
            <p className="text-sm opacity-80 mt-0.5">Overall Skin Health</p>
          </div>

          {/* Skin type badge */}
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${SKIN_TYPE_COLORS[result.skinType]} bg-white`}>
            {SKIN_TYPE_LABELS[result.skinType]} Skin
          </span>
        </div>
      </div>

      {/* Condition Cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-900">Skin Conditions</h3>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {conditionKeys.length} areas analyzed
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {conditionKeys.map((key) => (
            <ConditionCard
              key={key}
              conditionKey={key}
              condition={result.conditions[key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
