import { assertValidInvitation, type InvitationConfig } from "@/lib/invitation";

/**
 * Demo content for the foundation stage. All names, dates and venues are
 * fictional placeholders and must be replaced with client-approved content.
 */
const invitationConfig = {
  slug: "demo",
  locale: "ar",
  numerals: "latn",

  meta: {
    title: "ع و ر — دعوة زفاف",
    description:
      "نموذج تجريبي لدعوة زفاف رقمية. بكل الحب والفرح، ندعوكم لمشاركة أجمل لحظات العمر في حفل زفاف ع و ر.",
    themeColor: "#062a21",
  },

  opening: {
    label: "دعوة زفاف",
    phrase: "بكل الحب والفرح، يسعدنا أن تشاركونا بداية حكايتنا.",
    cta: "افتحوا دعوتنا",
    ctaOpening: "تُفتح الدعوة…",
    hint: "اضغطوا لفتح الدعوة",
  },

  demo: {
    label: "نموذج تجريبي",
    note: "أسماء وتفاصيل افتراضية لأغراض العرض",
  },

  couple: {
    groom: { firstName: "ع", fullName: "ع" },
    bride: { firstName: "ر", fullName: "ر" },
    order: "groom-first",
    monogram: "ع و ر",
  },

  event: {
    // ISO 8601 with an explicit UTC offset. The countdown compares this instant.
    startsAt: "2027-06-12T19:30:00+03:00",
    timeZone: "Asia/Damascus",
    timeZoneLabel: "بتوقيت دمشق",
    dateLabel: "السبت، ١٢ حزيران ٢٠٢٧",
    timeLabel: "٧:٣٠ مساءً",
  },

  venue: {
    // Fictional demo venue. The Google Maps destination is generated from lat/lng.
    name: "قاعة الياسمين",
    addressLines: ["شارع المزة، بناء ١٢", "دمشق"],
    city: "دمشق",
    lat: 33.5138,
    lng: 36.2765,
    notes: "يسرّنا حضوركم قبل الموعد بنصف ساعة.",
  },

  content: {
    introLine: "حين يلتقي القلبان، تبدأ أجمل الحكايات.",
    invitationText:
      "بكل ما يحمله القلب من فرح وامتنان، نتشرف بدعوتكم لمشاركة أجمل لحظات العمر، والاحتفال معنا ببداية حكايتنا. حضوركم زينة الفرح، واكتمال السعادة.",
    closingText: "حضوركم يكتمل به فرحنا، ودعاؤكم يضيء طريقنا.",
  },

  /**
   * Original SVG artwork created for this demo — not photographs of the couple.
   * Replace with client-approved images at the same 4:5 ratio (e.g. 1600×2000).
   */
  gallery: [
    {
      src: "/gallery/arch-jasmine.svg",
      alt: "رسم توضيحي لقوس زمردي بزخارف ياسمين ذهبية",
      width: 800,
      height: 1000,
    },
    {
      src: "/gallery/palm-courtyard.svg",
      alt: "رسم توضيحي لفناء بقوس ونخيل ذهبي على خلفية عاجية",
      width: 800,
      height: 1000,
    },
    {
      src: "/gallery/crescent-night.svg",
      alt: "رسم توضيحي لهلال ذهبي ونجوم على خلفية زمردية",
      width: 800,
      height: 1000,
    },
    {
      src: "/gallery/interlaced-rings.svg",
      alt: "رسم توضيحي لخاتمين متداخلين بزخارف نباتية ذهبية",
      width: 800,
      height: 1000,
    },
    {
      src: "/gallery/hanging-lantern.svg",
      alt: "رسم توضيحي لفانوس معلّق بزخارف ذهبية",
      width: 800,
      height: 1000,
    },
    {
      src: "/gallery/geometric-bloom.svg",
      alt: "رسم توضيحي لنجمة هندسية ثمانية بزخرفة زمردية وذهبية",
      width: 800,
      height: 1000,
    },
  ],

  /**
   * No audio ships with this demo. Add a properly licensed track to
   * `public/audio/`, then configure it here to enable the music control:
   *
   * audio: {
   *   src: "/audio/wedding-theme.mp3",
   *   title: "…",
   *   artist: "…",
   *   license: "…",
   * },
   */

  share: {
    title: "دعوة زفاف ع و ر",
    text: "يسعدنا أن تشاركونا فرحتنا.",
  },

  features: {
    openingGate: true,
    countdown: true,
    gallery: true,
    map: true,
    music: true,
    share: true,
  },
} satisfies InvitationConfig;

export const invitation = assertValidInvitation(invitationConfig);
