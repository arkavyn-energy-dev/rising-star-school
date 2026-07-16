// Lightweight client-side "proof of submission" store. Since applicants
// don't create an account, this gives them something checkable on their own
// device/browser (reference ID + date) without needing a login — a backup
// to the email/SMS/WhatsApp confirmation sent server-side.
const STORAGE_KEY = "rsps_submissions";

export function saveLocalProof(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.unshift({ ...entry, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch {
    // localStorage can fail in private/incognito mode with strict settings —
    // this is a nice-to-have, so we silently ignore failures.
  }
}

export function getLocalProofs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
