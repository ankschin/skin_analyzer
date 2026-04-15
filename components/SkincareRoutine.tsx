"use client";

import type { RoutineStep } from "@/lib/types";

interface SkincareRoutineProps {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  tips: string[];
}

function StepCard({ step, index }: { step: RoutineStep; index: number }) {
  return (
    <div className="flex items-start gap-4 bg-skin-card rounded-2xl p-4 border border-skin-border shadow-sm shadow-skin-rim/10">
      {/* Step number circle */}
      <div className="w-7 h-7 rounded-full border border-skin-gold/45 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="font-display text-sm font-light text-skin-gold leading-none">
          {index + 1}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-body font-medium text-skin-cream">{step.step}</p>
        <p className="text-[11px] text-skin-muted font-body mt-0.5 mb-3">{step.productType}</p>

        {step.keyIngredients.length > 0 && (
          <div className="mb-2.5">
            <p className="text-[9px] font-body font-semibold text-skin-faint uppercase tracking-[0.18em] mb-1.5">
              Look for
            </p>
            <div className="flex flex-wrap gap-1.5">
              {step.keyIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-2 py-0.5 bg-skin-gold/10 text-skin-gold text-[10px] font-body rounded-full border border-skin-gold/20"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {step.avoid.length > 0 && (
          <div>
            <p className="text-[9px] font-body font-semibold text-skin-faint uppercase tracking-[0.18em] mb-1.5">
              Avoid
            </p>
            <div className="flex flex-wrap gap-1.5">
              {step.avoid.map((item) => (
                <span
                  key={item}
                  className="px-2 py-0.5 bg-skin-red/10 text-skin-red text-[10px] font-body rounded-full border border-skin-red/20 line-through"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  count,
}: {
  icon: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-base leading-none">{icon}</span>
      <h3 className="font-display text-xl font-light text-skin-cream flex-1">{title}</h3>
      <span className="text-[10px] text-skin-faint font-body uppercase tracking-widest">
        {count} steps
      </span>
    </div>
  );
}

export default function SkincareRoutine({
  morningRoutine,
  eveningRoutine,
  tips,
}: SkincareRoutineProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Title */}
      <div>
        <h2 className="font-display text-2xl font-light text-skin-cream">Your Routine</h2>
        <p className="text-xs text-skin-muted font-body mt-1.5 tracking-wide">
          Personalized recommendations based on your analysis
        </p>
      </div>

      {morningRoutine.length > 0 && (
        <div>
          <SectionHeading icon="☀" title="Morning" count={morningRoutine.length} />
          <div className="flex flex-col gap-3">
            {morningRoutine.map((step, i) => (
              <StepCard key={`${step.step}-${i}`} step={step} index={i} />
            ))}
          </div>
        </div>
      )}

      {eveningRoutine.length > 0 && (
        <div>
          <div className="w-full h-[1px] bg-skin-border mb-10" />
          <SectionHeading icon="◑" title="Evening" count={eveningRoutine.length} />
          <div className="flex flex-col gap-3">
            {eveningRoutine.map((step, i) => (
              <StepCard key={`${step.step}-${i}`} step={step} index={i} />
            ))}
          </div>
        </div>
      )}

      {tips.length > 0 && (
        <div>
          <div className="w-full h-[1px] bg-skin-border mb-10" />
          <SectionHeading icon="◆" title="Lifestyle Tips" count={tips.length} />
          <ul className="flex flex-col gap-2.5">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-skin-card rounded-2xl px-4 py-3.5 border border-skin-border shadow-sm shadow-skin-rim/10"
              >
                <span className="text-[10px] font-body text-skin-rose/60 mt-0.5 flex-shrink-0 w-4 text-center tabular-nums">
                  {i + 1}
                </span>
                <span className="text-xs text-skin-muted font-body leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
