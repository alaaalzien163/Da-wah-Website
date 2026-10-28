const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

/**
 * Normalises a candidate share URL and rejects anything that is not a public
 * HTTPS origin. This is what keeps local development from sharing a
 * `localhost` link by mistake.
 */
export function toPublicUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  const hostname = url.hostname.toLowerCase();
  if (
    LOCAL_HOSTNAMES.has(hostname) ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".localhost")
  ) {
    return null;
  }

  url.search = "";
  url.hash = "";

  return url.href.replace(/\/$/, "");
}

/** Build-time public origin, e.g. https://invite.example.com. */
export function getConfiguredSiteUrl(): string | null {
  return toPublicUrl(process.env.NEXT_PUBLIC_SITE_URL);
}
