import { useEffect } from "react";

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: any[]) => void;
  }
}

const METRICA_ID = 105843144;

// Page type from the first path segment; direction pages live at /<slug>.
const pageType = (path: string): string => {
  const first = path.split("?")[0].split("#")[0].split("/").filter(Boolean)[0];
  if (!first) return "home";
  if (
    ["exchangers", "articles", "buy", "sell", "p2p", "map", "about", "faq", "contacts", "partnership", "for-exchangers", "auth"].includes(first)
  )
    return first;
  return "direction";
};

const clean = (text: string | null | undefined, max = 60) =>
  (text || "").replace(/\s+/g, " ").trim().slice(0, max);

// Where on the page the element lives: nearest landmark / section id, else the tag.
const sectionOf = (el: Element): string => {
  const tracked = el.closest("[data-track-section]");
  if (tracked) return tracked.getAttribute("data-track-section") || "";
  const landmark = el.closest("header, nav, footer, main, aside, details, table, [role=dialog]");
  return landmark ? landmark.tagName.toLowerCase() : "page";
};

// Global delegated click recorder. One listener, no per-component wiring: every link, button and
// <summary> click becomes a Yandex Metrica goal `click` plus visit params, nested as
// click -> <kind> -> <page type> -> <label>, so the "Параметры визитов" report shows a tree.
// Elements can refine the label with data-track="<name>" and data-track-label="<value>".
const ClickTracker = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      try {
        const target = event.target as Element | null;
        const el = target?.closest?.("a, button, summary, [role=button], [data-track]");
        if (!el || !window.ym) return;

        const path = window.location.pathname;
        const page = pageType(path);
        const anchor = el.closest("a") as HTMLAnchorElement | null;
        const href = anchor?.getAttribute("href") || "";
        const explicit = el.getAttribute("data-track");

        let kind = "button";
        let label = clean(el.getAttribute("aria-label") || el.textContent);
        if (anchor) {
          let host = "";
          try {
            host = new URL(anchor.href, window.location.href).hostname;
          } catch {}
          const external = host && host !== window.location.hostname;
          if (host === "t.me" || host === "telegram.me") kind = "telegram";
          else if (external) kind = "outbound";
          else kind = "internal";
          label = kind === "internal" ? clean(href, 80) : host;
          if (kind === "outbound" || kind === "telegram") {
            const text = clean(anchor.getAttribute("aria-label") || anchor.textContent, 40);
            label = `${host} | ${text}`;
          }
        } else if (el.tagName === "SUMMARY") kind = "toggle";
        if (explicit) {
          kind = explicit;
          label = clean(el.getAttribute("data-track-label")) || label;
        }
        if (!label) label = "(no text)";

        const section = sectionOf(el);
        const params = { click: { [kind]: { [page]: { [`${section}: ${label}`]: 1 } } } };
        window.ym(METRICA_ID, "reachGoal", "click", {
          kind,
          page,
          section,
          label,
          path,
        });
        window.ym(METRICA_ID, "params", params);
      } catch {
        // Tracking must never break the page.
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
};

export default ClickTracker;
