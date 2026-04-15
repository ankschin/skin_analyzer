"use client";

interface ImagePreviewProps {
  imageBase64: string;
  onRetake: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function ImagePreview({
  imageBase64,
  onRetake,
  onAnalyze,
  isAnalyzing,
}: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-6 animate-fade-up">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-light text-skin-cream mb-1.5">
          {isAnalyzing ? "Analyzing Skin" : "Review Photo"}
        </h2>
        <p className="text-xs text-skin-muted font-body tracking-wide">
          {isAnalyzing
            ? "AI is examining your skin conditions…"
            : "Ensure your face is clear and well-lit"}
        </p>
      </div>

      {/* Image + overlay */}
      <div className="relative w-full rounded-[28px] overflow-hidden ring-1 ring-skin-border aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageBase64}
          alt="Captured face photo for skin analysis"
          className="w-full h-full object-cover"
        />

        {/* Analyzing overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-skin-bg/72 backdrop-blur-sm flex flex-col items-center justify-end pb-12 gap-6">
            {/* Scanning beam */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-skin-gold/70 to-transparent animate-scan-beam" />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[70%] h-[72%] border border-skin-gold/15 rounded-xl relative">
                <div className="absolute left-0 right-0 top-1/3 h-[1px] bg-skin-gold/8" />
                <div className="absolute left-0 right-0 top-2/3 h-[1px] bg-skin-gold/8" />
                <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-skin-gold/8" />
                <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-skin-gold/8" />
              </div>
            </div>

            {/* Status indicator */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-skin-rim" />
                <div className="absolute inset-0 rounded-full border-t border-skin-gold animate-spin-slow" />
                <div className="absolute inset-[3px] rounded-full border-b border-skin-rose/50 animate-spin-rev" />
              </div>
              <div className="text-center">
                <p className="text-xs text-skin-gold font-body tracking-[0.2em] uppercase">
                  Processing
                </p>
                <p className="text-[10px] text-skin-muted font-body mt-0.5">
                  Gemini AI is reviewing your photo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isAnalyzing && (
        <div className="flex w-full gap-3">
          <button
            onClick={onRetake}
            className="flex-1 rounded-full border border-skin-border bg-transparent text-skin-muted text-sm font-body py-3.5 hover:border-skin-rim hover:text-skin-cream transition-all active:scale-95"
          >
            Retake
          </button>
          <button
            onClick={onAnalyze}
            className="flex-[2] rounded-full bg-skin-gold text-skin-bg text-sm font-body font-medium py-3.5 hover:bg-skin-amber transition-all active:scale-95 shadow-lg shadow-skin-gold/20"
          >
            Analyze Skin
          </button>
        </div>
      )}

      <p className="text-[10px] text-skin-faint text-center font-body max-w-xs">
        Your photo is analyzed securely and is never stored or shared.
      </p>
    </div>
  );
}
