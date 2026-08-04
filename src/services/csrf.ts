const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

function readCsrfCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let bootstrap: Promise<void> | null = null;

// The auth cookie is httpOnly (JS can't read it), so the backend can't rely
// on it alone for CSRF protection — a separate, JS-readable csrftoken cookie
// is fetched once per session and echoed back as a header on every mutating
// request. Safe to call repeatedly; only fetches when the cookie is missing.
export async function ensureCsrfCookie(): Promise<void> {
  if (readCsrfCookie()) return;
  if (!bootstrap) {
    bootstrap = fetch(`${API_BASE_URL}/auth/csrf/`, { credentials: "include" })
      .then(() => undefined)
      .catch(() => undefined);
  }
  await bootstrap;
}

export function csrfHeader(): Record<string, string> {
  const token = readCsrfCookie();
  return token ? { "X-CSRFToken": token } : {};
}
