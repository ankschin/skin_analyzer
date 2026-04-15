"use client";

import type { AnalysisResult, ConditionScore } from "@/lib/types";

interface SkinReportProps {
  result: AnalysisResult;
  capturedImage?: string | null;
  onReset?: () => void;
}

const CONDITION_LABELS: Record<keyof AnalysisResult["conditions"], string> = {
  acne:       "Acne & Blemishes",
  darkSpots:  "Dark Spots",
  redness:    "Redness",
  pores:      "Pore Visibility",
  wrinkles:   "Fine Lines",
  texture:    "Skin Texture",
  hydration:  "Hydration",
};

const SKIN_TYPE_LABELS: Record<AnalysisResult["skinType"], string> = {
  oily:        "Oily",
  dry:         "Dry",
  combination: "Combination",
  normal:      "Normal",
};

function getOverallLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Attention";
}

function getRingColor(score: number): string {
  if (score >= 75) return "#4A7C5E";
  if (score >= 50) return "#9A6F42";
  return "#8C3E3E";
}

function getConditionTheme(effectiveScore: number) {
  if (effectiveScore <= 3) return { bar: "bg-skin-sage",  text: "text-skin-sage",  border: "border-skin-sage/25"  };
  if (effectiveScore <= 6) return { bar: "bg-skin-gold",  text: "text-skin-gold",  border: "border-skin-gold/25"  };
  return                          { bar: "bg-skin-red",   text: "text-skin-red",   border: "border-skin-red/25"   };
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // 339.3
  const offset = circumference * (1 - score / 100);

  return (
    <div className="relative w-44 h-44 flex items-center justify-center mx-auto">
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 120 120"
      >
        {/* Track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="#E2D9CE"
          strokeWidth="5"
        />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={getRingColor(score)}
          strokeWidth="5"
          strokeLinecap="round"
          className="score-ring"
          style={{ "--ring-offset": String(offset) } as React.CSSProperties}
        />
      </svg>
      <div className="text-center z-10 relative">
        <p className="font-display text-5xl font-light text-skin-cream leading-none">
          {score}
        </p>
        <p className="text-[9px] text-skin-muted font-body uppercase tracking-[0.18em] mt-1.5">
          / 100
        </p>
      </div>
    </div>
  );
}

function ConditionCard({
  conditionKey,
  condition,
}: {
  conditionKey: keyof AnalysisResult["conditions"];
  condition: ConditionScore;
}) {
  const label = CONDITION_LABELS[conditionKey];
  const isHydration = conditionKey === "hydration";
  const effectiveScore = isHydration ? 10 - condition.score : condition.score;
  const healthPct = (10 - effectiveScore) * 10;
  const theme = getConditionTheme(effectiveScore);

  return (
    <div className={`bg-skin-card rounded-2xl p-4 border shadow-sm shadow-skin-rim/10 ${theme.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-body font-medium text-skin-cream/80">{label}</span>
        <span className={`text-xs font-body font-semibold tabular-nums ${theme.text}`}>
          {condition.score}/10
        </span>
      </div>
      <div className="w-full h-[2px] bg-skin-border rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${theme.bar}`}
          style={{ width: `${healthPct}%` }}
        />
      </div>
      <p className="text-[11px] text-skin-muted font-body leading-relaxed">
        {condition.description}
      </p>
    </div>
  );
}

export default function SkinReport({ result, capturedImage, onReset }: SkinReportProps) {
  const conditionKeys = Object.keys(result.conditions) as Array<
    keyof AnalysisResult["conditions"]
  >;

  return (
    <div className="flex flex-col gap-8 animate-fade-up">

      {/* Hero card */}
      <div className="bg-skin-surface rounded-3xl p-7 border border-skin-border shadow-sm shadow-skin-rim/20">
        <ScoreRing score={result.overallScore} />

        <div className="text-center mt-5">
          <p className="font-display text-xl font-light text-skin-cream">
            {getOverallLabel(result.overallScore)}
          </p>
          <p className="text-xs text-skin-muted font-body mt-1 tracking-wide">
            Overall Skin Health
          </p>
        </div>

        <div className="w-full h-[1px] bg-skin-border my-6" />

        {/* Photo + skin type row */}
        <div className="flex items-center gap-4">
          {capturedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={capturedImage}
              alt="Analyzed skin photo"
              className="w-14 h-14 rounded-xl object-cover ring-1 ring-skin-border flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <p className="text-[9px] text-skin-muted font-body uppercase tracking-[0.18em] mb-1">
              Skin Type
            </p>
            <p className="font-display text-lg font-light text-skin-cream">
              {SKIN_TYPE_LABELS[result.skinType]} Skin
            </p>
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="text-[10px] text-skin-faint font-body hover:text-skin-muted transition-colors px-3 py-1.5 rounded-full border border-skin-border hover:border-skin-rim"
            >
              Retake
            </button>
          )}
        </div>
      </div>

      {/* Conditions grid */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-display text-xl font-light text-skin-cream">Conditions</h3>
          <span className="text-[10px] text-skin-faint font-body uppercase tracking-widest">
            {conditionKeys.length} areas
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {conditionKeys.map((key) => (
            <ConditionCard key={key} conditionKey={key} condition={result.conditions[key]} />
          ))}
        </div>
      </div>

    </div>
  );
}
