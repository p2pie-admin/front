interface SelectorType {
  id: string;
  en_give_header: string;
  ru_give_header: string;
  en_get_header: string;
  ru_get_header: string;
  search_bar: SearchBarType;
  sections: SectionType[];
}

interface SearchBarType {
  en_placeholder: string;
  ru_placeholder: string;
  en_give_adornment: string;
  ru_give_adornment: string;
  en_get_adornment: string;
  ru_get_adornment: string;
}

interface SectionType {
  id: string;
  rows: number;
  columns: number;
  en_title: string;
  ru_title: string;
  pm_groups: PmGroupType[];
}

interface PmGroupType {
  en_name: string;
  ru_name?: string;
  prefix?: string;
  icon?: ImageType;
  options: OptionType[];
}

interface ImageType {
  id: string;
  url: string;
  alternativeText: string;
}

interface OptionType {
  name?: string;
  code?: string;
  currency: CurrencyType;
}

interface CurrencyType {
  id: string;
  code: string;
  accuracy: string;
}

interface FiatRates {
  id: string;
  usd: number;
  rub: number;
}

/// дополнительный тип

interface PmType {
  en_name: string; // Tether ERC-20
  ru_name: string;
  short_name: string; // ERC-20 отобразить в подгруппе
  code: string; // USDTERC20
  currency: CurrencyType; // USDT
  icon?: ImageType;
  fiat?: FiatRates;
  possible_pairs?: string[];
}

type Side = "give" | "get";

export type {
  SelectorType,
  SearchBarType,
  SectionType,
  PmGroupType,
  CurrencyType,
  OptionType,
  PmType,
  ImageType,
  FiatRates,
  Side,
};
