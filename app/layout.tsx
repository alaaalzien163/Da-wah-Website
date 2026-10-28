import type { Metadata, Viewport } from "next";
import { Amiri, Aref_Ruqaa, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/providers/MotionProvider";
import { invitation } from "@/content/invitation";
import { getConfiguredSiteUrl } from "@/lib/site";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

// Canonical/OG URLs are only emitted for a verified public HTTPS origin. Without
// `NEXT_PUBLIC_SITE_URL` the page stays un-canonicalised instead of advertising
// a localhost address it does not own.
const siteUrl = getConfiguredSiteUrl();
const ogImage = invitation.meta.ogImage;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: invitation.meta.title,
    template: `%s | ${invitation.meta.title}`,
  },
  description: invitation.meta.description,
  applicationName: invitation.meta.title,
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "ar_AR",
    ...(siteUrl ? { url: "/" } : {}),
    siteName: invitation.meta.title,
    title: invitation.meta.title,
    description: invitation.meta.description,
    images: ogImage
      ? [{ url: ogImage, width: 1200, height: 630, alt: invitation.meta.title }]
      : undefined,
  },
  twitter: {
    card: ogImage ? "summary_large_image" : "summary",
    title: invitation.meta.title,
    description: invitation.meta.description,
    images: ogImage ? [ogImage] : undefined,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: invitation.meta.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${arefRuqaa.variable} ${cormorant.variable}`}
    >
      <body className="bg-emerald-950 font-body text-body text-ivory-100 antialiased">
        <a href="#main" id="skip-link" className="skip-link">
          تجاوز إلى المحتوى
        </a>
        <noscript>
          {/* Without JS the gate cannot open, so the invitation is shown directly. */}
          <style>{`.opening-gate{display:none!important}`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
