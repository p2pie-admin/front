import { IP2PDir, IUsersRate } from "./../types/p2p";
import { IPopularDirRates, IRate } from "./../types/rates";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";

import { RootState } from "./store";
import {
  fetchDirRates,
  fetchAllDirRates,
  fetchPms,
  fetchPossiblePairs,
  fetchFiat,
  restorePmsFromSlug,
  fetchCurrencyConverterRate,
} from "./thunks";
import { IPm, IPmGroup } from "../types/selector";
import { IActivePetal, IDir } from "../types/dir";
import {
  initialAmountOutputs,
  getAmountOutputs,
  minDef,
  maxDef,
  minStart,
  minEnd,
  maxStart,
  maxEnd,
  rateSpread,
} from "./helper";
import Side from "../components/main/side";

import { getPmByCode } from "../components/main/side/selector/section/PmGroup/helper";
import { ILocation } from "../types/shared";
import { ICurrencyConverterRate } from "../types/p2p";
import { format, R } from "./amountsHelper";

type ISide = "give" | "get";

export interface MainState {
  searchBarInputValue: string;
  givePm?: IPm;
  getPm?: IPm;
  dirRates?: IRate[]; //  uniqueRates + bestRates
  pendingDirRates: boolean;
  amountInput?: AmountInput;
  amountOutputs: AmountOutputs;
  swiperIdVisible: number;
  activePopularSide?: string;
  selectedPopular?: IPm;
  pms: IPm[];
  popularCompleted?: ISide;
  isScrollLocked: boolean;
  activePetal?: IActivePetal;
  bestRatesPreview: { [key: string]: string }; // from coingecko
  pendingPopularRates: boolean;
  popularRates?: IPopularDirRates;
  modal?: string;
  trash?: any;
  location: ILocation;
  currencyConverterRate?: ICurrencyConverterRate;
  p2p: { dirs: IP2PDir[] };
}

const initialState: MainState = {
  searchBarInputValue: "",
  pendingDirRates: false,
  amountOutputs: initialAmountOutputs,
  swiperIdVisible: 0,
  pms: [],
  isScrollLocked: false,
  bestRatesPreview: {},
  pendingPopularRates: false,
  location: { en_country_name: "Russia", en_city_name: "Moscow" },
  p2p: {
    dirs: [{ expanded: true, deleted: false }],
  },
};

const getUpdatedAmount = (state: MainState, newSwiperId: number) => {
  return getAmountOutputs(state, state.amountInput, newSwiperId || 0);
};

export const mainSlice = createSlice({
  name: "main",
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

    addPm: (
      state: MainState,
      action: PayloadAction<{ pm: IPm; side: ISide; index: number }>
    ) => {
      const { side, pm, index } = action.payload;
      const cur = state.p2p.dirs[index][side]?.[0].currency.code.toUpperCase();
      if (cur === pm.currency.code.toUpperCase())
        state.p2p.dirs[index][side] = [
          ...(state.p2p.dirs[index][side] || []),
          pm,
        ];
    },

    setPm: (
      state: MainState,
      action: PayloadAction<{ pm?: IPm; side: ISide; index?: number }>
    ) => {
      const { pm, index, side } = action.payload;
      if (!pm) {
        state.amountInput = undefined;
        state.amountOutputs = initialAmountOutputs;
        state.dirRates = undefined;
        return;
      } // опустошаем пм
      if (index !== undefined) {
        state.p2p.dirs[index][side] = [pm];
      }
      state[`${side}Pm`] = pm;
    },

    addEmptyDir: (state: MainState) => {
      state.p2p.dirs = state.p2p.dirs = [
        ...state.p2p.dirs.reduce((dirs: IP2PDir[], dir) => {
          return [...dirs, { ...dir, expanded: false }]; // close all prev
        }, []),
        { expanded: true, deleted: false }, // add and open new one
      ];
    },

    removeDir: (state: MainState, action: PayloadAction<number>) => {
      state.p2p.dirs[action.payload].deleted = true;
      if (state.p2p.dirs.length === 0) {
        state.p2p.dirs = [{ expanded: true, deleted: false }];
      }
    },

    triggerP2PDir: (state: MainState, action: PayloadAction<number>) => {
      state.p2p.dirs[action.payload].expanded =
        !state.p2p.dirs[action.payload].expanded;
    },

    clearPms: (state: MainState) => {
      state.getPm = undefined;
      state.givePm = undefined;
    },

    setSwiperIdVisible: (state: MainState, action: PayloadAction<number>) => {
      state.swiperIdVisible = action.payload;
      state.amountOutputs = getUpdatedAmount(state, action.payload);
    },
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
      if (
        state.currencyConverterRate?.giveToUSD &&
        state.currencyConverterRate?.getToUSD
      ) {
        [
          state.currencyConverterRate.giveToUSD,
          state.currencyConverterRate.getToUSD,
        ] = [
          state.currencyConverterRate?.getToUSD,
          state.currencyConverterRate?.giveToUSD,
        ];
      }

      state.amountOutputs = getUpdatedAmount(state, state.swiperIdVisible);
    },
    updateScrollLock: (state: MainState, action: PayloadAction<boolean>) => {
      state.isScrollLocked = action.payload;
    },

    triggerModal: (
      state: MainState,
      action: PayloadAction<string | undefined>
    ) => {
      state.modal = action.payload;
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

    setLocation: (state: MainState, action: PayloadAction<ILocation>) => {
      state.location = action.payload;
    },
    setCurrencyConverterRate: (
      state: MainState,
      action: PayloadAction<ICurrencyConverterRate>
    ) => {
      state.currencyConverterRate = action.payload;
    },
    setP2PUsersRate: (
      state: MainState,
      action: PayloadAction<{
        id: keyof IUsersRate;
        p2pDirIndex: number;
        value: string;
      }>
    ) => {
      const { id, p2pDirIndex, value } = action.payload;
      const usersRate = state.p2p.dirs[p2pDirIndex].usersRate!;
      const [_, startValue, endValue] = usersRate[id];
      state.p2p.dirs[p2pDirIndex].usersRate = {
        ...usersRate,
        [id]: [value, startValue, endValue],
      };
    },
  },
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  extraReducers: (builder) => {
    builder.addCase(fetchPms.fulfilled, (state, action) => {
      state.pms = action.payload.reduce((pms: IPm[], pointer) => {
        const pm = getPmByCode(pointer);
        return pm ? [...pms, pm] : pms;
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
    builder.addCase(fetchFiat.fulfilled, (state, action) => {
      state.bestRatesPreview = action.payload.fiatRates;
    });
    builder.addCase(fetchPossiblePairs.fulfilled, (state, action) => {
      if (action.payload.side === "give" && state.givePm)
        state.givePm.possible_pairs = action.payload.possiblePairs;
      if (action.payload.side === "get" && state.getPm)
        state.getPm.possible_pairs = action.payload.possiblePairs;
    });

    builder.addCase(fetchCurrencyConverterRate.fulfilled, (state, action) => {
      const { p2pDirIndex, data } = action.payload as {
        p2pDirIndex: number;
        data: ICurrencyConverterRate;
      };
      if (p2pDirIndex === undefined) {
        state.currencyConverterRate = data;
        return;
      }
      state.p2p.dirs[p2pDirIndex].currencyConverterRate = data;
      const { rate, giveToUSD, getToUSD } = data;
      const [defRate, toUsdRate, coefficient] =
        rate > 1 ? [rate, giveToUSD, 0.98] : [1 / rate, getToUSD, 1.02];

      const rateValues = [
        String(R(defRate * coefficient, 2)),
        R(defRate * (1 - rateSpread), 4),
        R(defRate * (1 + rateSpread), 4),
      ] as [string, number, number];

      const min = [
        String(R(toUsdRate * minDef, 5)),
        R(toUsdRate * minStart, 5),
        R(toUsdRate * minEnd, 5),
      ] as [string, number, number];

      const max = [
        String(R(toUsdRate * maxDef, 5)),
        R(toUsdRate * maxStart, 5),
        R(toUsdRate * maxEnd, 5),
      ] as [string, number, number];

      state.p2p.dirs[p2pDirIndex].usersRate = { rate: rateValues, min, max };
      state.p2p.dirs[p2pDirIndex].toUsdRate = toUsdRate;
      state.p2p.dirs[p2pDirIndex].defRate = defRate;
      state.p2p.dirs[p2pDirIndex].giveBiggerValueThanGet = giveToUSD > getToUSD;
    });

    // popular rates
    // builder.addCase(fetchPopularRates.pending, (state) => {
    //   state.pendingPopularRates = true;
    // });
    // builder.addCase(fetchPopularRates.fulfilled, (state, action) => {
    //   state.pendingPopularRates = false;
    //   state.popularRates = action.payload;
    // });
    builder.addCase(restorePmsFromSlug.fulfilled, (state, action) => {
      const { givePmGroup, getPmGroup, dir } = action.payload as {
        givePmGroup?: IPmGroup;
        getPmGroup?: IPmGroup;
        dir: string;
      };
      const [giveCode, getCode] = dir.split("_");
      if (giveCode && getCode && givePmGroup && getPmGroup) {
        state.givePm = getPmByCode({
          id: "",
          code: giveCode,
          pm_group: givePmGroup,
        });
        state.getPm = getPmByCode({
          id: "",
          code: getCode,
          pm_group: getPmGroup,
        });
      }
    });
  },
});

export const {
  setAmount,
  //setActiveSide,
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
  setLocation,
  setCurrencyConverterRate,
  addPm,
  addEmptyDir,
  removeDir,
  triggerP2PDir,
  setP2PUsersRate,
} = mainSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectAmounts = (state: RootState) => state.main;

export default mainSlice.reducer;
