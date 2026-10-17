// Short links open through the backend, which does the redirect.
const SHORT_BASE = (import.meta.env.VITE_SHORT_BASE_URL || "http://localhost:8081").replace(/\/$/, "");

// Works whether the backend returns a full URL or only the short code.
export function toShortLink(shortUrl: string): string {
  if (/^https?:\/\//i.test(shortUrl)) return shortUrl;
  return `${SHORT_BASE}/${shortUrl.replace(/^\//, "")}`;
}

export function formatDate(value?: string | null): string {
  if (!value) return "Never";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}