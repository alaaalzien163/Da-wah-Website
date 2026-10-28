"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Monogram } from "@/components/ui/Monogram";

const EASE = [0.22, 1, 0.36, 1] as const;
const DOOR_EASE = [0.76, 0, 0.24, 1] as const;

/** Reveal timeline in seconds; the finish timer mirrors it exactly. */
const TIMELINE = {
  copyFade: 0.32,
  curtainDelay: 0.22,
  curtainTravel: 1,
} as const;

const REDUCED_TIMELINE_MS = 420;
const FULL_TIMELINE_MS =
  (TIMELINE.curtainDelay + TIMELINE.curtainTravel) * 1000 + 50;

type Status = "closed" | "opening" | "done";

export interface OpeningScreenProps {
  names: { first: string; second: string };
  monogram: string;
  label: string;
  phrase: string;
  cta: string;
  ctaOpening: string;
  hint: string;
  demoLabel: string;
  demoNote: string;
}

/**
 * Full-screen invitation cover.
 *
 * The main experience is rendered underneath and made inert while the cover is
 * open, so the reveal is a pure presentation transition — no content depends
 * on the gate having run. Curtains slide apart after the cover copy fades.
 */
export function OpeningScreen({
  names,
  monogram,
  label,
  phrase,
  cta,
  ctaOpening,
  hint,
  demoLabel,
  demoNote,
}: OpeningScreenProps) {
  const [status, setStatus] = useState<Status>("closed");
  const overlayRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const isLocked = status !== "done";
  const isOpening = status === "opening";

  const openInvitation = () => {
    if (status !== "closed") return;
    setStatus("opening");
    overlayRef.current?.focus({ preventScroll: true });
  };

  const finishOpening = () => {
    setStatus((current) => (current === "opening" ? "done" : current));
  };

  /* Lock page scroll and hide the invitation from assistive tech while the
     cover is active. Everything is restored as soon as the reveal completes. */
  useEffect(() => {
    if (!isLocked) return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const content = document.getElementById("invitation-content");
    const skipLink = document.getElementById("skip-link");

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    content?.setAttribute("inert", "");
    content?.setAttribute("aria-hidden", "true");
    skipLink?.setAttribute("inert", "");

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousBodyOverflow;
      content?.removeAttribute("inert");
      content?.removeAttribute("aria-hidden");
      skipLink?.removeAttribute("inert");
    };
  }, [isLocked]);

  /* Move focus to the primary action once, then keep the cover as a focus
     trap. There is only one control, so Tab is intentionally contained. */
  useEffect(() => {
    if (status !== "closed") return;

    const timer = window.setTimeout(() => {
      document
        .getElementById("opening-cta")
        ?.focus({ preventScroll: true });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      const target = isOpening
        ? overlayRef.current
        : document.getElementById("opening-cta");
      target?.focus({ preventScroll: true });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, isOpening]);

  /* The reveal is driven by one explicit timer that mirrors the animation
     timeline. This keeps the gate from ever trapping the visitor if an
     animation is interrupted, throttled or never runs at all. */
  useEffect(() => {
    if (!isOpening) return;

    const timer = window.setTimeout(
      finishOpening,
      reduceMotion ? REDUCED_TIMELINE_MS : FULL_TIMELINE_MS,
    );

    return () => window.clearTimeout(timer);
  }, [isOpening, reduceMotion]);

  /* Hand focus to the real invitation once it is revealed. */
  useEffect(() => {
    if (status !== "done") return;
    document
      .getElementById("invitation-title")
      ?.focus({ preventScroll: true });
  }, [status]);

  if (status === "done") return null;

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
      aria-describedby="opening-demo"
      className="opening-gate fixed inset-0 z-50 isolate overflow-hidden text-ivory-100 focus:outline-none"
    >
      {/* Curtains: two matching emerald panels that part to reveal the page. */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={
          isOpening
            ? reduceMotion
              ? { opacity: 0 }
              : { x: "101%" }
            : { x: "0%", opacity: 1 }
        }
        transition={{
          duration: reduceMotion ? 0.3 : TIMELINE.curtainTravel,
          ease: reduceMotion ? "easeOut" : DOOR_EASE,
          delay: reduceMotion ? 0.1 : TIMELINE.curtainDelay,
        }}
        className="absolute inset-y-0 right-0 w-1/2 bg-emerald-950"
      />
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={
          isOpening
            ? reduceMotion
              ? { opacity: 0 }
              : { x: "-101%" }
            : { x: "0%", opacity: 1 }
        }
        transition={{
          duration: reduceMotion ? 0.3 : TIMELINE.curtainTravel,
          ease: reduceMotion ? "easeOut" : DOOR_EASE,
          delay: reduceMotion ? 0.1 : TIMELINE.curtainDelay,
        }}
        className="absolute inset-y-0 left-0 w-1/2 bg-emerald-950"
      />

      {/* Ornament: a quiet arch, corner ticks and a single champagne glow. */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: isOpening ? 0 : 1 }}
        transition={{ duration: isOpening ? 0.3 : 0.6, ease: EASE }}
        className="pointer-events-none absolute inset-0 z-[1]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_36%,rgb(198_166_100/0.10),transparent_64%)]" />
        <div className="absolute inset-x-0 top-[7%] mx-auto h-[86%] w-[min(88vw,38rem)] rounded-t-full border-x border-t border-gold-500/20" />
        <span className="absolute top-4 left-4 size-5 border-t border-l border-gold-500/30 sm:top-6 sm:left-6 sm:size-7" />
        <span className="absolute top-4 right-4 size-5 border-t border-r border-gold-500/30 sm:top-6 sm:right-6 sm:size-7" />
        <span className="absolute bottom-4 left-4 size-5 border-b border-l border-gold-500/30 sm:bottom-6 sm:left-6 sm:size-7" />
        <span className="absolute bottom-4 right-4 size-5 border-b border-r border-gold-500/30 sm:bottom-6 sm:right-6 sm:size-7" />
      </motion.div>

      {/* Scrollable on short screens so the cover never clips its content. */}
      <motion.div
        initial={false}
        animate={
          isOpening
            ? { opacity: 0, y: reduceMotion ? 0 : -10 }
            : { opacity: 1, y: 0 }
        }
        transition={{
          duration: reduceMotion ? 0.2 : TIMELINE.copyFade,
          ease: EASE,
        }}
        className="relative z-10 h-svh overflow-y-auto overscroll-contain"
      >
        <div className="flex min-h-full flex-col items-center justify-center px-gutter py-7 text-center sm:py-12">
          <div className="w-full max-w-narrow">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/25 px-3.5 py-1.5 text-label leading-none text-gold-300">
              <span
                aria-hidden="true"
                className="size-1 rounded-full bg-gold-500/70"
              />
              {demoLabel}
            </p>

            <div className="mt-4 sm:mt-5">
              <Eyebrow>{label}</Eyebrow>
            </div>

            <Monogram
              initials={monogram}
              size="md"
              className="mt-4 sm:mt-5"
            />

            <p
              id="opening-title"
              className="mt-4 font-display text-display text-balance text-ivory-50 sm:mt-5"
            >
              <span className="inline">{names.first}</span>{" "}
              <span className="mx-1 inline font-body text-2xl font-normal leading-none text-gold-500">
                و
              </span>{" "}
              <span className="inline">{names.second}</span>
            </p>

            <Divider className="mx-auto mt-5 max-w-32 text-gold-500 sm:mt-6" />

            <p className="mx-auto mt-4 max-w-prose text-pretty text-lead text-ivory-100/85 sm:mt-5">
              {phrase}
            </p>

            <div className="mx-auto mt-6 w-full max-w-64 sm:mt-7 sm:max-w-none">
              <Button
                id="opening-cta"
                size="lg"
                onClick={openInvitation}
                disabled={isOpening}
                aria-busy={isOpening}
                className="w-full px-10 sm:w-auto sm:min-w-64"
              >
                {isOpening ? ctaOpening : cta}
              </Button>
            </div>

            <p className="mt-3 text-label text-mist-300/85 sm:mt-4">{hint}</p>

            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -3 : 0 }}
              transition={{
                duration: isOpening ? 0.2 : 0.6,
                delay: isOpening ? 0 : 0.5,
                ease: EASE,
              }}
              className="mt-1 inline-flex text-gold-500/70"
            >
              <ChevronDown className="size-4" strokeWidth={1.5} />
            </motion.span>

            <p
              id="opening-demo"
              className="mt-3 text-xs leading-relaxed text-mist-300/85 sm:mt-4"
            >
              {demoNote}
            </p>

            <p role="status" aria-live="polite" className="sr-only">
              {isOpening ? ctaOpening : ""}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
