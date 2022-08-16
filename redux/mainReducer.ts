import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";
import { DirTops, DirRates } from "../types/rates";
import { FeesCalculator } from "./amountsHelper";
import { RootState } from "./store";
import {
  fetchDirRates,
  fetchDirTops,
  fetchFiatByCode,
  fetchPossiblePairs,
} from "./thunks";
import { PmType } from "../types/selector";

type Side = "give" | "get";

const initialAmountOutputs = {
  give: "",
  get: "",
};

export interface MainState {
  searchBarInputValue: string;
  givePm?: PmType;
  getPm?: PmType;
  activeSide: Side | null;
  dirTops?: DirTops;
  pendingDirTops: boolean;
  dirRates?: DirRates;
  amountInput?: AmountInput;
  amountOutputs: AmountOutputs;
  swiperIdVisible: number;
}

const initialState: MainState = {
  searchBarInputValue: "",
  activeSide: null,
  pendingDirTops: false,
  amountOutputs: initialAmountOutputs,
  swiperIdVisible: 0,
};

export const ratesSlice = createSlice({
  name: "rates",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSearchBarInputValue: (
      state: MainState,
      action: PayloadAction<string>
    ) => {
      state.searchBarInputValue = action.payload;
    },

    setPm: (state: MainState, action: PayloadAction<PmType>) => {
      if (state.activeSide === "give") state.givePm = action.payload;
      if (state.activeSide === "get") state.getPm = action.payload;
    },

    setActiveSide: (state: MainState, action: PayloadAction<Side | null>) => {
      state.activeSide = action.payload;
    },
    setSwiperIdVisible: (
      state: MainState,
      action: PayloadAction<number | null>
    ) => {
      state.swiperIdVisible = action.payload || 0;
    },
    // свайпаем
    updateAmount: (state: MainState, action: PayloadAction<number>) => {
      state.amountOutputs = setAmountOutputs(
        state,
        state.amountInput,
        action.payload
      );
    },
    // вводим свои числа
    setAmount: (state: MainState, action: PayloadAction<AmountInput>) => {
      state.amountInput = action.payload;
      state.amountOutputs = setAmountOutputs(state, action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchDirRates.fulfilled, (state, action) => {
      state.dirRates = action.payload;
    });
    builder.addCase(fetchDirRates.rejected, (error) => {
      console.error(error);
    });
    //

    builder.addCase(fetchDirTops.rejected, (error) => {
      console.error(error);
    });
    builder.addCase(fetchDirTops.pending, (state) => {
      state.pendingDirTops = true;
    });
    builder.addCase(fetchDirTops.fulfilled, (state, action) => {
      state.dirTops = action.payload;
      state.amountInput = undefined;
      state.amountOutputs = setAmountOutputs(state);
      state.pendingDirTops = false;
    });
    builder.addCase(fetchFiatByCode.fulfilled, (state, action) => {
      const key = (action.payload.side + "Pm") as "givePm" | "getPm";
      if (state[key]) {
        state[key]!.fiat = action.payload.fiatRates;
      }
    });
    builder.addCase(fetchPossiblePairs.fulfilled, (state, action) => {
      if (action.payload.side === "give" && state.givePm)
        state.givePm.possible_pairs = action.payload.possiblePairs;
      if (action.payload.side === "get" && state.getPm)
        state.getPm.possible_pairs = action.payload.possiblePairs;
    });
  },
});

const setAmountOutputs = (
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

export const {
  setAmount,
  updateAmount,
  setActiveSide,
  setPm,
  setSearchBarInputValue,
  setSwiperIdVisible,
} = ratesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAmounts = (state: RootState) => state.main;

export default ratesSlice.reducer;
