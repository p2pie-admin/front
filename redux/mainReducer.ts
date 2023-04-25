import { IRate } from "./../types/rates";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";

import { FeesCalculator } from "./amountsHelper";
import { RootState } from "./store";
import {
  fetchDirRates,
  fetchAllDirRates,
  fetchFiatByCurrencyCode,
  fetchPopular,
  fetchPossiblePairs,
} from "./thunks";
import { IPm } from "../types/selector";
import { IActivePetal, IDir } from "../types/dir";
import { initialAmountOutputs, getAmountOutputs } from "./helper";
import Side from "../components/main/side";

type ISide = "give" | "get";

export interface MainState {
  searchBarInputValue: string;
  givePm?: IPm;
  getPm?: IPm;
  activeSide: ISide | null;
  dirRates?: IRate[]; //  uniqueRates + bestRates
  pendingDirRates: boolean;
  amountInput?: AmountInput;
  amountOutputs: AmountOutputs;
  swiperIdVisible: number;
  activeDir?: string;
  populars: IDir[];
  isScrollLocked: boolean;
  activePetal?: IActivePetal;
}

const initialState: MainState = {
  searchBarInputValue: "",
  activeSide: null,
  pendingDirRates: false,
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
      action: PayloadAction<{ pm?: IPm; side: ISide }>
    ) => {
      if (!action.payload.pm) {
        state.amountInput = undefined;
        state.amountOutputs = initialAmountOutputs;
        state.dirRates = undefined;
      } // опустошаем пм
      if (action.payload.side === "give") state.givePm = action.payload.pm;
      if (action.payload.side === "get") state.getPm = action.payload.pm;
    },

    clearPms: (state: MainState) => {
      state.getPm = undefined;
      state.givePm = undefined;
    },

    setActiveSide: (state: MainState, action: PayloadAction<ISide | null>) => {
      state.activeSide = action.payload;
      state.searchBarInputValue = "";
    },
    setSwiperIdVisible: (
      state: MainState,
      action: PayloadAction<number | null>
    ) => {
      state.swiperIdVisible = action.payload || 0;
      state.amountOutputs = getAmountOutputs(
        state,
        state.amountInput,
        action.payload || 0
      );
    },
    // setExchangerIdVisible: (
    //   state: MainState,
    //   action: PayloadAction<string | undefined>
    // ) => {
    //   state.exchangerIdVisible = action.payload;
    // },
    // свайпаем

    // вводим свои числа
    setAmount: (
      state: MainState,
      action: PayloadAction<AmountInput | undefined>
    ) => {
      state.amountInput = action.payload;
      state.amountOutputs = getAmountOutputs(state, action.payload);
    },
    setActiveDir: (
      state: MainState,
      action: PayloadAction<string | undefined>
    ) => {
      state.activeDir = action.payload;
      // state.activePetal = undefined;
    },
    reverseDir: (state: MainState) => {
      [state.givePm, state.getPm] = [state.getPm, state.givePm];
      state.amountOutputs = getAmountOutputs(
        state,
        state.amountInput,
        state.swiperIdVisible
      );
    },
    updateScrollLock: (state: MainState, action: PayloadAction<boolean>) => {
      state.isScrollLocked = action.payload;
    },
    setActivePetal: (
      state: MainState,
      action: PayloadAction<IActivePetal | undefined>
    ) => {
      // if (
      //   state.activePetal?.side &&
      //   action.payload?.side &&
      //   state.activePetal.side !== action.payload.side
      // ) {
      //   const side = state.activePetal.side;
      //   state.givePm =
      //     side === "give" ? state.activePetal.pm : action.payload?.pm;
      //   state.getPm =
      //     side === "get" ? state.activePetal.pm : action.payload?.pm;
      //   state.activeDir = undefined;
      // }
      state.activePetal = action.payload;
    },
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  extraReducers: (builder) => {
    builder.addCase(fetchPopular.fulfilled, (state, action) => {
      state.populars = action.payload;
    });

    //

    builder.addCase(fetchDirRates.rejected, (error) => {
      console.error(error);
    });
    builder.addCase(fetchDirRates.pending, (state) => {
      state.pendingDirRates = true;
    });
    builder.addCase(fetchDirRates.fulfilled, (state, action) => {
      state.dirRates = action.payload;
      state.amountInput = undefined;
      state.amountOutputs = getAmountOutputs(state);
      state.pendingDirRates = false;
      state.swiperIdVisible = 0;
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
  setActiveSide,
  setPm,
  setSearchBarInputValue,
  setSwiperIdVisible,
  setActiveDir,
  clearPms,
  reverseDir,
  updateScrollLock,
  setActivePetal,
} = ratesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAmounts = (state: RootState) => state.main;

export default ratesSlice.reducer;
