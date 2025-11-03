import { AmountInput, AmountOutputs } from "../types/amount";

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
//
export const enrichLink = (
  ref_link: string,
  giveCode?: string,
  getCode?: string,
  city?: any
) => {
  if (!giveCode || !getCode) return ref_link;
  if (ref_link.includes("?")) {
    return `${ref_link}&cur_from=${giveCode}&cur_to=${getCode}`;
  }

  return `${ref_link}/?cur_from=${giveCode}&cur_to=${getCode}`;
};
