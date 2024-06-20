import main from "../components/main";
import { AmountInput, AmountOutputs } from "../types/amount";
import {
  ICurrencyConverterRate,
  IOrder,
  IP2PDir,
  IP2PRegulationCodes,
  IP2PRegulationGroup,
} from "../types/p2p";
import { IRate } from "../types/rates";
import { IPm } from "../types/selector";
import { IFingerprint } from "../types/shared";
import { FeesCalculator } from "./amountsHelper";
import { MainState } from "./mainReducer";

export const initialAmountOutputs = { give: "", get: "" };

export const [minDef, maxDef, minStart, minEnd, maxStart, maxEnd, rateSpread] =
  [300, 5000, 100, 5000, 100, 10000, 0.1]; // EQUAL TO USD

const initialAmount = (side: "give" | "get", toUSD?: number) => ({
  num: 1,
  str: "1",
  side: side,
});
export const getAmountOutputs = (
  state: MainState,
  swiperIdVisible: number,
  customAmount?: AmountInput
): AmountOutputs => {
  const dir = `${state.givePm?.code.toUpperCase()}_${state.getPm?.code.toUpperCase()}`;
  // updateAmounts не успевает подхватить swiperIdVisible, поэтому передаем дополнительно
  const rate = state?.dirRates?.[swiperIdVisible];
  const side = rate && rate?.course > 1 ? "get" : "give";
  const amount =
    customAmount ||
    state.amountInput ||
    initialAmount(side, state.ccRates?.[`${side}ToUSD`]);
  if (rate) {
    const feesCalculator = new FeesCalculator(dir, rate, amount);
    return feesCalculator.calculateAmountOutputs();
  }
  return initialAmountOutputs;
};

export const convertP2PRatioToCourse = (
  dirRates: IRate[],
  ccRates?: ICurrencyConverterRate
): IRate[] => {
  if (!ccRates || !ccRates?.rate) return dirRates;
  dirRates.map((rate) => {
    if (!rate?.p2pRatio) return rate;
    return { ...rate, course: ccRates?.rate * rate.p2pRatio };
  });
  return dirRates;
};

export const getDefaultRegulationCodes = (
  regulationGroups: IP2PRegulationGroup[]
) => {
  return regulationGroups.reduce((regulationCodes: IP2PRegulationCodes, rg) => {
    const codes = rg.regulations.reduce(
      (codes: IP2PRegulationCodes, r) => ({
        ...codes,
        [r.en_title.replaceAll(" ", "_").toLocaleLowerCase()]:
          r.default_checked,
      }),
      {}
    );
    return { ...regulationCodes, ...codes };
  }, {});
};

export const createOrder = (p2pData: IOrder, uid: string): IOrder => ({
  ...p2pData,
  uid,
  status: "suspended",
});

export const createUID = (fingerprint?: IFingerprint) =>
  "uid_" + Number(fingerprint?.ip.replaceAll(".", "")).toString(36);

export const destructureDirSlug = (slug: string) => {
  const [giveNameCurCode, getNameCurCode] = slug.split("-to-");
  const [giveName, giveCurCode, giveSubgroupName] = giveNameCurCode.split("-");
  const [getName, getCurCode, getSubgroupName] = getNameCurCode.split("-");
  return {
    giveName,
    giveCurCode,
    giveSubgroupName,
    getName,
    getCurCode,
    getSubgroupName,
  };
};
// export const findBestCourseRateByAmountInput = (
//   amountInput?: AmountInput,
//   bestRates?: IDirRates
// ): IRate | undefined => {
//   if (amountInput?.str && bestRates && Object.keys(bestRates).length) {
//     const best = Object.entries(bestRates)
//       .filter(([_, rate]) => {
//         return (
//           rate.min[amountInput.side] <= amountInput.num &&
//           rate.max[amountInput.side] >= amountInput.num
//         );
//       })
//       .sort((r1, r2) => r1[1].course - r2[1].course)[0]?.[1];
//     console.log("best", best?.name);
//     return best;
//   }
//   return;
// };
