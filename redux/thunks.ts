import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPopularDirRates, IRate } from "../types/rates";
import axios from "axios";

import { pmGroupQuery, pmsQuery } from "../services/initialQueries";
import {
  initCMSFetcher,
  initCurrencyConverterFetcher,
} from "../services/fetchers";
import { MainState } from "./mainReducer";
import { IPmPointer } from "../types/selector";
import side from "../components/main/side";
import { CreateOrderMutation } from "../pages/order/step3/queries";
import { IOrder } from "../types/p2p";
import { writeOrders } from "../pages/order/localStorageHandler";

type ISide = "give" | "get";
const env = process.env.NODE_ENV;
const courseFilterLink =
  env === "production"
    ? process.env.NEXT_PUBLIC_COURSE_FILTER_PROD_URL
    : process.env.NEXT_PUBLIC_COURSE_FILTER_DEV_URL;

export const fetchFiat = createAsyncThunk("initial/fetchFiat", async () => {
  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_COINGECKO_URL}/`)
    .catch((err) => console.error("ERROR: ", err));
  const fiatRates = response?.data;
  return {
    fiatRates,
  };
});

export const fetchAllDirRates = createAsyncThunk(
  "rates/fetchAllDirRates",
  async (dir: string) => {
    const response = await axios
      .get(`${courseFilterLink}/dir=${dir}/type=all`)
      .catch((err) => console.error(err));
    return response?.data as IRate[];
  }
);

export const fetchDirRates = createAsyncThunk(
  "rates/fetchDirRates",
  async (
    { dir, code, side }: { dir?: string; code?: string; side?: ISide },
    thunkAPI
  ) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    // dir не успевает записаться в redux до вызова fetchDirRates, поэтому нужно передать последний выбранный code

    const _dir = dir
      ? dir
      : !code
      ? `${main.givePm?.code}_${main.getPm?.code}`
      : side === "give"
      ? `${code.toUpperCase()}_${main.getPm?.code}`
      : side === "get"
      ? `${main.givePm?.code}_${code.toUpperCase()}`
      : "";

    const response = await axios
      .get(`${courseFilterLink}/dir=${_dir}/type=tops+p2p`)
      .catch((err) => console.error("could not fetch, ", err));
    return response?.data as IRate[];
  }
);

export const restorePmsFromSlug = createAsyncThunk(
  "rates/restorePmsFromSlug",
  async ({ dir, pm_groups }: { dir: string; pm_groups: string }) => {
    const ids = pm_groups.split("_");
    const fetcher0 = initCMSFetcher({ id: ids[0] });
    const fetcher1 = initCMSFetcher({ id: ids[1] });
    const response0 = await fetcher0(pmGroupQuery);
    const response1 = await fetcher1(pmGroupQuery);
    return {
      givePmGroup: response0?.pmGroup,
      getPmGroup: response1?.pmGroup,
      dir,
    };
  }
);

export const fetchPossiblePairs = createAsyncThunk(
  "currencies/fetchPossiblePairs",
  async ({ code, side }: { code: string; side: ISide }) => {
    const response = await axios
      .get(`${courseFilterLink}/possible_pairs/code=${code}`)
      .catch((err) => console.error(err));
    const possiblePairs = response?.data as string[];
    return {
      possiblePairs,
      side,
    };
  }
);

export const fetchPms = createAsyncThunk("initial/fetchPms", async () => {
  const fetcher = initCMSFetcher();
  const response = await fetcher(pmsQuery);
  return response?.pms as IPmPointer[];
});

export const fetchCurrencyConverterRate = createAsyncThunk(
  "p2p/fetchCurrencyConverterRate",
  async ({ dir, p2pDirIndex }: { dir: string; p2pDirIndex?: number }) => {
    const fetcher = initCurrencyConverterFetcher(p2pDirIndex);
    return await fetcher(dir);
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (uid: String, thunkAPI) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    const { dirs, regulationCodes, locations } = main.p2p;
    const order = {
      uid,
      status: "suspended",
      dirs,
      regulationCodes,
      locations,
      info: "",
      orderSent: true,
    } as IOrder;

    writeOrders(order); // to localStorage

    const fetcher = initCMSFetcher();
    const response = await fetcher(CreateOrderMutation);
    return response?.createP2P as IPmPointer[];
  }
);

// export const fetchPms = createAsyncThunk("initial/fetchPms", async () => {
//   const fetcher = initCMSFetcher();
//   const response = await fetcher(pmsQuery);
//   return response?.pms as IPmPointer[];
// });

// export const fetchPopularRates = createAsyncThunk(
//   "rates/fetchPopularRates",
//   async () => {
//     const response = await axios
//       .get(`${courseFilterLink}/popular_rates`)
//       .catch((err) => console.error(err));
//     return response?.data as IPopularDirRates;
//   }
// );
// export const reverseDir = createAsyncThunk(
//   "rates/reverseDir",
//   async (r: string, thunkAPI) => {
//     thunkAPI.dispatch(setPm())
//   }
// );
