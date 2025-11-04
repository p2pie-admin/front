export const base = process.env.NEXT_PUBLIC_BASE;

export const converterLinkPROD = `https://converter.${base}`;
export const serverLinkPROD = `https://server.${base}`;
export const cmsLinkPROD = `https://cms.${base}`;

export const converterLinkDEV = `https://converter.${base}`;
export const serverLinkDEV = `https://server.${base}`;
export const cmsLinkDEV = `https://cms.${base}`;

const resolvedLocale =
  process.env.NEXT_PUBLIC_SITE_LANG?.toLowerCase() === "ru" ? "ru" : "en";

export const locale = resolvedLocale as "en" | "ru";

//"http://127.0.0.1:5000"

export const mylog = (
  message: any,
  color:
    | "error"
    | "success"
    | "warning"
    | "important"
    | "info"
    | "hidden" = "info"
) => {
  const colors = {
    error: "📕 \u001b[1;31m",
    success: "📗 \u001b[1;32m",
    warning: "📙 \u001b[1;33m",
    info: "📘 \u001b[1;34m",
    hidden: "📓 \u001b[1;30m",
    important: "📔 \u001b[38;5;226m",
  };
  console.log(`${colors[color]} ${message}`);
};
