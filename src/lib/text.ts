/* App UI stays icon-only: strip emoji from shared copy (notifications are also used on the landing page). */
export const stripEmoji = (s: string) =>
  s
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
