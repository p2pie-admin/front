import Transliterator from "../../services/transliterator";

export function hasCyrillic(text: string): boolean {
  return /[\u0400-\u04FF]/.test(text);
}

export const exchangerNameToSlug = (name: string) => {
  let latinName = name;
  if (hasCyrillic(name)) {
    const transliterator = new Transliterator();
    latinName = transliterator._transliterate(name).cyrillic_to_latin;
  }
  return latinName.toLowerCase().replace(/[ .]/g, "-");
};
