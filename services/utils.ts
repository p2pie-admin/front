const isServerSide = typeof window === "undefined";
const useInternal = String(process.env.USE_INTERNAL).toLowerCase() === "true";

export const base = process.env.NEXT_PUBLIC_BASE;
export const index =
  process.env.NEXT_PUBLIC_INDEX == "0" ? "" : process.env.NEXT_PUBLIC_INDEX;

export const converterLinkPROD = `https://converter${index}.${base}`;
export const serverLinkPROD = `https://server${index}.${base}`;
export const cmsLinkPROD = `https://cms${index}.${base}`;

export const converterLinkDEV = `https://converter${index}.${base}`;
export const serverLinkDEV = `https://server${index}.${base}`;
export const cmsLinkDEV = `https://cms${index}.${base}`; //`http://localhost:1337`;

export const internalConverterLink = process.env.INTERNAL_CONVERTER_URL;
export const internalServerLink = process.env.INTERNAL_SERVER_URL;
export const internalCmsLink = process.env.INTERNAL_CMS_URL;

export const minRatesMap = +(process.env.NEXT_PUBLIC_MIN_RATES_MAP || 2);

export const resolveInternalUrl = (external: string, internal?: string) =>
  isServerSide && useInternal && internal ? internal : external;

export const locale = "ru" as "ru" | "en";

//"http://127.0.0.1:5000"

export const mylog = (
  message: any,
  color:
    | "error"
    | "success"
    | "warning"
    | "important"
    | "info"
    | "hidden" = "info",
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
