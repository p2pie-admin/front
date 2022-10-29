import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";
import { DirTops, DirRates } from "../types/rates";
import { FeesCalculator } from "./amountsHelper";
import { RootState } from "./store";
import {
  fetchDirRates,
  fetchDirTops,
  fetchFiatByCurrencyCode,
  fetchPopular,
  fetchPossiblePairs,
} from "./thunks";
import { PmType } from "../types/selector";
import { IDir } from "../types/dir";
import {
  initialAmountOutputs,
  getAmountOutputs,
  findBestCourseRateByAmountInput,
} from "./helper";

type Side = "give" | "get";

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
  activeDir?: string;
  populars: IDir[];
  isScrollLocked: boolean;
}

const initialState: MainState = {
  searchBarInputValue: "",
  activeSide: null,
  pendingDirTops: false,
  amountOutputs: initialAmountOutputs,
  swiperIdVisible: 0,
  populars: [],
  isScrollLocked: false,
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

    setPm: (
      state: MainState,
      action: PayloadAction<{ pm?: PmType; side: Side }>
    ) => {
      if (!action.payload.pm) {
        state.amountInput = undefined;
        state.amountOutputs = initialAmountOutputs;
        state.dirTops = undefined;
        state.dirRates = undefined;
      } // опустошаем пм
      if (action.payload.side === "give") state.givePm = action.payload.pm;
      if (action.payload.side === "get") state.getPm = action.payload.pm;
    },

    clearPms: (state: MainState) => {
      state.getPm = undefined;
      state.givePm = undefined;
    },

    setActiveSide: (state: MainState, action: PayloadAction<Side | null>) => {
      state.activeSide = action.payload;
      state.searchBarInputValue = "";
    },
    setSwiperIdVisible: (
      state: MainState,
      action: PayloadAction<number | null>
    ) => {
      state.swiperIdVisible = action.payload || 0;
    },
    // свайпаем
    updateAmount: (state: MainState, action: PayloadAction<number>) => {
      state.amountOutputs = getAmountOutputs(
        state,
        state.amountInput,
        action.payload
      );
    },
    // вводим свои числа
    setAmount: (
      state: MainState,
      action: PayloadAction<AmountInput | undefined>
    ) => {
      state.amountInput = action.payload;
      const bestRates = state.dirTops?.bestRates;
      const amountInput = action.payload;
      // injecting best if amount is custom
      const bestCourseRate = findBestCourseRateByAmountInput(
        amountInput,
        bestRates
      );

      state.amountOutputs = getAmountOutputs(state, action.payload);
    },
    setActiveDir: (
      state: MainState,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeDir = action.payload;
    },
    reverseDir: (state: MainState) => {
      [state.givePm, state.getPm] = [state.getPm, state.givePm];
    },
    updateScrollLock: (state: MainState, action: PayloadAction<boolean>) => {
      state.isScrollLocked = action.payload;
    },
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  extraReducers: (builder) => {
    builder.addCase(fetchPopular.fulfilled, (state, action) => {
      state.populars = action.payload;
    });
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
      state.amountOutputs = getAmountOutputs(state);
      state.pendingDirTops = false;
    });
    builder.addCase(fetchFiatByCurrencyCode.fulfilled, (state, action) => {
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

export const {
  setAmount,
  updateAmount,
  setActiveSide,
  setPm,
  setSearchBarInputValue,
  setSwiperIdVisible,
  setActiveDir,
  clearPms,
  reverseDir,
  updateScrollLock,
} = ratesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAmounts = (state: RootState) => state.main;

export default ratesSlice.reducer;
