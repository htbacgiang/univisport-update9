export const PUBLIC_CACHE_CONTROL =
  "public, s-maxage=300, stale-while-revalidate=600";

/**
 * Set Cache-Control header on public SSR responses so that Cloudflare Edge
 * and reverse proxies cache the HTML for 300 seconds (ISR behavior) and serve
 * stale content for up to 600s during background revalidation.
 *
 * @param {import('http').ServerResponse | { setHeader: Function } | undefined} res
 */
export function setPublicCacheHeaders(res) {
  if (res && typeof res.setHeader === "function") {
    res.setHeader("Cache-Control", PUBLIC_CACHE_CONTROL);
  }
}

