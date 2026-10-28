import { Countdown } from "@/components/invitation/Countdown";
import { Gallery } from "@/components/invitation/Gallery";
import { MusicControl } from "@/components/invitation/MusicControl";
import { OpeningScreen } from "@/components/invitation/OpeningScreen";
import { ShareActions } from "@/components/invitation/ShareActions";
import { Venue } from "@/components/invitation/Venue";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { invitation } from "@/content/invitation";
import { buildMapsUrl } from "@/lib/maps";
import { getConfiguredSiteUrl } from "@/lib/site";

const { couple, event, venue, content, opening, demo, gallery, audio, share, features } =
  invitation;

const [first, second] =
  couple.order === "groom-first"
    ? [couple.groom, couple.bride]
    : [couple.bride, couple.groom];

const eventYear = new Intl.DateTimeFormat("en", {
  year: "numeric",
  timeZone: event.timeZone,
}).format(new Date(event.startsAt));

const targetMs = Date.parse(event.startsAt);
const mapsUrl = buildMapsUrl(venue);
const shareUrl = getConfiguredSiteUrl();

export default function HomePage() {
  return (
    <>
      {/* The invitation itself never depends on the gate: it is rendered in
          full underneath and simply made inert while the cover is open. */}
      {features.openingGate ? (
        <OpeningScreen
          names={{ first: first.firstName, second: second.firstName }}
          monogram={couple.monogram}
          label={opening.label}
          phrase={opening.phrase}
          cta={opening.cta}
          ctaOpening={opening.ctaOpening}
          hint={opening.hint}
          demoLabel={demo.label}
          demoNote={demo.note}
        />
      ) : null}

      <div id="invitation-content">
        <main id="main">
          {/* ------------------------------------------- Couple introduction */}
          <header className="relative isolate overflow-clip bg-emerald-900 text-ivory-100">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(198_166_100/0.09),transparent_62%)]" />
              <div className="absolute inset-x-0 top-8 mx-auto h-[80%] w-[min(86vw,46rem)] rounded-t-full border-x border-t border-gold-500/15" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gold-500/15" />
            </div>

            <Container className="flex flex-col items-center py-24 text-center sm:py-32">
              <Reveal>
                <Eyebrow>{opening.label}</Eyebrow>
              </Reveal>

              <Reveal delay={0.08} className="mt-6">
                <Monogram initials={couple.monogram} size="lg" />
              </Reveal>

              <Reveal delay={0.16} className="mt-7">
                <h1
                  id="invitation-title"
                  tabIndex={-1}
                  className="font-display text-display leading-none text-ivory-50 focus:outline-none"
                >
                  <span className="block leading-[1.12]">
                    {first.firstName}
                  </span>
                  <span
                    aria-hidden="true"
                    className="my-1.5 flex items-center justify-center gap-4 sm:my-2 sm:gap-5"
                  >
                    <span className="h-px w-8 bg-gold-500/50 sm:w-14" />
                    <span className="hero-connector font-body text-2xl leading-none text-gold-500 sm:text-3xl" />
                    <span className="h-px w-8 bg-gold-500/50 sm:w-14" />
                  </span>
                  <span className="sr-only"> و </span>
                  <span className="block leading-[1.12]">
                    {second.firstName}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.24} className="w-full max-w-prose">
                <Divider className="mx-auto mt-9 max-w-32 text-gold-500" />

                <p className="mt-7 text-pretty text-lead text-ivory-100/85">
                  {content.introLine}
                </p>
              </Reveal>
            </Container>
          </header>

          {/* ---------------------------------------------------- Countdown */}
          {features.countdown ? (
            <Section
              tone="dark"
              spacing="compact"
              aria-labelledby="countdown-title"
              className="surface-glow-dark"
            >
              <div className="mx-auto max-w-narrow text-center">
                <Reveal>
                  <Eyebrow>العد التنازلي</Eyebrow>

                  <h2
                    id="countdown-title"
                    className="mt-3 font-display text-heading text-ivory-50"
                  >
                    حتى نلتقي
                  </h2>

                  <Divider className="mx-auto mt-5 max-w-24 text-gold-500" />
                </Reveal>

                <Reveal delay={0.08}>
                  <Countdown
                    targetMs={targetMs}
                    timeZoneLabel={event.timeZoneLabel}
                    numerals={invitation.numerals}
                  />
                </Reveal>
              </div>
            </Section>
          ) : null}

          {/* --------------------------------------------- Invitation message */}
          <Section
            tone="light"
            aria-labelledby="message-title"
            className="surface-glow-light border-y border-gold-700/10"
          >
            <div className="mx-auto max-w-prose text-center">
              <Reveal>
                <Eyebrow tone="onLight">الدعوة</Eyebrow>

                <h2
                  id="message-title"
                  className="mt-4 font-display text-title text-ink-900"
                >
                  دعوة إلى الفرح
                </h2>

                <Divider className="mx-auto mt-5 max-w-28 text-gold-700" />
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mt-8 text-pretty text-lead leading-relaxed text-ink-600">
                  {content.invitationText}
                </p>
              </Reveal>
            </div>
          </Section>

          {/* ------------------------------------------------ Event details */}
          <Section
            id="details"
            tone="dark"
            className="surface-glow-dark scroll-mt-6 border-t border-gold-500/15"
            aria-labelledby="details-title"
          >
            <div className="mx-auto max-w-narrow">
              <Reveal className="text-center">
                <Eyebrow>التفاصيل</Eyebrow>

                <h2
                  id="details-title"
                  className="mt-4 font-display text-title text-ivory-50"
                >
                  حين نلتقي
                </h2>

                <Divider className="mx-auto mt-5 max-w-28 text-gold-500" />
              </Reveal>

              <Reveal delay={0.08} className="mx-auto mt-10 max-w-3xl">
                <dl className="grid overflow-hidden border-y border-gold-500/15 sm:grid-cols-2">
                  <div className="flex flex-col items-center gap-2.5 px-4 py-7 text-center">
                    <dt className="text-label text-gold-300">التاريخ</dt>
                    <dd className="font-display text-xl leading-snug text-balance text-ivory-50 sm:text-2xl">
                      <time dateTime={event.startsAt}>{event.dateLabel}</time>
                    </dd>
                  </div>

                  <div className="flex flex-col items-center gap-2.5 border-t border-gold-500/15 px-4 py-7 text-center sm:border-s sm:border-t-0">
                    <dt className="text-label text-gold-300">الوقت</dt>
                    <dd className="font-display text-xl leading-snug text-ivory-50 sm:text-2xl">
                      {event.timeLabel}
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.12}>
                <Venue
                  venue={venue}
                  mapsUrl={mapsUrl}
                  demo={demo}
                  showMap={features.map}
                />
              </Reveal>
            </div>
          </Section>

          {/* ---------------------------------------------------- Gallery */}
          {features.gallery ? (
            <Gallery images={gallery} demo={demo} />
          ) : null}

          {/* ---------------------------------------------------- Closing */}
          <Section
            tone="deepest"
            spacing="compact"
            className="relative isolate overflow-hidden border-t border-gold-500/15"
            aria-labelledby="closing-title"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgb(198_166_100/0.06),transparent_58%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-8 -z-10 mx-auto h-[26rem] w-[min(82vw,34rem)] rounded-t-full border-x border-t border-gold-500/10"
            />

            <div className="mx-auto max-w-prose text-center">
              <Reveal>
                <Monogram initials={couple.monogram} size="md" />

                <h2 id="closing-title" className="sr-only">
                  ختام الدعوة
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-balance font-display text-heading leading-[1.7] text-gold-300">
                  {content.closingText}
                </p>

                <Divider className="mx-auto mt-7 max-w-24 text-gold-500" />
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mt-6 text-small text-mist-300">
                  <span className="font-display text-lg text-ivory-100">
                    {first.firstName} و {second.firstName}
                  </span>
                  <span aria-hidden="true" className="mx-2 text-gold-500/60">
                    ·
                  </span>
                  <span
                    lang="en"
                    dir="ltr"
                    className="font-latin text-base tracking-[0.16em]"
                  >
                    {eventYear}
                  </span>
                </p>
              </Reveal>

              {features.share ? (
                <Reveal
                  delay={0.12}
                  className="mx-auto mt-10 max-w-md border-t border-gold-500/15 pt-8"
                >
                  <ShareActions
                    shareUrl={shareUrl}
                    title={share.title}
                    text={share.text}
                  />
                </Reveal>
              ) : null}
            </div>
          </Section>
        </main>

        <footer className="border-t border-gold-500/10 bg-emerald-950 py-8">
          <Container>
            <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-start">
              <p className="text-xs leading-relaxed text-mist-300/85">
                {demo.label}
                <span aria-hidden="true"> · </span>
                {demo.note}
              </p>

              {features.music ? <MusicControl track={audio} /> : null}
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}
