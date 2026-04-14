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
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Photo</h2>
        <p className="mt-1 text-gray-500">
          Make sure your face is clearly visible and well-lit before analyzing.
        </p>
      </div>

      <div className="relative w-full max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageBase64}
          alt="Captured face photo for skin analysis"
          className="w-full rounded-2xl object-cover aspect-[3/4]"
        />

        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 rounded-2xl gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-semibold text-lg">Analyzing your skin…</p>
            <p className="text-white text-sm opacity-75">This may take a few seconds</p>
          </div>
        )}
      </div>

      <div className="flex w-full max-w-md gap-3">
        <button
          onClick={onRetake}
          disabled={isAnalyzing}
          className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Retake
        </button>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex-[2] rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? "Analyzing…" : "Analyze Skin"}
        </button>
      </div>

      <p className="text-xs text-gray-400 max-w-sm text-center">
        Your photo is sent securely to our AI for analysis. It is not stored or shared.
      </p>
    </div>
  );
}
