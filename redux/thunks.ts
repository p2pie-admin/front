import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPopularDirRates, IRate } from "../types/rates";
import axios from "axios";
import {
  TopParametersQuery,
  pmGroupsByNamesQuery,
  pmsQuery,
} from "../services/queries";
import {
  initCMSFetcher,
  initCurrencyConverterFetcher,
  initParserFetcher,
} from "../services/fetchers";
import { MainState } from "./mainReducer";
import { IPm, IPmGroup, IPmPointer } from "../types/selector";

import { destructureDirSlug } from "./helper";
import { IToast } from "../types/general";

import { pmFromPmGroups } from "../components/main/side/selector/section/PmGroup/helper";
import { CreateRedirectMutation } from "../components/exchange/tv/queries";
import { ICity } from "../types/exchange";
import { serverLinkPROD, serverLinkDEV } from "../services/utils";
//import { redirect } from "next/navigation";

// export async function navigate() {
//   redirect(`/posts`);
// }

type ISide = "give" | "get";
const env = process.env.NODE_ENV;
const courseFilterLink = env === "production" ? serverLinkPROD : serverLinkDEV;

// export const fetchFiat = createAsyncThunk("initial/fetchFiat", async () => {
//   const response = await axios
//     .get(`${process.env.NEXT_PUBLIC_COINGECKO_URL}/`)
//     .catch((err) => console.error("ERROR: ", err));
//   const fiatRates = response?.data;
//   return {
//     fiatRates,
//   };
// });

// export const fetchAllDirRates = createAsyncThunk(
//   "rates/fetchAllDirRates",
//   async (dir: string) => {
//     const response = await axios
//       .get(`${courseFilterLink}/dir=${dir}/type=all`)
//       .catch((err) => console.error(err));
//     return response?.data as IRate[];
//   }
// );

export type DirRatesReloadTrigger = "auto" | "manual";

type FetchDirRatesArgs = {
  dir: string;
  cityName?: string;
};

type UpdateDirRatesArgs = FetchDirRatesArgs & {
  keepAmount?: boolean;
};

const _fetchRates = async ({ dir, cityName }: FetchDirRatesArgs) => {
  //const isCash = (dir.split("_")[0].startsWith("CASH") || dir.split("_")[1].startsWith("CASH"));
  const link = `${courseFilterLink}/dir=${dir}/all/${cityName?.toLowerCase()}`;

  const response = await axios
    .get(link)
    .catch((err) => console.error("could not fetch, ", err));
  return response?.data as IRate[];
};

export const fetchDirRates = createAsyncThunk<
  IRate[] | undefined,
  FetchDirRatesArgs
>("rates/fetchDirRates", _fetchRates);

export const updateDirRates = createAsyncThunk<
  IRate[] | undefined,
  UpdateDirRatesArgs
>("rates/updateDirRates", _fetchRates);

export const fetchTopParameters = createAsyncThunk(
  "rates/fetchTopParameters",
  async () => {
    const fetcher = initCMSFetcher();
    return await fetcher(TopParametersQuery);
  }
);

export const fetchCCRates = async ({
  curPair, // not dir but BTC_RUB
  p2pDirIndex,
}: {
  curPair: string;
  p2pDirIndex?: number;
}) => {
  const fetcher = initCurrencyConverterFetcher(p2pDirIndex);
  return await fetcher(curPair);
};

export const fetchCurrencyConverterRates = createAsyncThunk(
  "order/fetchCurrencyConverterRates",
  fetchCCRates
);
// export const fetchDirRates = createAsyncThunk(
//   "rates/fetchDirRates",
//   async (
//     { dir, code, side }: { dir?: string; code?: string; side?: ISide },
//     thunkAPI
//   ) => {
//     const { main } = thunkAPI.getState() as { main: MainState };
//     // dir не успевает записаться в redux до вызова fetchDirRates, поэтому нужно передать последний выбранный code

//     const _dir = dir
//       ? dir
//       : !code
//       ? `${main.givePm?.code}_${main.getPm?.code}`
//       : side === "give"
//       ? `${code.toUpperCase()}_${main.getPm?.code}`
//       : side === "get"
//       ? `${main.givePm?.code}_${code.toUpperCase()}`
//       : "";

//     const response = await axios
//       .get(`${courseFilterLink}/dir=${_dir}/type=tops+p2p`)
//       .catch((err) => console.error("could not fetch, ", err));
//     return response?.data as IRate[];
//   }
// );

export const restoreFromSlug = async (
  slug: string
): Promise<{ givePm?: IPm; getPm?: IPm }> => {
  // ex: bitcoin-to-cash-rub
  // ex: tinkoff-rub-to-tether-usdt-trc20
  const {
    giveName,
    giveCurCode,
    giveSubgroupName,
    getName,
    getCurCode,
    getSubgroupName,
  } = destructureDirSlug(slug);

  const fetcher = initCMSFetcher();
  const pmGroups = (await fetcher(pmGroupsByNamesQuery, {
    giveName,
    getName,
  })) as IPmGroup[];

  const givePm = pmFromPmGroups(
    giveName,
    giveCurCode,
    giveSubgroupName,
    pmGroups
  );
  const getPm = pmFromPmGroups(getName, getCurCode, getSubgroupName, pmGroups);

  return {
    givePm,
    getPm,
  };
};

export const restorePmsFromSlug = createAsyncThunk(
  "rates/restorePmsFromSlug",
  (slug: string) => restoreFromSlug(slug)
) as any;

export const fetchPossiblePairs = createAsyncThunk(
  "currencies/fetchPossiblePairs",
  async ({ code, side }: { code: string; side: ISide }) => {
    const response = await axios
      .get(`${courseFilterLink}/possible_pairs/${side}/${code}`)
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
  return (await fetcher(pmsQuery)) as IPmPointer[];
});

export const fetchCity = createAsyncThunk(
  "initial/fetchCity",
  async (en_name: string) => {
    const fetcher = initParserFetcher();
    const response = await fetcher(`city=${en_name}`);
    return response as ICity;
  }
);

export const redirect = createAsyncThunk(
  "exchanger/redirect",
  async (_, thunkAPI) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    const currentRate = main?.dirRates?.[main.swiperIdVisible];
    const fetcher = initCMSFetcher();

    await fetcher(CreateRedirectMutation, {
      direction: `${main.givePm?.code}_${main.getPm?.code}`,
      give: +main.amountOutputs.give,
      get: +main.amountOutputs.get,
      id_related_to: currentRate?.exchangerId,
      ip: main.fingerprint?.ip,
    });
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
