# Background music

No audio file ships with this demo, so the music control shows an unavailable
state by default.

To enable it, place a **properly licensed** track in this folder and configure
it in `content/invitation.ts`:

```ts
audio: {
  src: "/audio/wedding-theme.mp3",
  title: "اسم المقطوعة",
  artist: "اسم الفنان",
  license: "نوع الترخيص أو رابط إثبات الحقوق",
},
```

Rules:

- Do not commit copyrighted music without written permission.
- Keep the license proof in `audio.license` (or link to the client's receipt).
- Autoplay with sound is intentionally not supported; the visitor must press
  the music control.
- Supported browser formats vary; MP3 or AAC (`.m4a`) are the safest choices.
- Keep files reasonably small (ideally under 3–4 MB) and use a loop-friendly
  edit.
