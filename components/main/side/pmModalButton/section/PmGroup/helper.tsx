import {
  IOption,
  IPmGroup,
  IPm,
  IPmPointer,
} from "../../../../../../types/selector";

export const capitalize = (s: string | undefined) => {
  if (typeof s !== "string") return "";
  const words = s.split(" ");
  const res = words
    .map((w, index) =>
      index > 0 && w.length < 5
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
  return res;
};

const getOptionCode = (option: IOption, prefix?: string): string => {
  return (
    (option?.code && option?.code.toUpperCase()) || // USDTERC
    (prefix &&
      prefix.toUpperCase() !== option?.currency?.code.toUpperCase() &&
      prefix.toUpperCase() + option?.currency?.code.toUpperCase()) || // SBERRUB
    option?.currency?.code.toUpperCase()
  ); // BTC
};

export const allPmsHaveUnmetPairs = (pms: IPm[], possiblePairs?: string[]) => {
  if (!possiblePairs || !possiblePairs.length) return false;
  if (pms.find((pm) => possiblePairs.find((pair) => pm.code === pair)))
    return false;
  return true;
};

export const singlePmHasUnmetPairs = (pm: IPm, possiblePairs?: string[]) => {
  if (!possiblePairs || !possiblePairs.length) return false;
  if (possiblePairs.find((pair) => pm.code === pair)) return false;
  return true;
};

export const getPmsFromPmGroup = (pm_group: IPmGroup): IPm[] => {
  return pm_group.options.map((option) => {
    const code = getOptionCode(option, pm_group?.prefix);
    const subgroup_name = option.name && option.name.toUpperCase();
    const tag =
      pm_group.options.length > 1
        ? option.code?.toLocaleUpperCase() || option.currency.code.toUpperCase()
        : undefined;
    const en_name = pm_group.en_name;
    const ru_name = pm_group.ru_name;
    return {
      pm_group_id: pm_group.id,
      code, // USDTERC20
      en_name, // Tether
      ru_name,
      subgroup_name, // ERC-20
      currency: option?.currency, // USDT
      icon: pm_group.icon,
      color: pm_group.color,
      tag,
    };
  });
};

export const getPmByCode = (pmPointer: IPmPointer): IPm | undefined => {
  const { code, pm_group } = pmPointer;
  if (!pm_group?.options) return;
  const pms = getPmsFromPmGroup(pm_group);
  if (!code) return pms[0];
  return pms.find((pm) => pm.code.toLowerCase() == code.toLowerCase());
};

// export const parsePm = (pm_group: IPmGroup): IPm | null => {
//   // если одиночка
//   try{
//     // const short_name = pm_group.prefix
//     // ? pm_group.prefix.toUpperCase()
//     //   + pm_group.options[0].currency.code.toUpperCase() // not crypto
//     // : pm_group.options[0].currency.code.toUpperCase(); // crypto

//   const pm = {
//     en_name: capitalize(pm_group.en_name),
//     ru_name: capitalize(pm_group?.ru_name),
//     code: "",
//     currency: pm_group.options[0].currency,
//     icon: pm_group.icon,
//   };
//     return pm;
//   } catch(err){
//     return null
//   }

// };

// export const parseSubPm = (pm_group: IPmGroup, subitem: IOption) => ({
//   en_name: capitalize(pm_group.en_name) + " " + subitem.name,
//   ru_name: capitalize(pm_group.ru_name)
//     ? pm_group.ru_name + " " + subitem.name
//     : "",
//   short_name: subitem.short_name ? subitem.short_name.toUpperCase() : "",
//   currency: subitem.currency,
//   icon: pm_group.icon,
// });

// export const parseCurPm = (pm_group: IPmGroup, currency: ICurrency) => ({
//   en_name: capitalize(pm_group.en_name) + " " + currency.name.toUpperCase(),
//   ru_name: capitalize(pm_group.ru_name)
//     ? pm_group.ru_name + " " + currency.name.toUpperCase()
//     : "",
//   short_name: pm_group.short_name + currency.name.toUpperCase(),
//   currency,
//   icon: pm_group.icon,
// });

export const IsStringArray = (str: string) => {
  try {
    const res = JSON.parse(str);
    return Array.isArray(res);
  } catch (e) {
    return false;
  }
};

// export const saveDirToLocalStorage = (dir: string) => {
//   if (typeof window !== "undefined") {
//     const savedDirsString = localStorage.getItem("recent dirs");
//     const savedDirs = IsStringArray(savedDirsString)
//       ? JSON.parse(savedDirsString)
//       : [];
//     const newSavedDirs = savedDirs.length ? [savedDirs.pop(), dir] : [dir];
//     localStorage.setItem("recent dirs", JSON.stringify(newSavedDirs));
//   }
// };
