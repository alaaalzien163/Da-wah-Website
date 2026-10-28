"use client";

import { Link2, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Feedback = { kind: "success" | "error"; message: string };

export interface ShareActionsProps {
  /** Canonical public URL, or null during local development. */
  shareUrl: string | null;
  title: string;
  text: string;
}

function legacyCopy(value: string): boolean {
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.insetBlockStart = "-9999px";
  area.style.opacity = "0";
  document.body.appendChild(area);

  const previous =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  area.select();
  area.setSelectionRange(0, value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  area.remove();
  previous?.focus({ preventScroll: true });
  return copied;
}

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Permission denied or unavailable — try the legacy path below.
  }

  return legacyCopy(value);
}

/**
 * Native share where available, with copy-link as the always-present fallback.
 * The public URL is only resolved from an HTTPS origin, so a local preview can
 * never put `localhost` on someone's clipboard.
 */
export function ShareActions({ shareUrl, title, text }: ShareActionsProps) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const feedbackTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (feedbackTimer.current !== null) {
        window.clearTimeout(feedbackTimer.current);
      }
    },
    [],
  );

  const clearFeedback = () => {
    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current);
      feedbackTimer.current = null;
    }
    setFeedback(null);
  };

  const announce = (next: Feedback) => {
    clearFeedback();
    setFeedback(next);
    feedbackTimer.current = window.setTimeout(() => {
      setFeedback(null);
      feedbackTimer.current = null;
    }, 5000);
  };

  if (!shareUrl) {
    return (
      <p className="mx-auto max-w-sm text-pretty text-[0.8125rem] leading-relaxed text-mist-300/85">
        المشاركة تُتاح بعد نشر الدعوة على رابط عام. لا يُشارَك رابط التطوير
        المحلي.
      </p>
    );
  }

  const handleCopy = async () => {
    clearFeedback();
    const copied = await copyText(shareUrl);
    announce(
      copied
        ? { kind: "success", message: "تم نسخ الرابط." }
        : {
            kind: "error",
            message: "تعذّر نسخ الرابط. يمكنكم نسخه من شريط العنوان.",
          },
    );
  };

  const handleShare = async () => {
    clearFeedback();
    const data = { title, text, url: shareUrl };

    try {
      if (
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" || navigator.canShare(data))
      ) {
        await navigator.share(data);
        announce({ kind: "success", message: "تمت مشاركة الدعوة." });
        return;
      }

      const copied = await copyText(shareUrl);
      announce(
        copied
          ? { kind: "success", message: "تم نسخ الرابط." }
          : {
              kind: "error",
              message: "تعذّرت المشاركة. انسخوا الرابط من شريط العنوان.",
            },
      );
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") {
        return;
      }
      announce({
        kind: "error",
        message: "تعذّرت المشاركة. حاولوا مرة أخرى أو انسخوا الرابط.",
      });
    }
  };

  return (
    <div>
      <h3 className="font-display text-heading text-ivory-50">
        شاركوا فرحتنا
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-pretty text-small text-mist-300/90">
        أرسلوا الدعوة إلى من تحبون، ليكونوا معكم في هذه المناسبة.
      </p>

      <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Button
          size="lg"
          onClick={handleShare}
          className="w-full sm:w-auto"
        >
          <Share2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
          مشاركة الدعوة
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleCopy}
          className="w-full sm:w-auto"
        >
          <Link2 aria-hidden="true" className="size-4" strokeWidth={1.5} />
          نسخ الرابط
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-4 min-h-5 text-xs leading-relaxed",
          feedback?.kind === "success"
            ? "text-gold-300"
            : "text-ivory-100/90",
        )}
      >
        {feedback?.message ?? ""}
      </p>
    </div>
  );
}
