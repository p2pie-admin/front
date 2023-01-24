import { AmountInput, AmountOutputs } from "../types/amount";
import { IDirRates, IRate } from "../types/rates";
import { FeesCalculator } from "./amountsHelper";
import { MainState } from "./mainReducer";

export const initialAmountOutputs = {
  give: "",
  get: "",
};

export const getAmountOutputs = (
  state: MainState,
  amount?: AmountInput,
  swiperIdVisible?: number
): AmountOutputs => {
  const uniqueRatesKeys = Object.keys(state.dirTops?.uniqueRates || {});
  if (!uniqueRatesKeys.length) return initialAmountOutputs;
  const dir = `${state.givePm?.code.toUpperCase()}_${state.getPm?.code.toUpperCase()}`;
  const id = // updateAmounts не успевает подхватить swiperIdVisible, поэтому передаем дополнительно
    swiperIdVisible !== undefined ? swiperIdVisible : state.swiperIdVisible;
  // const rate =
  //   state.dirTops?.bestRates[Object.keys(state.dirTops.bestRates)[id]];
  const activeRateKey = uniqueRatesKeys[id];
  const rate = Object.values(
    state.dirTops?.uniqueRates[activeRateKey] || {}
  )[0];

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

export const findBestCourseRateByAmountInput = (
  amountInput?: AmountInput,
  bestRates?: IDirRates
): IRate | undefined => {
  if (amountInput?.str && bestRates && Object.keys(bestRates).length) {
    const best = Object.entries(bestRates)
      .filter(([_, rate]) => {
        return (
          rate.min[amountInput.side] <= amountInput.num &&
          rate.max[amountInput.side] >= amountInput.num
        );
      })
      .sort((r1, r2) => r1[1].course - r2[1].course)[0]?.[1];
    console.log("best", best?.name);
    return best;
  }
  return;
};
