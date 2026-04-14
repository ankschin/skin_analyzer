"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.addEventListener(
          "loadedmetadata",
          () => {
            video.play().then(() => {
              setIsLoading(false);
              setIsCaptureReady(true);
            });
          },
          { once: true }
        );
      }
    } catch {
      setCameraError("Camera access was denied or unavailable.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror the image to match what the user sees in the video feed
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    onCapture(imageBase64);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      stopCamera();
      onCapture(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Skin Analyzer</h1>
        <p className="mt-2 text-gray-500">
          Position your face in the frame and take a photo for your personalized skin analysis.
        </p>
      </div>

      {!cameraError ? (
        <div className="relative w-full max-w-md">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-2xl z-10">
              <div className="flex flex-col items-center gap-3 text-white">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Starting camera…</span>
              </div>
            </div>
          )}

          {/* Mirror video feed so it feels like a selfie mirror */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-2xl bg-gray-900 aspect-[3/4] object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Face guide overlay */}
          {!isLoading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-64 border-4 border-white border-opacity-60 rounded-full" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="text-4xl mb-3">📷</div>
          <p className="text-gray-600 font-medium mb-1">Camera unavailable</p>
          <p className="text-sm text-gray-400 mb-6">{cameraError}</p>
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors">
            <span>Upload a photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        {!cameraError && (
          <button
            onClick={handleCapture}
            disabled={!isCaptureReady}
            className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-white font-semibold text-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Capture Photo
          </button>
        )}

        {!cameraError && (
          <div className="text-center">
            <span className="text-sm text-gray-400">or </span>
            <label className="text-sm text-indigo-600 cursor-pointer hover:underline">
              upload an image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
