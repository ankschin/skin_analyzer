"use client";

import type { RoutineStep } from "@/lib/types";

interface SkincareRoutineProps {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  tips: string[];
}

function StepCard({ step, index, accent }: { step: RoutineStep; index: number; accent: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 text-white ${accent}`}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm mb-0.5">{step.step}</p>
          <p className="text-xs text-gray-500 mb-3">{step.productType}</p>

          {step.keyIngredients.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                Look for
              </p>
              <div className="flex flex-wrap gap-1">
                {step.keyIngredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-full"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {step.avoid.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-1">
                Avoid
              </p>
              <div className="flex flex-wrap gap-1">
                {step.avoid.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RoutineSection({
  title,
  icon,
  steps,
  headerClass,
  accentClass,
}: {
  title: string;
  icon: string;
  steps: RoutineStep[];
  headerClass: string;
  accentClass: string;
}) {
  return (
    <div>
      <div className={`flex items-center gap-2 mb-3 px-4 py-2 rounded-xl ${headerClass}`}>
        <span className="text-xl">{icon}</span>
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="ml-auto text-xs opacity-70">{steps.length} steps</span>
      </div>
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <StepCard key={`${step.step}-${i}`} step={step} index={i} accent={accentClass} />
        ))}
      </div>
    </div>
  );
}

export default function SkincareRoutine({
  morningRoutine,
  eveningRoutine,
  tips,
}: SkincareRoutineProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Your Personalized Routine</h2>
        <p className="text-sm text-gray-500">
          Ingredient-based recommendations tailored to your skin analysis.
        </p>
      </div>

      {morningRoutine.length > 0 && (
        <RoutineSection
          title="Morning Routine"
          icon="☀️"
          steps={morningRoutine}
          headerClass="bg-amber-50 text-amber-800 border border-amber-100"
          accentClass="bg-amber-400"
        />
      )}

      {eveningRoutine.length > 0 && (
        <RoutineSection
          title="Evening Routine"
          icon="🌙"
          steps={eveningRoutine}
          headerClass="bg-indigo-50 text-indigo-800 border border-indigo-100"
          accentClass="bg-indigo-500"
        />
      )}

      {tips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-100">
            <span className="text-xl">💡</span>
            <h3 className="text-sm font-bold">Lifestyle Tips</h3>
            <span className="ml-auto text-xs opacity-70">{tips.length} tips</span>
          </div>
          <ul className="flex flex-col gap-2">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-white border border-teal-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
