// Checks that the input is a full http(s) link. The backend extracts the domain.
export function isValidLink(input: string): boolean {
  try {
    const u = new URL(input.trim());
    return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}