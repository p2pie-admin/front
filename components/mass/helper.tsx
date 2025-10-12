import { IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";

export const generateMassSeo = ({
  locale,
  title,
  description,
  slug,
  isSell,
}: {
  locale: "en" | "ru";
  title: string;
  description: string;
  slug: string;
  isSell: boolean;
}) => {
  return {
    title,
    description,
    canonical: `https://${process.env.NEXT_PUBLIC_NAME}.com/${
      isSell ? "sell" : "buy"
    }/${slug}`,
    locale,
  };
};

export const replaceCodesWithPms = (rates: IMassRate[], pms: IPm[]) => {
  return rates.map((r) => ({
    ...r,
    codes: r.codes.map((code) =>
      pms.find((pm) => pm.code.toUpperCase() == code)
    ),
  }));
};

export function getPmsByCodes(
  massRates: IMassRate[],
  pms: IPm[]
): Record<string, IPm> {
  // ✅ Collect all unique codes from massRates into a Set (fast lookups)
  const codes = new Set<string>();
  for (const rate of massRates) {
    for (const code of rate.codes) {
      codes.add(code.toUpperCase());
    }
  }

  // ✅ Filter and reduce pms into object keyed by code
  return pms.reduce((acc, pm) => {
    if (codes.has(pm.code)) {
      acc[pm.code] = pm; // duplicate code field preserved inside pm
    }
    return acc;
  }, {} as Record<string, IPm>);
}

export function pickKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  if (!obj) return {} as Pick<T, K>;
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}
