import {
  extractPmsFromPmGroup,
  pmsToSlug,
} from "../components/main/side/selector/section/PmGroup/helper";
import { mylog } from "../services/utils";
import { IPossiblePmPair } from "../types/exchange";
import { IExchanger, IParserExchanger } from "../types/exchanger";
import { ISelector, IPm, IPmGroup, ISection } from "../types/selector";

export const getPmsFromSelector = (selector: ISelector): IPm[] => {
  const pmGroups: IPmGroup[] = selector.sections.flatMap((section: ISection) =>
    section.pm_groups.map((pmg) => ({
      ...pmg,
      section: section.en_title.toLowerCase(),
    }))
  );

  const pms: IPm[] = pmGroups.flatMap((pmGroup) => {
    const extracted = extractPmsFromPmGroup(pmGroup);
    if (!extracted?.length) console.log("Missing PMs in group:", pmGroup);
    return extracted || [];
  });
  return pms;
};

export const getSlugToCodes = (
  possiblePairs: Record<string, string[]>,
  pms: IPm[]
) => {
  const dirs = Object.entries(possiblePairs ?? {}).flatMap(([code, pairs]) =>
    (pairs || []).map((pair) => `${code}_${pair}`)
  );

  const pmMap = new Map(pms.map((pm) => [pm.code.toUpperCase(), pm]));

  const slugToCodes: Record<string, string> = dirs.reduce((acc, dir) => {
    const [give, get] = dir.split("_");
    const pair: IPossiblePmPair = {
      givePm: pmMap.get(give),
      getPm: pmMap.get(get),
    };
    const slug = pmsToSlug(pair);
    return slug ? { ...acc, [slug]: dir } : acc;
  }, {});

  return slugToCodes;
};

export const mergeExchangers = (
  allExchangers?: IExchanger[],
  parserExchangers?: Record<string, IParserExchanger>
) => {
  if (!allExchangers || !parserExchangers) {
    mylog("NO EXCHANGERS", "error");
    return (allExchangers || parserExchangers || []) as (IExchanger &
      IParserExchanger)[];
  }
  return allExchangers.map((ex) => {
    const parserExchanger = parserExchangers?.[ex.id];
    return {
      ...parserExchanger,
      ...ex,
    } as IExchanger & IParserExchanger;
  });
};
