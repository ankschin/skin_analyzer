"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startCallIdRef = useRef(0);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCaptureReady, setIsCaptureReady] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    const callId = ++startCallIdRef.current;
    setIsLoading(true);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (callId !== startCallIdRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

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
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    <div className="flex flex-col items-center gap-6 animate-fade-up">
      {/* Heading */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-light text-skin-cream mb-1.5">
          Face Capture
        </h2>
        <p className="text-xs text-skin-muted font-body tracking-wide">
          Position your face in the center of the frame
        </p>
      </div>

      {!cameraError ? (
        <>
          {/* Viewfinder */}
          <div className="relative w-full">
            {/* Loading state */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-skin-surface rounded-[28px] z-10 aspect-[3/4]">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 rounded-full border border-skin-border" />
                    <div className="absolute inset-0 rounded-full border-t border-skin-gold animate-spin" />
                  </div>
                  <span className="text-[10px] text-skin-muted font-body tracking-[0.18em] uppercase">
                    Initializing
                  </span>
                </div>
              </div>
            )}

            {/* Camera frame */}
            <div className="relative rounded-[28px] overflow-hidden ring-1 ring-skin-border bg-skin-surface aspect-[3/4]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />


              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />

              {/* Shutter button */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <button
                  onClick={handleCapture}
                  disabled={!isCaptureReady}
                  aria-label="Capture photo"
                  className="relative w-[68px] h-[68px] flex items-center justify-center group disabled:opacity-25 disabled:cursor-not-allowed"
                >
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-white/30 group-hover:border-skin-gold/60 transition-colors duration-300" />
                  {/* Inner ring */}
                  <div className="absolute inset-[5px] rounded-full border border-white/10 group-hover:border-skin-gold/25 transition-colors duration-300" />
                  {/* Disc */}
                  <div className="w-[42px] h-[42px] rounded-full bg-white/90 group-hover:bg-skin-cream group-active:scale-90 transition-all duration-150 shadow-lg shadow-black/40" />
                </button>
              </div>
            </div>
          </div>

          {/* Upload fallback */}
          <label className="text-[11px] text-skin-faint font-body cursor-pointer">
            or{" "}
            <span className="text-skin-muted hover:text-skin-gold transition-colors underline underline-offset-2 decoration-skin-muted/40">
              upload a photo
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </>
      ) : (
        /* Camera error */
        <div className="w-full rounded-[28px] border border-skin-border bg-skin-surface p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-skin-card border border-skin-border flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-6 h-6 text-skin-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </div>
          <p className="font-display text-lg text-skin-cream font-light mb-2">
            Camera Unavailable
          </p>
          <p className="text-xs text-skin-muted mb-7 font-body">{cameraError}</p>
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-skin-gold/40 bg-skin-gold/10 px-7 py-2.5 text-skin-gold text-sm font-body hover:bg-skin-gold/20 transition-all active:scale-95">
            Upload a Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
