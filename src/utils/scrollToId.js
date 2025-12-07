// src/utils/scrollToId.js
export function scrollToId(id, headerHeight = 100, opts = { behavior: "smooth" }) {
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  // element position relative to document
  const rect = el.getBoundingClientRect();
  const y = window.pageYOffset + rect.top - (headerHeight || 0) - 8; // small breathing room

  window.scrollTo({ top: Math.max(0, Math.floor(y)), ...opts });
}
