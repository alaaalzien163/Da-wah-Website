# Da'wah — Premium Arabic Wedding Invitation

A single, config-driven Arabic wedding invitation, built as a **customer-facing
demonstration**. All names, dates, venues and gallery pieces are fictional and
clearly labelled as demo content.

The invitation includes the opening curtain, live countdown, background-music
control, Google Maps destination, gallery, and sharing. It is intentionally a
focused prototype, not a multi-tenant or content-managed platform.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Animation | Motion (`reducedMotion="user"`) |
| Icons | Lucide React |
| Fonts | `next/font/google` — Amiri, Aref Ruqaa, Cormorant Garamond (self-hosted at build) |
| Deployment | Vercel, zero custom server configuration |

## Requirements

- Node.js **20.9 or newer** (Next.js 16 requirement)
- npm 10 or newer (the repository includes `package-lock.json`)
- No database, API keys, or private services are required

## Installation

```bash
git clone <your-repository-url>
cd "Da'wah Website"
npm ci            # reproducible install from package-lock.json
```

If you are starting from a folder rather than a clone:

```bash
npm install
```

## Local development

```bash
npm run dev        # http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # generate route types + tsc --noEmit
```

## Production build

```bash
npm run build      # Next.js production build
npm run start      # serve the built app, http://localhost:3000
```

The home page, not-found page, and favicon are prerendered static routes. The
build compiles the content contract first, so invalid invitation data fails
loudly instead of shipping a broken page.

## Invitation configuration

Everything customer-specific lives in `content/invitation.ts`; components never
contain names, dates, venues, or copy. Edit that one file and rebuild.

Key blocks:

| Block | Purpose |
|---|---|
| `meta` | Page title, description, optional OG image, theme colour |
| `opening` | Cover label, phrase, CTA and hint |
| `demo` | Demo badge and disclosure text used across the page |
| `couple` | Names, display order, monogram |
| `event` | ISO datetime, display timezone, date/time labels |
| `venue` | Name, address, city, coordinates, notes |
| `content` | Intro, invitation body, closing copy |
| `gallery` | Image path, alt text, dimensions; optional caption |
| `audio` | Optional licensed track and proof of rights |
| `share` | Native-share title and text |
| `features` | Toggle the gate, countdown, gallery, map, music and sharing |

`event.startsAt` must be an ISO 8601 datetime **with an explicit UTC offset**,
for example `2027-06-12T19:30:00+03:00`. Update `dateLabel`, `timeLabel`,
`timeZone` and `timeZoneLabel` at the same time. The countdown compares the
absolute instant, so it remains correct across time zones. If the date passes,
the countdown is replaced by an ended state.

The build-time guard in `lib/invitation.ts` validates required copy, coordinates,
gallery dimensions, audio licensing data, and the date format. Changing content
requires a new build and deployment.

## Environment variables

The prototype needs **no private environment variables**. One optional public
variable controls the canonical URL, social metadata and sharing:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Optional; recommended for production | Final public HTTPS origin, e.g. `https://invitation.example.com`. Drives canonical, `og:url` and share links. |

Copy the safe example:

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SITE_URL=https://invitation.example.com
```

Important:

- This value is **public** and is inlined into the browser bundle at build time.
  Never put a secret, API key, token or password in a `NEXT_PUBLIC_*` variable.
- Until a public HTTPS origin is set — or if it points at `localhost`, a loopback
  address, `.local`, or plain `http://` — the page omits canonical/`og:url` and
  sharing stays disabled. A development URL is never put on the clipboard.
- Because the value is build-time, change it in Vercel and **redeploy**; editing
  it at runtime has no effect.
- `.env`, `.env*.local`, and `.vercel` are ignored by Git. `.env.example`
  contains no credentials and is safe to commit.

## Assets

All runtime assets are local; the page makes no third-party requests at runtime.

### Gallery

Six original SVG illustrations live in `public/gallery/`. They are not
photographs of the couple. Replace them with client-approved, licensed images at
the same **4:5 ratio** (for example 1600×2000) and update `src`, `width`,
`height`, `alt` and optional `caption` in `content/invitation.ts`. Keep alt text
descriptive and specific for each image.

### Audio

No audio file ships with the demo, so the music control shows an unavailable
state. To enable it:

1. Put a properly licensed file under `public/audio/` (MP3 or M4A recommended,
   ideally under 3–4 MB and loop-friendly).
2. Add the optional `audio` block in `content/invitation.ts` with `src`, `title`,
   `artist` and `license`.
3. Keep written proof of usage rights; the `license` field is required by the
   content contract.

Sound never autoplays. Playback errors are handled inline. See
`public/audio/README.md` for details.

### Fonts and icons

- Fonts are downloaded and self-hosted at build time by `next/font`. They are
  licensed under the SIL Open Font License.
- Icons come from Lucide React (ISC licence).
- The favicon is `app/icon.svg` and is served automatically at `/icon.svg`.
- No external image, font, audio or script hosts are required.

## Project structure

```
app/                    layout, page, global tokens, favicon
components/invitation/  OpeningScreen, Countdown, MusicControl, Venue,
                        Gallery, ShareActions
components/ui/          Container, Section, Eyebrow, Divider, Monogram,
                        Button, Reveal
components/providers/   MotionProvider (reduced-motion policy)
content/invitation.ts   customer data (the only per-client file)
lib/invitation.ts       content contract + build-time validation
lib/countdown.ts        pure countdown math + numeral formatting
lib/maps.ts             Google Maps URL builder
lib/site.ts             public-URL guard for sharing
public/gallery/         original SVG demo artwork (4:5)
public/audio/           licensed-track drop point (no track ships)
```

Map destinations are built from `venue.lat` / `venue.lng`; share URLs come from
`NEXT_PUBLIC_SITE_URL`. The demo coordinates and venue are fictional and labelled
as such next to the map action.

## Deploying to Vercel

No `vercel.json`, custom server, rewrite, or extra infrastructure is needed.
Vercel detects Next.js and uses the standard build output.

1. **Put the project on GitHub.** From the project root:

   ```bash
   git init
   git add .
   git commit -m "Initial invitation prototype"
   git branch -M main
   git remote add origin https://github.com/<account>/<repository>.git
   git push -u origin main
   ```

   Review `git status` before committing. `node_modules/`, `.next/`, build
   output, `.vercel/`, and local env files are already ignored.

2. **Import the repository** at [vercel.com/new](https://vercel.com/new).
   Choose the GitHub repository and keep the detected **Next.js** framework
   preset. Root directory: repository root. Build command: `npm run build`
   (default). Output directory: leave empty (Next.js default).

3. **Add the public URL variable** under *Settings → Environment Variables* for
   the **Production** environment once you know the final domain:

   ```text
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```

   Use the custom domain instead if one is configured. Do not use `localhost` or
   plain `http://`.

4. **Deploy.** The first deployment can run without the variable; the invitation
   works, but canonical/`og:url` are omitted and sharing is hidden. After adding
   the variable, trigger **Redeploy** so the build inlines the final URL.

5. **Optional custom domain.** Add it under *Settings → Domains*, wait for DNS
   and TLS, then update `NEXT_PUBLIC_SITE_URL` to the custom HTTPS domain and
   redeploy.

6. **Verify the public URL**: open `/`, confirm the cover opens, the countdown is
   live, the map opens Google Maps, gallery images load, and sharing/copy use the
   production URL (not a preview or localhost address).

### Sharing the public URL

After Vercel finishes, the deployment URL appears on the project dashboard and
in the deployment detail page (for example
`https://dawah-invitation.vercel.app`). If a custom domain is attached, share
that domain. Send the link only after the production redeploy with
`NEXT_PUBLIC_SITE_URL` set, so previews of the link show the correct metadata and
sharing copies the correct address.

## GitHub readiness

- Secrets: no API keys, tokens, passwords or private customer data are present.
- Environment: `.env`, `.env*.local`, and `.vercel` are ignored; only the safe
  `.env.example` is tracked.
- Build artifacts: `.next/`, `out/`, `build/`, `dist/` and `*.tsbuildinfo` are
  ignored. `node_modules/` is ignored.
- Dependencies: `package-lock.json` is committed for reproducible installs.
- QA evidence: see [`QA-REPORT.md`](./QA-REPORT.md).

This workspace does not push to a remote; publishing is the repository owner's
decision.

## Known limitations

- Fictional demo content and placeholder coordinates; replace before a real event.
- No audio track ships (licensing and file size are intentionally left to the
  client).
- No Open Graph/Twitter image is configured; shared links show title and
  description only.
- No CSP or other security headers are defined in `next.config.ts`; add them at
  the host/CDN layer for a public production launch.
- The demo is indexable (`index, follow`); add `noindex` if it should not appear
  in search results.
- No automated test suite (no Vitest/Playwright) and no CMS/admin interface.
- Single invitation per deployment; a new client is a new content file/build.
- Sharing requires the public HTTPS origin described above.
- Local font files are self-hosted at build time, so the build needs network
  access to Google Fonts.

## QA

A full QA pass — static checks, functional behaviour, responsive widths,
accessibility, performance/SEO, security/privacy, and remaining issues — is
documented in [`QA-REPORT.md`](./QA-REPORT.md).
