/**
 * Customer content contract.
 *
 * Components never contain names, dates, venues or copy. A new client is a
 * new file in `content/` that satisfies `InvitationConfig` — presentation
 * stays untouched.
 */

export type Locale = "ar";
export type NumeralStyle = "latn" | "arab";
export type CoupleOrder = "groom-first" | "bride-first";

export interface CouplePerson {
  /** Short name shown in the hero, e.g. "عمر". */
  firstName: string;
  /** Full name used in metadata and formal copy. */
  fullName: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface AudioTrack {
  /** Local public path, e.g. "/audio/wedding-theme.mp3". */
  src: string;
  title: string;
  artist?: string;
  /** Proof of usage rights; required for every client track. */
  license: string;
}

export interface FeatureFlags {
  openingGate: boolean;
  countdown: boolean;
  gallery: boolean;
  map: boolean;
  music: boolean;
  share: boolean;
}

/** Copy for the opening screen. Presentation stays out of the components. */
export interface OpeningCopy {
  label: string;
  phrase: string;
  cta: string;
  /** Shown immediately after activation, before the curtain opens. */
  ctaOpening: string;
  hint: string;
}

/** Demo disclosure shown on the cover, in the details and in the footer. */
export interface DemoIdentity {
  label: string;
  note: string;
}

export interface InvitationConfig {
  slug: string;
  locale: Locale;
  numerals: NumeralStyle;

  meta: {
    title: string;
    description: string;
    /** Absolute URL, resolved from NEXT_PUBLIC_SITE_URL at build time. */
    ogImage?: string;
    themeColor: string;
  };

  opening: OpeningCopy;

  demo: DemoIdentity;

  couple: {
    groom: CouplePerson;
    bride: CouplePerson;
    order: CoupleOrder;
    /** Decorative mark, e.g. "ع و ل". */
    monogram: string;
  };

  event: {
    /**
     * ISO 8601 datetime with an explicit offset, e.g.
     * "2027-06-12T19:30:00+03:00". The countdown compares this instant.
     */
    startsAt: string;
    /** IANA zone used for display, e.g. "Asia/Damascus". */
    timeZone: string;
    /** Human-readable zone shown under the countdown, e.g. "بتوقيت دمشق". */
    timeZoneLabel: string;
    /** Client-approved Arabic date text. */
    dateLabel: string;
    /** Client-approved Arabic time text. */
    timeLabel: string;
    hijriLabel?: string;
  };

  venue: {
    name: string;
    addressLines: string[];
    city: string;
    lat: number;
    lng: number;
    notes?: string;
  };

  content: {
    /** Only client-supplied, verified text. Never generated. */
    verse?: { text: string; reference: string };
    /** One romantic line under the couple's names. */
    introLine: string;
    invitationText: string;
    closingText: string;
  };

  gallery: GalleryImage[];
  audio?: AudioTrack;
  share: { title: string; text: string };
  features: FeatureFlags;
}

const ISO_WITH_OFFSET =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

/**
 * Build-time guard for customer content. Throws with every problem at once so
 * a new client file fails loudly instead of rendering a broken invitation.
 */
export function assertValidInvitation(config: InvitationConfig): InvitationConfig {
  const problems: string[] = [];

  const required = (value: string, field: string) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      problems.push(`${field} is required`);
    }
  };

  required(config.slug, "slug");
  required(config.meta.title, "meta.title");
  required(config.meta.description, "meta.description");
  required(config.meta.themeColor, "meta.themeColor");

  required(config.opening.label, "opening.label");
  required(config.opening.phrase, "opening.phrase");
  required(config.opening.cta, "opening.cta");
  required(config.opening.ctaOpening, "opening.ctaOpening");
  required(config.opening.hint, "opening.hint");

  required(config.demo.label, "demo.label");
  required(config.demo.note, "demo.note");

  required(config.couple.groom.firstName, "couple.groom.firstName");
  required(config.couple.groom.fullName, "couple.groom.fullName");
  required(config.couple.bride.firstName, "couple.bride.firstName");
  required(config.couple.bride.fullName, "couple.bride.fullName");
  required(config.couple.monogram, "couple.monogram");

  if (!ISO_WITH_OFFSET.test(config.event.startsAt)) {
    problems.push("event.startsAt must be an ISO 8601 datetime with an explicit offset");
  } else if (Number.isNaN(Date.parse(config.event.startsAt))) {
    problems.push("event.startsAt is not a valid date");
  }
  required(config.event.timeZone, "event.timeZone");
  required(config.event.timeZoneLabel, "event.timeZoneLabel");
  required(config.event.dateLabel, "event.dateLabel");
  required(config.event.timeLabel, "event.timeLabel");

  required(config.venue.name, "venue.name");
  required(config.venue.city, "venue.city");
  if (!Number.isFinite(config.venue.lat) || Math.abs(config.venue.lat) > 90) {
    problems.push("venue.lat must be between -90 and 90");
  }
  if (!Number.isFinite(config.venue.lng) || Math.abs(config.venue.lng) > 180) {
    problems.push("venue.lng must be between -180 and 180");
  }

  required(config.content.introLine, "content.introLine");
  required(config.content.invitationText, "content.invitationText");
  required(config.content.closingText, "content.closingText");

  if (config.features.gallery && config.gallery.length === 0) {
    problems.push("gallery needs at least one image when features.gallery is enabled");
  }

  config.gallery.forEach((image, index) => {
    required(image.src, `gallery[${index}].src`);
    required(image.alt, `gallery[${index}].alt`);
    if (image.width <= 0 || image.height <= 0) {
      problems.push(`gallery[${index}] needs positive width and height`);
    }
    if (image.caption !== undefined) {
      required(image.caption, `gallery[${index}].caption`);
    }
  });

  if (config.audio) {
    required(config.audio.src, "audio.src");
    required(config.audio.title, "audio.title");
    required(config.audio.license, "audio.license");
    if (!/^(?:\/|https:\/\/)/.test(config.audio.src)) {
      problems.push("audio.src must be a local public path or an https URL");
    }
  }

  required(config.share.title, "share.title");
  required(config.share.text, "share.text");

  for (const [flag, enabled] of Object.entries(config.features)) {
    if (typeof enabled !== "boolean") {
      problems.push(`features.${flag} must be a boolean`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid invitation configuration:\n- ${problems.join("\n- ")}`);
  }

  return config;
}
