import Transliterator from "../../../../services/transliterator";
import { PmGroupType, SectionType } from "../../../../types/selector";

const transliterator = new Transliterator();

const _checkPmGroupMatching = (
  pm_group: PmGroupType,
  input: string
): boolean => {
  const pmGroupNamesToMatch =
    `${pm_group.en_name} ${pm_group.ru_name} ` +
    String(pm_group.options.map((op) => `${op.name} ${op.currency.code}`));

  return transliterator.findMatch(pmGroupNamesToMatch, input);
};

export const filterSections = (
  input: string,
  sections: SectionType[]
): SectionType[] => {
  if (!input) return sections;
  return sections.map((section) => ({
    ...section,
    pm_groups: section.pm_groups.filter((pm_group) =>
      _checkPmGroupMatching(pm_group, input.toLowerCase())
    ),
  }));
};
