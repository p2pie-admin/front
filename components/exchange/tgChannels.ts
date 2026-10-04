// City slug (ICity.en_name, lower case) -> public Telegram channel where @p2pie_city_bot posts daily rates.
// Only channels that exist and where the bot is admin (checked 2026-10-04). Regenerate when channels are added.
export const CITY_TG_CHANNELS: Record<string, string> = {
  "yekaterinburg": "obmennik_yekaterinburg",
  "nizhny-novgorod": "obmennik_novgorod",
  "yaroslavl": "obmennik_yaroslavl",
  "izhevsk": "obmennik_izhevsk",
  "irkutsk": "obmennik_irkutsk",
  "yoshkar-ola": "obmennik_yoshkar_ola",
  "kemerovo": "obmennik_kemerovo",
  "kaliningrad": "obmennik_kaliningrad",
  "kursk": "obmennik_kursk",
  "kazan": "obmennik_kazan",
  "saint-petersburg": "obmennik_saint_petersburg",
  "magadan": "obmennik_magadan",
  "novosibirsk": "obmennik_novosibirsk",
  "omsk": "obmennik_omsk",
  "perm": "obmennik_perm",
  "rostov": "obmennik_rostov",
  "rostov-on-don": "obmennik_rostov2",
  "saratov": "obmennik_saratov",
  "saransk": "obmennik_saransk",
  "tomsk": "obmennik_tomsk"
};

export const cityChannel = (slug?: string | null): string | null =>
  (slug && CITY_TG_CHANNELS[slug.toLowerCase()]) || null;
