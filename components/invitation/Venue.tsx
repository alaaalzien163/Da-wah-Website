import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { DemoIdentity, InvitationConfig } from "@/lib/invitation";

export interface VenueProps {
  venue: InvitationConfig["venue"];
  mapsUrl: string;
  demo: DemoIdentity;
  showMap: boolean;
}

/**
 * Venue folio: name, address and the generated Google Maps destination.
 * Centred rather than split across the full width, so the details section keeps
 * one deliberate reading axis at every breakpoint. The destination is
 * explicitly labelled as fictional demo content.
 */
export function Venue({ venue, mapsUrl, demo, showMap }: VenueProps) {
  return (
    <section
      id="venue"
      aria-labelledby="venue-name"
      className="mt-12 scroll-mt-6 text-center"
    >
      <p className="text-label text-gold-300">المكان</p>

      <h3
        id="venue-name"
        className="mt-3 font-display text-heading text-balance text-ivory-50"
      >
        {venue.name}
      </h3>

      <address className="mt-3 text-lead not-italic text-ivory-100/85">
        {venue.addressLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </address>

      {venue.notes ? (
        <p className="mx-auto mt-4 max-w-md text-pretty text-small text-mist-300/90">
          {venue.notes}
        </p>
      ) : null}

      {showMap ? (
        <div className="mt-7 flex flex-col items-center gap-3">
          <Button
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            size="lg"
            aria-describedby="venue-map-note"
            className="w-full max-w-xs sm:w-auto sm:min-w-56"
          >
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.5} />
            عرض الموقع
            <span className="sr-only"> (يفتح في نافذة جديدة)</span>
          </Button>

          <p
            id="venue-map-note"
            className="max-w-sm text-pretty text-xs leading-relaxed text-mist-300/85"
          >
            <span className="text-gold-300">{demo.label}</span>
            <span aria-hidden="true" className="mx-1.5 text-gold-500/50">
              ·
            </span>
            وجهة خرائط افتراضية لأغراض العرض
          </p>
        </div>
      ) : null}
    </section>
  );
}
