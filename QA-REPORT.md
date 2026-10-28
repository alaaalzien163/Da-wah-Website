# QA Report — Premium Arabic Wedding Invitation

**Date:** 28 October 2026
**Scope:** static checks, functional behaviour, responsive layout, accessibility, performance/SEO, security/privacy
**Build under test:** production build, `next start` on `http://localhost:3001`
**Browser:** Chrome headless (CDP), plus pure-module tests under Node 22.19

## Verdict

**Pass — no critical issues found.** The invitation is safe to deploy from a QA
perspective once the public URL and the non-blocking metadata/header gaps below
are addressed. Three real defects found during testing were fixed and re-tested;
every final suite finished with zero failures.

## Commands

```bash
npm run lint       # ESLint — pass
npm run typecheck  # next typegen + tsc --noEmit — pass
npm run build      # production build — pass, all three routes static (/,
                   # /_not-found, /icon.svg)
```

`NEXT_PUBLIC_SITE_URL=https://invitation.example.com npm run build` was also run
to test configured sharing and canonical/Open Graph output. The repository was
then rebuilt without the variable so the checked-in state remains correct.

## Results summary

| Suite | Checks | Passed | Failed |
|---|---:|---:|---:|
| Core production (gate, content, countdown, maps, gallery, sharing state, a11y tree, metadata, runtime) | 77 | 77 | 0 |
| Responsive (320/375/430/768/1440) | 75 | 75 | 0 |
| Pure modules (countdown math, URL guard) | 16 | 16 | 0 |
| Interactive fixtures (4-digit countdown, music, sharing, reduced motion) | 31 | 31 | 0 |
| SEO/headers with public URL | 18 | 18 | 0 |
| SEO without public URL | 5 | 5 | 0 |
| Text contrast samples | 33 | 33 | 0 |

Additional targeted runs (corrupt audio, missing audio, expired date, keyboard
walk-through) also passed; they are described below.

## What was verified

### Static
- Lint, strict TypeScript, and production build all pass with no warnings.
- All routes are prerendered static; no server-only work at request time.
- No automated test framework is installed (`package.json` has no test script
  and no Playwright/Vitest), so behaviour was checked with temporary CDP
  harnesses and direct imports of the pure modules, without adding dependencies.

### Opening experience
- Cover renders with the configured label, monogram, names, phrase and CTA.
- Dialog semantics: `role="dialog"`, `aria-modal="true"`, labelled and described;
  the invitation below is `inert` plus `aria-hidden`; scroll is locked.
- Focus starts on the CTA, the focus trap holds, and the CTA exposes a busy,
  disabled state while opening.
- A second click during the transition is ignored; repeated interaction does not
  break the reveal. Focus moves to the invitation `h1` afterwards; scroll lock is
  released.
- CTA is 256×48 px at 320 px; opening screen has no horizontal overflow.

### Content and configuration
- Couple names, intro line, invitation body, closing line, date label, time,
  venue name, address and note all match `content/invitation.ts`.
- Closing year is derived from the configured event instant; one `h1` only.
- Venue maps destination is generated from configured coordinates:
  `https://www.google.com/maps/search/?api=1&query=33.5138%2C36.2765`.

### Countdown
- Values match an independently computed countdown, including the boundary cases
  (`1 ms → 1 second`, exact target → expired, past/NaN → expired).
- Values update on the next whole second; SSR placeholders are rendered instead
  of stale zeroes, with no hydration mismatch.
- Expired fixture renders “انتهى العد التنازلي” and the thank-you line, does not
  render a timer, and shows no stale digits.
- Far-future fixture (3,515 days) renders a four-digit day value that fits the
  320 px cell (32 px font, content 63 px inside a 69 px cell).

### Music
- Default build ships no track and honestly displays “الموسيقى غير متاحة في هذا
  النموذج”.
- With a valid 3-second WAV fixture: `preload="none"`, no audio request before a
  user gesture, nothing autoplays; a trusted click starts playback, the state and
  label change to pause, and the position advances. Pause stops playback and
  restores the idle label.
- Corrupt file: `MEDIA_ERR_SRC_NOT_SUPPORTED` is caught, the button becomes
  “إعادة المحاولة”, the polite status message explains the failure, retry does not
  duplicate the element or throw.
- Missing file (404): same graceful error state; the 404 is the only console
  entry, no exception, no crash.

### Sharing
- Without a public origin: local-only notice, no share/copy buttons, no
  `localhost` URL can be copied.
- With `NEXT_PUBLIC_SITE_URL`: clipboard writes exactly
  `https://invitation.example.com` and announces success; denied clipboard and
  failed legacy copy produce an actionable Arabic error.
- Native share (stubbed) receives the configured title, text and public URL;
  success is announced; cancelling with `AbortError` stays silent; failure falls
  back to a clear error message.

### Gallery and maps
- Six local illustrations load, 800×1000 intrinsic, lazy/async, 4:5 frames,
  distinct Arabic alt text, 3 columns ≥ 640 px and 2 below.
- No observed gallery layout shift (CLS ≈ 0.0004 in the core run); no broken
  images.
- Map link opens in a new tab with `rel="noreferrer"`, exposes a description that
  marks the destination as fictional, and is 224×48 px.

### Responsive
At 320, 375, 430, 768 and 1440 px:
- no document/body horizontal overflow, no element crossing the viewport edge;
- no overlapping main sections or negative section gaps;
- hero, date, time and countdown values fit their boxes;
- gallery loads inside its grid with the correct column count;
- all visible interactive targets meet the checks used here (≥40 px height in
  practice; the smallest is the 40 px music control, above the WCAG 2.5.8 24 px
  minimum but below the 44 px platform guideline);
- document direction resolves to RTL; Arabic wrapping remains intact.

### Accessibility
- One `h1`, ordered headings, `main` and `contentinfo` landmarks, skip link that
  moves focus to `#main`.
- Accessible names verified through the browser accessibility tree, including
  the opening dialog (“أحمد و سارة”), map action and all six images.
- Keyboard focus is always visible (2 px champagne/gold ring, ≥3:1 on both
  surfaces); no keyboard traps after the cover is dismissed.
- Contrast: all 33 sampled text/background pairs pass WCAG AA; the lowest ratio is
  5.79:1 (gold-700 on ivory-50). Body secondary text is 7.86:1 and ink-600 is
  6.7:1.
- Reduced motion: the cover exits in ~530 ms instead of the full sequence,
  transitions collapse to ~0.01 ms, and reveals/content are immediately visible.

### Performance and SEO
Local production snapshot at 1440 px, cache disabled:

| Metric | Value |
|---|---|
| FCP | 256 ms |
| LCP | 256 ms |
| Load | 307 ms |
| CLS | 0.0016 while scrolling (0.0004 without scroll) |
| Long tasks | one, 76 ms |
| JS transfer | 185,473 B |
| CSS transfer | 93,460 B |
| Fonts transfer | 310,192 B (self-hosted WOFF2) |
| Images transfer | 7,043 B (SVG artwork) |
| Runtime hosts | localhost only — no third-party scripts |

- Title, description, `og:title`, `og:description`, `og:type`, `og:locale`,
  `twitter:card`, theme colour and viewport are present.
- With a public origin, canonical and `og:url` point at it and sharing is enabled;
  without it, both are deliberately omitted and sharing stays local-only.
- `lang="ar"`/`dir="rtl"`, no robots block (`index, follow`).
- No Open Graph image and no `twitter:image`.
- All assets served from the app origin; static chunks use immutable caching;
  `x-powered-by` is disabled.

### Security and privacy
- No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, secrets, API
  keys, passwords or private-key material in source.
- No forms, `localStorage`, `sessionStorage` or cookies are used.
- Only external runtime link is Google Maps, opened with `rel="noreferrer"`.
- Content is explicitly labelled as a fictional demo; no contact details or other
  personal data are present.
- Response headers currently have no CSP, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` or frame restrictions.

## Issues fixed

1. **Four-digit countdown overflow at 320 px** — `components/invitation/Countdown.tsx`.
   The day value now uses `text-[2rem]` when it reaches four digits (other units
   keep `text-[2.25rem]`, all units use `sm:text-[2.75rem]`). Verified with a
   3,515-day fixture: 63 px content inside a 69 px cell.
2. **Opening dialog announced as one word** — `components/invitation/OpeningScreen.tsx`.
   The decorative connector now has real word spaces and `mx-1`; the dialog name
   is exposed as “أحمد و سارة”, not “أحمدوسارة”.
3. **Duplicated connector in the hero’s DOM text** — `app/page.tsx` and
   `app/globals.css`. The visible “و” is now generated by `.hero-connector::before`
   on an empty decorative span, while the single screen-reader connector remains.
   Copied/indexed text is exactly “أحمد و سارة” once.

No pre-existing lint, type or build errors were found; the only failures in the
first runs were the two real accessibility/text defects above, the edge case, and
two over-strict harness assertions that were corrected after confirming the
content itself was right.

## Issues remaining (non-blocking)

| Severity | Issue | Recommendation |
|---|---|---|
| Medium | No security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame protection) | Add in `next.config.ts` or at the CDN/host before launch |
| Low | No Open Graph/Twitter image | Add a 1200×630 asset and metadata so shared links have a preview |
| Low | `og:locale` is `ar_AR` | Use a valid `language_TERRITORY` value such as `ar_SY` once the market is known |
| Low | Demo invitation is indexable (`index, follow`) | Add `noindex` until it is a real, public invitation, or keep the URL unguessable |
| Low | No `robots.txt` or sitemap | Optional for a single-page invitation; add if search discovery matters |
| Info | Self-hosted fonts transfer ~310 KB | Acceptable for the design; subset/preload further only if real-network metrics demand it |
| Info | Music control is 40 px tall at 320 px | Above WCAG’s 24 px minimum; raise to 44 px if strict platform parity is required |
| Info | Reduced-motion dev warning from Motion | Development-only message; production console was clean |

## Could not be executed / limitations

- No real screen reader (NVDA, VoiceOver) was available; accessibility was checked
  through the Chrome accessibility tree, keyboard walk-through and computed
  contrast rather than announced speech.
- Native share sheets were simulated with `navigator.share` stubs. Real iOS
  Safari/Android behaviour and platform-specific clipboard rules were not tested.
- Audio autoplay policies were tested in Chrome headless only, with a generated
  WAV, a corrupt file and a missing file. No licensed production track exists.
- Lighthouse/axe are not installed; audits used CDP metrics, computed styles and
  direct module tests.
- Metrics come from a local production server, not a deployed CDN; real-world
  timings will differ.
- Visual checks were screenshot-based at 320, 768 and 1440 px; no pixel-diff
  regression suite exists.

## Fixtures and cleanup

- `content/invitation.ts` was temporarily edited for far-future, expired, valid,
  corrupt and missing-audio cases. It was restored byte-for-byte (SHA-256
  `A13A5401A6C14DA4ACF5435D0E1163010A7D4281D1EF41BED73AAB9B497514AA`).
- Temporary audio files were deleted; `public/audio/` contains only its README.
- No `.env.local` exists (only `.env.example`); the final build uses no public
  origin, so sharing remains safely disabled and canonical/`og:url` are omitted.
- Temporary harnesses and screenshots live outside the repository under the
  system temp directory; no test dependency was added.

## Deployment note

Do not deploy with any critical issue open — none were found. Before the public
launch, set the final HTTPS `NEXT_PUBLIC_SITE_URL`, rebuild, review the metadata
gaps above, and verify the host applies the recommended security headers.
