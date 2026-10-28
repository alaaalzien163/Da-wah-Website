"use client";

import { LoaderCircle, Music, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { AudioTrack } from "@/lib/invitation";

type PlaybackStatus = "idle" | "loading" | "playing" | "error";

export interface MusicControlProps {
  track?: AudioTrack;
}

/**
 * Optional background music. Nothing autoplays: the visitor must ask for
 * sound. If the config has no licensed track, the control becomes an honest
 * unavailable state instead of a broken button.
 */
export function MusicControl({ track }: MusicControlProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => {
      setStatus("playing");
      setError(null);
    };
    const handlePause = () => {
      setStatus((current) => (current === "error" ? current : "idle"));
    };
    const handleWaiting = () => {
      setStatus((current) => (current === "playing" ? "loading" : current));
    };
    const handleError = () => {
      setStatus("error");
      setError("تعذّر تشغيل الموسيقى. تحققوا من الملف أو حاولوا مجدداً.");
    };

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  if (!track?.src) {
    return (
      <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 px-4 py-2 text-xs text-mist-300/90">
        <Music aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        الموسيقى غير متاحة في هذا النموذج
      </p>
    );
  }

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || status === "loading") return;

    if (status === "playing") {
      audio.pause();
      return;
    }

    setError(null);
    setStatus("loading");

    if (status === "error") audio.load();

    try {
      await audio.play();
      setStatus("playing");
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setError("تعذّر تشغيل الموسيقى. تحققوا من الملف أو حاولوا مجدداً.");
    }
  };

  const label =
    status === "playing"
      ? "إيقاف الموسيقى"
      : status === "loading"
        ? "جارٍ التشغيل…"
        : status === "error"
          ? "إعادة المحاولة"
          : "تشغيل الموسيقى";

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <audio ref={audioRef} src={track.src} preload="none" loop playsInline />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={status === "playing"}
        aria-busy={status === "loading"}
        aria-label={`${label} — ${track.title}`}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-gold-500/25 px-4 text-xs text-ivory-100 transition-colors duration-200 hover:border-gold-500/60 hover:bg-gold-500/5"
      >
        {status === "playing" ? (
          <Pause aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        ) : status === "loading" ? (
          <LoaderCircle
            aria-hidden="true"
            className="size-3.5 animate-spin"
            strokeWidth={1.5}
          />
        ) : status === "error" ? (
          <RotateCcw
            aria-hidden="true"
            className="size-3.5"
            strokeWidth={1.5}
          />
        ) : (
          <Play aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        )}
        {label}
      </button>

      <p role="status" aria-live="polite" className="min-h-4 text-xs text-mist-300/90">
        {error ?? ""}
      </p>
    </div>
  );
}
