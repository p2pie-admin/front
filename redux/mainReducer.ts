import { IParameter, IPopularDirRates, IRate } from "./../types/rates";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";

import {
  fetchDirRates,
  updateDirRates,
  fetchPms,
  fetchPossiblePairs,
  restorePmsFromSlug,
  fetchCurrencyConverterRates,
  fetchTopParameters,
  fetchCity,
} from "./thunks";
import type { DirRatesReloadTrigger } from "./thunks";
import { IPm, IPmGroup } from "../types/selector";
import { IActivePetal, IDir } from "../types/dir";
import { initialAmountOutputs, getAmountOutputs } from "./helper";

import { getPmByCode } from "../components/main/side/selector/section/PmGroup/helper";
import { ICurrencyConverterRate, IFingerprint } from "../types/shared";

import { format, R } from "./amountsHelper";

import { ILoadingStatus, IToast } from "../types/general";

import { ICity } from "../types/exchange";
import { IMassSort } from "../types/mass";

type ISide = "give" | "get";

const initialOrder = {
  uid: "",
  locations: [],
  dirs: [{ expanded: true, deleted: false }],
};

const defaultCity = {
  codes: ["MSK"],
  en_name: "Moscow",
  ru_name: "Москва",
  population: 6,
  coordinates: [55.7558, 37.6176],
  preposition: "Москве",
  closest_cities: [{ en_name: "Saint-Petersburg", ru_name: "Санкт-Петербург" }],
  en_country_name: "Russia",
  ru_country_name: "Россия",
} as ICity;

const normalizeCityKey = (value?: string | null) =>
  value ? value.trim().toLowerCase() : "";

const getCurrencyPair = (state: MainState) => {
  const give = state.givePm?.currency?.code;
  const get = state.getPm?.currency?.code;
  if (!give || !get) return;
  return `${give}_${get}`.toUpperCase();
};

const reverseCurrencyPair = (pair?: string) => {
  if (!pair) return;
  const [left, right] = pair.split("_");
  if (!left || !right) return;
  return `${right}_${left}`.toUpperCase();
};

const applyCityRateOverride = (rate: IRate, cityKey?: string) => {
  if (!cityKey) return rate;
  const override = rate.cityRates?.[cityKey]?.rate;
  if (!override) return rate;
  const merged = { ...rate, ...override };
  merged.cityRates = rate.cityRates;
  return merged;
};

export interface MainState {
  searchBarInputValue: string;
  givePm?: IPm;
  getPm?: IPm;
  p2pDirections: { givePm?: IPm; getPm?: IPm }[];
  dirRates?: IRate[]; //  uniqueRates + bestRates
  dirRatesReloadTrigger?: DirRatesReloadTrigger;
  amountInput?: AmountInput;
  amountOutputs: AmountOutputs;
  swiperIdVisible: number;
  side: string;
  selectedPopular?: IPm;
  pms: IPm[];
  popularCompleted?: ISide;
  isScrollLocked: boolean;
  activePetal?: IActivePetal;
  bestRatesPreview: { [key: string]: string };
  pendingPopularRates: boolean;
  popularRates?: IPopularDirRates;
  modal?: string;
  toast: IToast;
  city: ICity;
  ccRates?: ICurrencyConverterRate;
  ccRatesPair?: string;
  fingerprint?: IFingerprint;
  topParameters: IParameter[];
  massPmsFilter: string[];
  massAmount: { value: string; code?: string };
  massSort: IMassSort;
  massSelectorSlug: string;
  loading: ILoadingStatus;
  p2pCoordinates?: [number, number];
}

const initialState: MainState = {
  searchBarInputValue: "",
  p2pDirections: [],
  side: "get",
  loading: "fulfilled",
  dirRatesReloadTrigger: "manual",
  amountOutputs: initialAmountOutputs,
  swiperIdVisible: 0,
  pms: [],
  isScrollLocked: false,
  bestRatesPreview: {},
  pendingPopularRates: false,
  toast: { title: "", status: "info" },
  city: defaultCity,
  topParameters: [],
  massPmsFilter: [],
  massAmount: { value: "" },
  massSort: { key: "course", direction: "asc" },
  massSelectorSlug: "/sell/btc-for-rub",
};

export const mainSlice = createSlice({
  name: "main",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSearchBarInputValue: (
      state: MainState,
      action: PayloadAction<string>,
    ) => {
      state.searchBarInputValue = action.payload;
    },

    setPopularCompleted: (
      state: MainState,
      action: PayloadAction<ISide | undefined>,
    ) => {
      state.popularCompleted = action.payload;
    },
    setP2PCoordinates: (
      state: MainState,
      action: PayloadAction<[number, number] | undefined>,
    ) => {
      state.p2pCoordinates = action.payload;
    },

    setPm: (
      state: MainState,
      action: PayloadAction<{ pm?: IPm; side: ISide; shaded?: boolean }>,
    ) => {
      const { pm, side, shaded } = action.payload;
      const prevPair = getCurrencyPair(state);
      if (shaded) {
        const oppositeSide = side === "get" ? "give" : "get";
        state[`${oppositeSide}Pm`] = undefined;
        state.amountInput = undefined;
        state.amountOutputs = getAmountOutputs(state, 1);
      }
      state.dirRates = undefined;
      state[`${side}Pm`] = pm;
      const nextPair = getCurrencyPair(state);
      if (prevPair !== nextPair) {
        state.ccRates = undefined;
        state.ccRatesPair = undefined;
      }
    },
    addP2PDirection: (state: MainState) => {
      state.p2pDirections.push({ givePm: undefined, getPm: undefined });
    },
    setP2PDirections: (
      state: MainState,
      action: PayloadAction<{ givePm?: IPm; getPm?: IPm }[]>,
    ) => {
      state.p2pDirections = action.payload;
    },
    setP2PDirectionPm: (
      state: MainState,
      action: PayloadAction<{ index: number; side: ISide; pm?: IPm }>,
    ) => {
      const { index, side, pm } = action.payload;
      if (!state.p2pDirections[index]) {
        state.p2pDirections[index] = { givePm: undefined, getPm: undefined };
      }
      state.p2pDirections[index][`${side}Pm`] = pm;
    },

    // свайпаем
    setSwiperIdVisible: (state: MainState, action: PayloadAction<number>) => {
      state.swiperIdVisible = action.payload;
      state.amountOutputs = getAmountOutputs(state, action.payload);
    },

    // вводим свои числа
    setAmount: (
      state: MainState,
      action: PayloadAction<AmountInput | undefined>,
    ) => {
      state.amountInput = action.payload;
      state.amountOutputs = getAmountOutputs(
        state,
        state.swiperIdVisible,
        action.payload,
      );
    },

    setSide: (state: MainState, action: PayloadAction<string>) => {
      state.side = action.payload;
    },
    reverseDir: (state: MainState) => {
      [state.givePm, state.getPm] = [state.getPm, state.givePm];
      if (state.ccRates?.giveToUSD && state.ccRates?.getToUSD) {
        [state.ccRates.giveToUSD, state.ccRates.getToUSD] = [
          state.ccRates?.getToUSD,
          state.ccRates?.giveToUSD,
        ];
      }
      if (state.ccRates?.currentRate) {
        state.ccRates.currentRate = 1 / state.ccRates.currentRate;
        state.ccRates.dayTrend = -state.ccRates.dayTrend;
        state.ccRates.hourTrend = -state.ccRates.hourTrend;
      }
      state.ccRatesPair = reverseCurrencyPair(state.ccRatesPair);
      state.amountOutputs = getAmountOutputs(state, 1);
    },
    updateScrollLock: (state: MainState, action: PayloadAction<boolean>) => {
      state.isScrollLocked = action.payload;
    },

    triggerModal: (
      state: MainState,
      action: PayloadAction<string | undefined>,
    ) => {
      state.modal = action.payload;
    },
    setActivePetal: (
      state: MainState,
      action: PayloadAction<IActivePetal | undefined>,
    ) => {
      state.activePetal = action.payload;
    },
    incrementSwiper: (state: MainState) => {
      const length = state.dirRates?.length || 0;
      if (!length) return;
      const newSwiperId = state.swiperIdVisible + 1;
      state.swiperIdVisible = newSwiperId;
      state.amountOutputs = getAmountOutputs(state, newSwiperId);
    },

    decrementSwiper: (state: MainState) => {
      const length = state.dirRates?.length || 0;
      if (!length) return;
      const newSwiperId = state.swiperIdVisible - 1;
      state.swiperIdVisible = newSwiperId;
      state.amountOutputs = getAmountOutputs(state, newSwiperId);
    },

    setCity: (state: MainState, action: PayloadAction<ICity>) => {
      const { en_name } = action.payload;
      if (!en_name) {
        state.city = defaultCity;
        return;
      }
      state.city = action.payload;
    },

    setCurrencyConverterRate: (
      state: MainState,
      action: PayloadAction<ICurrencyConverterRate>,
    ) => {
      state.ccRates = action.payload;
      state.ccRatesPair = undefined;
    },

    setIP: (state: MainState, action: PayloadAction<string | undefined>) => {
      if (action.payload)
        state.fingerprint = { ...state.fingerprint, ip: action.payload };
    },
    setFingerprintHash: (
      state: MainState,
      action: PayloadAction<string | undefined>,
    ) => {
      if (action.payload)
        state.fingerprint = {
          ...state.fingerprint,
          fingerprint: action.payload,
        };
    },
    setUserAgent: (
      state: MainState,
      action: PayloadAction<string | undefined>,
    ) => {
      if (action.payload)
        state.fingerprint = {
          ...state.fingerprint,
          userAgent: action.payload,
        };
    },
    clearDirRates: (state: MainState) => {
      state.dirRates = [];
      state.loading = "pending";
    },

    clean: (state: MainState) => {
      // когда уходим на главную
      state.dirRates = undefined;
      state.givePm = undefined;
      state.getPm = undefined;
      state.amountInput = undefined;
      state.amountOutputs = getAmountOutputs(state, 1);
      state.swiperIdVisible = 1;
      state.dirRatesReloadTrigger = "manual";
    },
    setInitialData: (
      state: MainState,
      action: PayloadAction<{
        givePm: IPm;
        getPm: IPm;
        city: ICity | null;
      }>,
    ) => {
      state.loading = "pending";
      const { givePm, getPm, city } = action.payload;
      state.givePm = givePm;
      state.getPm = getPm;
      if (city) state.city = city;
    },
    sendToast: (state: MainState, action: PayloadAction<IToast>) => {
      state.toast = action.payload;
    },
    setLoadingStatus: (
      state: MainState,
      action: PayloadAction<ILoadingStatus>,
    ) => {
      state.loading = action.payload;
    },
    setMassPmsFilter: (state: MainState, action: PayloadAction<string[]>) => {
      state.massPmsFilter = action.payload;
    },
    setMassAmount: (
      state: MainState,
      action: PayloadAction<{ value: string; code?: string }>,
    ) => {
      state.massAmount = action.payload;
    },
    setMassSelectorSlug: (state: MainState, action: PayloadAction<string>) => {
      state.massSelectorSlug = action.payload;
    },

    setMassSort: (
      state: MainState,
      action: PayloadAction<IMassSort["key"]>,
    ) => {
      state.massSort.key = action.payload;
      const oldDirection = state.massSort.direction as IMassSort["direction"];
      state.massSort.direction = oldDirection == "asc" ? "desc" : "asc";
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

    builder.addCase(fetchCity.fulfilled, (state, action) => {
      state.city = action.payload;
      state.modal = undefined;
    });

    builder.addCase(fetchDirRates.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(fetchDirRates.rejected, (state) => {
      state.loading = "rejected";
    });

    builder.addCase(updateDirRates.pending, (state) => {
      state.loading = "pending";
    });

    builder.addCase(updateDirRates.rejected, (state) => {
      state.loading = "rejected";
    });

    builder.addCase(fetchDirRates.fulfilled, (state, action) => {
      if (!action.payload) {
        // если не получены курсы, парсер не отвечает вовсе
        state.loading = "rejected";
        return;
      }
      const cityKey = normalizeCityKey(action.meta.arg?.cityName);
      const rates = cityKey
        ? action.payload.map((rate) => applyCityRateOverride(rate, cityKey))
        : action.payload;
      const sortedRates = rates.slice().sort((a, b) => a.course - b.course);
      state.dirRates = sortedRates;
      state.amountInput = undefined;
      state.loading = "fulfilled";
      state.dirRatesReloadTrigger = "auto";
      const currentIndex = state.swiperIdVisible ?? 0;
      state.amountOutputs = getAmountOutputs(
        state,
        currentIndex,
        undefined,
        false,
      );
    });

    builder.addCase(updateDirRates.fulfilled, (state, action) => {
      if (!action.payload) {
        state.loading = "rejected";
        return;
      }
      const cityKey = normalizeCityKey(action.meta.arg?.cityName);
      const rates = cityKey
        ? action.payload.map((rate) => applyCityRateOverride(rate, cityKey))
        : action.payload;
      const sortedRates = rates.slice().sort((a, b) => a.course - b.course);
      state.dirRates = sortedRates;
      state.loading = "fulfilled";
      state.dirRatesReloadTrigger = "manual";
      const targetIndex = 0;
      const keepAmount = !!action.meta.arg?.keepAmount;
      state.amountInput = keepAmount ? state.amountInput : undefined;
      state.amountOutputs = getAmountOutputs(
        state,
        targetIndex,
        keepAmount ? state.amountInput : undefined,
        keepAmount,
      );
      state.swiperIdVisible = targetIndex;
    });

    builder.addCase(fetchPossiblePairs.fulfilled, (state, action) => {
      if (action.payload.side === "give" && state.givePm)
        state.givePm.possible_pairs = action.payload.possiblePairs;
      if (action.payload.side === "get" && state.getPm)
        state.getPm.possible_pairs = action.payload.possiblePairs;
    });

    builder.addCase(fetchCurrencyConverterRates.fulfilled, (state, action) => {
      const { data } = action.payload as {
        data: ICurrencyConverterRate;
      };
      const pair = action.meta.arg?.curPair;
      const fetchedPair = pair ? pair.toUpperCase() : undefined;
      const expectedPair = getCurrencyPair(state);
      if (!fetchedPair || !expectedPair || fetchedPair !== expectedPair) return;
      state.ccRates = data;
      state.ccRatesPair = fetchedPair;
    });
    builder.addCase(fetchTopParameters.fulfilled, (state, action) => {
      state.topParameters = action.payload || [];
    });

    builder.addCase(restorePmsFromSlug.fulfilled, (state, action) => {
      const { givePm, getPm } = action.payload as {
        givePm?: IPm;
        getPm?: IPm;
      };

      state.givePm = givePm;
      state.getPm = getPm;
    });
  },
});

export const {
  setAmount,
  setSide,
  setPm,
  addP2PDirection,
  setP2PDirections,
  setP2PDirectionPm,
  setSearchBarInputValue,
  setSwiperIdVisible,
  reverseDir,
  updateScrollLock,
  setActivePetal,
  setPopularCompleted,
  setP2PCoordinates,
  triggerModal,
  incrementSwiper,
  decrementSwiper,
  setCity,
  setCurrencyConverterRate,
  setIP,
  setFingerprintHash,
  setUserAgent,
  setInitialData,
  clearDirRates,
  clean,
  sendToast,
  setLoadingStatus,
  setMassPmsFilter,
  setMassAmount,
  setMassSort,
  setMassSelectorSlug,
} = mainSlice.actions;

export default mainSlice.reducer;
