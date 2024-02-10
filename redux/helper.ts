import { AmountInput, AmountOutputs } from "../types/amount";
import {
  ICurrencyConverterRate,
  IP2PDir,
  IP2PRegulationCodes,
  IP2PRegulationGroup,
} from "../types/p2p";
import { IRate } from "../types/rates";
import { FeesCalculator } from "./amountsHelper";
import { MainState } from "./mainReducer";

export const initialAmountOutputs = { give: "", get: "" };

export const [minDef, maxDef, minStart, minEnd, maxStart, maxEnd, rateSpread] =
  [300, 5000, 100, 5000, 100, 10000, 0.1]; // EQUAL TO USD

export const getAmountOutputs = (
  state: MainState,
  swiperIdVisible: number,
  amount?: AmountInput
): AmountOutputs => {
  const dir = `${state.givePm?.code.toUpperCase()}_${state.getPm?.code.toUpperCase()}`;
  // updateAmounts не успевает подхватить swiperIdVisible, поэтому передаем дополнительно
  const rate = state?.dirRates?.[swiperIdVisible];

  if (rate) {
    const feesCalculator = new FeesCalculator(
      dir,
      rate,
      amount || {
        num: 1,
        str: "1",
        side: rate?.course > 1 ? "get" : "give",
      }
    );
    return feesCalculator.calculateAmountOutputs();
  }
  return initialAmountOutputs;
};

export const convertP2PRatioToCourse = (
  dirRates: IRate[],
  currencyConverterRate?: ICurrencyConverterRate
): IRate[] => {
  if (!currencyConverterRate || !currencyConverterRate?.rate) return dirRates;
  dirRates.map((rate) => {
    if (!rate?.p2pRatio) return rate;
    return { ...rate, course: currencyConverterRate?.rate * rate.p2pRatio };
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
