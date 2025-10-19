function normalize(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function filterSearchResults(entries: any[] = [], query: string): any[] {
  if (!Array.isArray(entries) || !query.trim()) return [];

  const q = normalize(query);
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const pattern = new RegExp(words.map(escapeRegex).join(".*"), "i");

  return entries
    .filter((e) => {
      const header = normalize(e?.header || "");

      // Normalize wordsToSearchFrom input
      const wordsArr = Array.isArray(e?.wordsToSearchFrom)
        ? e.wordsToSearchFrom
        : typeof e?.wordsToSearchFrom === "string"
        ? [e.wordsToSearchFrom]
        : [];

      const extraWords = wordsArr.map(normalize).join(" ");
      const combined = `${header} ${extraWords}`.trim();

      return pattern.test(combined);
    })
    .sort((a, b) => {
      const aWords = Array.isArray(a?.wordsToSearchFrom)
        ? a.wordsToSearchFrom
        : typeof a?.wordsToSearchFrom === "string"
        ? [a.wordsToSearchFrom]
        : [];
      const bWords = Array.isArray(b?.wordsToSearchFrom)
        ? b.wordsToSearchFrom
        : typeof b?.wordsToSearchFrom === "string"
        ? [b.wordsToSearchFrom]
        : [];

      const ha = `${normalize(a?.header || "")} ${aWords
        .map(normalize)
        .join(" ")}`;
      const hb = `${normalize(b?.header || "")} ${bWords
        .map(normalize)
        .join(" ")}`;

      const idxA = ha.search(pattern);
      const idxB = hb.search(pattern);
      if (idxA !== idxB) return idxA - idxB;
      return ha.length - hb.length;
    });
}
