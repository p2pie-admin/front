import {
  IOrder,
  IP2PDir,
  IP2PRegulationCodes,
  IP2PRegulationGroup,
  IUsersRate,
} from "./../types/p2p";
import { IParameter, IPopularDirRates, IRate } from "./../types/rates";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";

import { AmountOutputs, AmountInput } from "../types/amount";

import { RootState } from "./store";
import {
  fetchDirRates,
  fetchPms,
  fetchPossiblePairs,
  restorePmsFromSlug,
  fetchCurrencyConverterRates,
  submitOrder,
  getOrderByUID,
  fetchTopParameters,
  fetchCity,
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
  convertP2PRatioToCourse,
  getDefaultRegulationCodes,
} from "./helper";
import Side from "../components/main/side";

import { getPmByCode } from "../components/main/side/selector/section/PmGroup/helper";
import { IFingerprint } from "../types/shared";
import { ICurrencyConverterRate } from "../types/p2p";
import { format, R } from "./amountsHelper";

import { IDirRatesStatus, IToast } from "../types/general";
import {
  readLocalOrder,
  writeLocalOrder,
} from "../components/order/localStorageHandler";
import { ICity } from "../types/exchange";

type ISide = "give" | "get";

const initialOrder = {
  uid: "",
  locations: [],
  dirs: [{ expanded: true, deleted: false }],
};

const defaultCity = {
  codes: ["MOS", "MOW"],
  en_name: "Moscow",
  ru_name: "Москва",
  population: 6,
  coordinates: [55.7558, 37.6176],
  preposition: "Москве",
  closest_cities: [{ en_name: "Saint-Petersburg", ru_name: "Санкт-Петербург" }],
  en_country_name: "Russia",
  ru_country_name: "Россия",
} as ICity;

export interface MainState {
  searchBarInputValue: string;
  givePm?: IPm;
  getPm?: IPm;
  dirRates?: IRate[]; //  uniqueRates + bestRates
  dirRatesStatus: IDirRatesStatus;
  amountInput?: AmountInput;
  amountOutputs: AmountOutputs;
  swiperIdVisible: number;
  activePopularSide?: string;
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
  p2p: IOrder;
  fingerprint?: IFingerprint;
  topParameters: IParameter[];
}

const initialState: MainState = {
  searchBarInputValue: "",
  dirRatesStatus: "fulfilled",
  amountOutputs: initialAmountOutputs,
  swiperIdVisible: 1,
  pms: [],
  isScrollLocked: false,
  bestRatesPreview: {},
  pendingPopularRates: false,
  toast: { title: "", status: "info" },
  city: defaultCity,
  p2p: initialOrder,
  topParameters: [],
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

    setPopularCompleted: (
      state: MainState,
      action: PayloadAction<ISide | undefined>
    ) => {
      state.popularCompleted = action.payload;
    },

    addPmP2P: (
      state: MainState,
      action: PayloadAction<{ pm: IPm; side: ISide; index: number }>
    ) => {
      const { side, pm, index } = action.payload;
      const pms = state.p2p.dirs[index][side];
      const cur = state.p2p.dirs[index][side]?.[0].currency.code.toUpperCase();
      if (
        cur === pm.currency.code.toUpperCase() &&
        pms &&
        !pms.find((p) => p.code === pm.code)
      )
        state.p2p.dirs[index][side] = [
          ...(state.p2p.dirs[index][side] || []),
          pm,
        ];
    },

    setPmP2P: (
      state: MainState,
      action: PayloadAction<{ pm: IPm; side: ISide; index: number }>
    ) => {
      const { pm, side, index } = action.payload;
      state.p2p.dirs[index][side] = [pm];
    },
    setPm: (
      state: MainState,
      action: PayloadAction<{ pm?: IPm; side: ISide; shaded?: boolean }>
    ) => {
      const { pm, side, shaded } = action.payload;
      if (shaded) {
        const oppositeSide = side === "get" ? "give" : "get";
        state[`${oppositeSide}Pm`] = undefined;
        state.amountInput = undefined;
        state.amountOutputs = getAmountOutputs(state, 1);
      }
      state.dirRates = undefined;
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

    // свайпаем
    setSwiperIdVisible: (state: MainState, action: PayloadAction<number>) => {
      state.swiperIdVisible = action.payload;
      state.amountOutputs = getAmountOutputs(state, action.payload);
    },

    // вводим свои числа
    setAmount: (
      state: MainState,
      action: PayloadAction<AmountInput | undefined>
    ) => {
      state.amountInput = action.payload;
      // if (!action.payload) return;
      // const { side, str } = action.payload;
      // state.amountOutputs =
      //   side === "give" ? { give: str, get: "" } : { give: "", get: str };
      // if (state.givePm?.code && state.getPm?.code) {
      state.amountOutputs = getAmountOutputs(
        state,
        state.swiperIdVisible,
        action.payload
      );
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
      if (state.ccRates?.giveToUSD && state.ccRates?.getToUSD) {
        [state.ccRates.giveToUSD, state.ccRates.getToUSD] = [
          state.ccRates?.getToUSD,
          state.ccRates?.giveToUSD,
        ];
      }

      state.amountOutputs = getAmountOutputs(state, 1);
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
      // if (state.swiperIdVisible == length - 1) {
      //   state.swiperIdVisible = 0;
      //   state.amountOutputs = getAmountOutputs(state, 0);
      //   return;
      // }
      const newSwiperId = state.swiperIdVisible + 1;
      state.swiperIdVisible = newSwiperId;
      state.amountOutputs = getAmountOutputs(state, newSwiperId);
    },

    decrementSwiper: (state: MainState) => {
      const length = state.dirRates?.length || 0;
      if (!length) return;
      // if (state.swiperIdVisible == 0) {
      //   state.swiperIdVisible = length - 1;
      //   state.amountOutputs = getAmountOutputs(state, length - 1);
      //   return;
      // }
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
    // addLocation: (state: MainState, action: PayloadAction<ILocation>) => {
    //   if (state.p2p.locations.find((l) => l.code == action.payload.code)) {
    //     state.p2p.locations = state.p2p.locations.filter(
    //       (l) => l.code !== action.payload.code
    //     );
    //     return;
    //   }
    //   state.p2p.locations = [...state.p2p.locations, action.payload];
    // },

    setCurrencyConverterRate: (
      state: MainState,
      action: PayloadAction<ICurrencyConverterRate>
    ) => {
      state.ccRates = action.payload;
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
    initDefaultRegulationCodes: (
      state: MainState,
      action: PayloadAction<IP2PRegulationGroup[]>
    ) => {
      if (state.p2p.regulationCodes) return;
      state.p2p.regulationCodes = getDefaultRegulationCodes(action.payload);
    },
    setRegulation: (
      state: MainState,
      action: PayloadAction<[string, boolean]>
    ) => {
      const [code, checked] = action.payload;
      if (state.p2p.regulationCodes?.[code] !== undefined)
        state.p2p.regulationCodes[code] = checked;
    },

    getSavedOrders: (state: MainState) => {
      const savedOrders = readLocalOrder();
      if (savedOrders && Object.keys(savedOrders).length) {
        state.p2p = savedOrders;
      }
    },
    setIP: (state: MainState, action: PayloadAction<string | undefined>) => {
      if (action.payload)
        state.fingerprint = { ...state.fingerprint, ip: action.payload };
    },
    clearDirRates: (state: MainState) => {
      state.dirRates = [];
      state.dirRatesStatus = "pending";
    },

    clean: (state: MainState) => {
      // когда уходим на главную
      state.dirRates = undefined;
      state.givePm = undefined;
      state.getPm = undefined;
      state.amountInput = undefined;
      state.amountOutputs = getAmountOutputs(state, 1);
      state.swiperIdVisible = 1;
    },
    setInitialData: (
      state: MainState,
      action: PayloadAction<{
        givePm: IPm;
        getPm: IPm;
        city?: ICity;
      }>
    ) => {
      state.dirRatesStatus = "pending";
      const { givePm, getPm, city } = action.payload;
      state.givePm = givePm;
      state.getPm = getPm;
      if (city) state.city = city;
    },
    sendToast: (state: MainState, action: PayloadAction<IToast>) => {
      state.toast = action.payload;
    },
    setDirRatesStatus: (
      state: MainState,
      action: PayloadAction<IDirRatesStatus>
    ) => {
      state.dirRatesStatus = action.payload;
    },
    // setCities: (state: MainState, action: PayloadAction<ICities>) => {
    //   state.cities = action.payload;
    // },
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

    builder.addCase(fetchDirRates.rejected, (state) => {
      state.dirRatesStatus = "rejected";
    });

    builder.addCase(fetchDirRates.fulfilled, (state, action) => {
      if (!action.payload) {
        // если не получены курсы, парсер не отвечает вовсе
        state.dirRatesStatus = "rejected";
        return;
      }
      state.dirRates = convertP2PRatioToCourse(
        // прослойка чтобы превратить курсы p2p в реальное число
        action.payload,
        state.ccRates
      );
      // cleaning
      state.amountInput = undefined;
      state.amountOutputs = getAmountOutputs(state, 1);
      state.dirRatesStatus = "fulfilled";
      state.swiperIdVisible = 1;
    });

    builder.addCase(fetchPossiblePairs.fulfilled, (state, action) => {
      if (action.payload.side === "give" && state.givePm)
        state.givePm.possible_pairs = action.payload.possiblePairs;
      if (action.payload.side === "get" && state.getPm)
        state.getPm.possible_pairs = action.payload.possiblePairs;
    });

    builder.addCase(fetchCurrencyConverterRates.fulfilled, (state, action) => {
      const { p2pDirIndex, data } = action.payload as {
        p2pDirIndex: number;
        data: ICurrencyConverterRate;
      };
      if (p2pDirIndex === undefined) {
        state.ccRates = data;
        return;
      }
      state.p2p.dirs[p2pDirIndex].ccRates = data;
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

    builder.addCase(submitOrder.rejected, (state, _) => {
      writeLocalOrder(); // чистим localStorage
      state.p2p = initialOrder;
      state.toast = { title: "Failed!", status: "error" };
    });

    builder.addCase(submitOrder.fulfilled, (state, action) => {
      state.toast = action.payload;
    });

    builder.addCase(fetchTopParameters.fulfilled, (state, action) => {
      state.topParameters = action.payload?.topParameters || [];
    });

    builder.addCase(getOrderByUID.fulfilled, (state, action) => {
      if (action.payload && action.payload.uid) state.p2p = action.payload;
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
  setPmP2P,
  setPm,
  setSearchBarInputValue,
  setSwiperIdVisible,
  reverseDir,
  updateScrollLock,
  setActivePetal,
  setPopularCompleted,
  triggerModal,
  incrementSwiper,
  decrementSwiper,
  setCity,

  setCurrencyConverterRate,
  addPmP2P,
  addEmptyDir,
  removeDir,
  triggerP2PDir,
  setP2PUsersRate,
  initDefaultRegulationCodes,
  setRegulation,
  getSavedOrders,
  setIP,
  setInitialData,
  clearDirRates,
  clean,
  sendToast,
  setDirRatesStatus,
} = mainSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectAmounts = (state: RootState) => state.main;

export default mainSlice.reducer;
