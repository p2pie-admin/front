import { IPopularDirRates, IRate } from "./../types/rates";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";

import { RootState } from "./store";
import {
  fetchDirRates,
  fetchAllDirRates,
  fetchFiatByCurrencyCode,
  fetchPopular,
  fetchPossiblePairs,
  fetchFiat,
  fetchPopularRates,
} from "./thunks";
import { IFiatRates, IImage, IPm } from "../types/selector";
import { IActivePetal, IDir } from "../types/dir";
import { initialAmountOutputs, getAmountOutputs } from "./helper";
import Side from "../components/main/side";

import { getPmByCode } from "../components/main/side/pmModalButton/section/PmGroup/helper";

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
  activePopularSide?: string;
  selectedPopular?: IPm;
  popularPms: IPm[];
  popularCompleted?: ISide;
  isScrollLocked: boolean;
  activePetal?: IActivePetal;
  bestRatesPreview: { [key: string]: string }; // from coingecko
  pendingPopularRates: boolean;
  popularRates?: IPopularDirRates;
  modals: { [key: string]: boolean };
}

const initialState: MainState = {
  searchBarInputValue: "",
  activeSide: null,
  pendingDirRates: false,
  amountOutputs: initialAmountOutputs,
  swiperIdVisible: 0,
  popularPms: [],
  isScrollLocked: false,
  bestRatesPreview: {},
  pendingPopularRates: false,
  modals: {},
};

const getUpdatedAmount = (state: MainState, newSwiperId: number) => {
  return getAmountOutputs(state, state.amountInput, newSwiperId || 0);
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
    // selectPm: (
    //   state: MainState,
    //   action: PayloadAction<{ pm: IPm; side: ISide; shaded?: boolean; }>
    // ) => {
    //   const {pm , side, shaded} = action.payload
    //   const oppositePm = side === "give" ? "get" : "give";
    //   if (shaded) {
    //     state.amountInput = undefined;
    //     state.amountOutputs = initialAmountOutputs;
    //     state.dirRates = undefined;
    //     state[`${oppositePm}Pm`] = undefined
    //   } // опустошаем противоположный pm
    //   if (side === "give") state.givePm = pm;
    //   if (side === "get") state.getPm = pm;

    // },

    setPopularCompleted: (
      state: MainState,
      action: PayloadAction<ISide | undefined>
    ) => {
      state.popularCompleted = action.payload;
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
    setSwiperIdVisible: (state: MainState, action: PayloadAction<number>) => {
      state.swiperIdVisible = action.payload;
      state.amountOutputs = getUpdatedAmount(state, action.payload);
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
    setActivePopularSide: (
      state: MainState,
      action: PayloadAction<string | undefined>
    ) => {
      state.activePopularSide = action.payload;
      // state.activePetal = undefined;
    },
    reverseDir: (state: MainState) => {
      [state.givePm, state.getPm] = [state.getPm, state.givePm];
      state.amountOutputs = getUpdatedAmount(state, state.swiperIdVisible);
    },
    updateScrollLock: (state: MainState, action: PayloadAction<boolean>) => {
      state.isScrollLocked = action.payload;
    },

    triggerModal: (state: MainState, action: PayloadAction<string>) => {
      state.modals[action.payload] = !state.modals[action.payload];
    },
    setActivePetal: (
      state: MainState,
      action: PayloadAction<IActivePetal | undefined>
    ) => {
      state.activePetal = action.payload;
    },
    incrementSwiper: (state: MainState) => {
      const length = state.dirRates?.length || 0;
      if (!length) return;
      if (state.swiperIdVisible == length - 1) {
        const newSwiperId = 0;
        state.swiperIdVisible = newSwiperId;
        state.amountOutputs = getUpdatedAmount(state, newSwiperId);
        return;
      }
      const newSwiperId = state.swiperIdVisible + 1;
      state.swiperIdVisible = newSwiperId;
      state.amountOutputs = getUpdatedAmount(state, newSwiperId);
    },

    decrementSwiper: (state: MainState) => {
      const length = state.dirRates?.length || 0;
      if (!length) return;
      if (state.swiperIdVisible == 0) {
        const newSwiperId = length - 1;
        state.swiperIdVisible = newSwiperId;
        state.amountOutputs = getUpdatedAmount(state, newSwiperId);
        return;
      }
      const newSwiperId = state.swiperIdVisible - 1;
      state.swiperIdVisible = newSwiperId;
      state.amountOutputs = getUpdatedAmount(state, newSwiperId);
    },
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  extraReducers: (builder) => {
    builder.addCase(fetchPopular.fulfilled, (state, action) => {
      state.popularPms = action.payload.reduce((popularPms: IPm[], popular) => {
        const pm = getPmByCode(popular);
        return pm ? [...popularPms, pm] : popularPms;
      }, []);
    });

    //
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
    builder.addCase(fetchFiat.fulfilled, (state, action) => {
      state.bestRatesPreview = action.payload.fiatRates;
    });
    builder.addCase(fetchPossiblePairs.fulfilled, (state, action) => {
      if (action.payload.side === "give" && state.givePm)
        state.givePm.possible_pairs = action.payload.possiblePairs;
      if (action.payload.side === "get" && state.getPm)
        state.getPm.possible_pairs = action.payload.possiblePairs;
    });
    // popular rates
    builder.addCase(fetchPopularRates.pending, (state) => {
      state.pendingPopularRates = true;
    });
    builder.addCase(fetchPopularRates.fulfilled, (state, action) => {
      state.pendingPopularRates = false;
      state.popularRates = action.payload;
    });
  },
});

export const {
  setAmount,
  setActiveSide,
  setPm,
  setSearchBarInputValue,
  setSwiperIdVisible,
  clearPms,
  reverseDir,
  updateScrollLock,
  setActivePetal,
  setPopularCompleted,
  triggerModal,
  incrementSwiper,
  decrementSwiper,
} = ratesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAmounts = (state: RootState) => state.main;

export default ratesSlice.reducer;
