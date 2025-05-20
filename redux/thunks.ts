import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPopularDirRates, IRate } from "../types/rates";
import axios from "axios";
import {
  TopParametersQuery,
  pmGroupsByNamesQuery,
  pmsQuery,
} from "../services/initialQueries";
import {
  initCMSFetcher,
  initCurrencyConverterFetcher,
  initParserFetcher,
} from "../services/fetchers";
import { MainState } from "./mainReducer";
import { IPm, IPmGroup, IPmPointer } from "../types/selector";
import { IOrder } from "../types/p2p";
import { createOrder, createUID, destructureDirSlug } from "./helper";
import { IToast } from "../types/general";
import {
  readLocalOrder,
  writeLocalOrder,
} from "../components/order/localStorageHandler";
import { OrderByUIDQuery } from "../components/order/queries";
import {
  UpdateOrderMutation,
  CreateOrderMutation,
} from "../components/order/step3/queries";

import { pmFromPmGroups } from "../components/main/side/selector/section/PmGroup/helper";
import { CreateRedirectMutation } from "../components/main/tv/queries";
import { ICity } from "../types/exchange";
//import { redirect } from "next/navigation";

// export async function navigate() {
//   redirect(`/posts`);
// }

type ISide = "give" | "get";
const env = process.env.NODE_ENV;
const courseFilterLink =
  env === "production"
    ? process.env.NEXT_PUBLIC_PARSER_PROD_URL
    : process.env.NEXT_PUBLIC_PARSER_DEV_URL;

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

const _fetchRates = async ({
  dir,
  cityName,
}: {
  dir: string;
  cityName?: string;
}) => {
  const response = await axios
    .get(`${courseFilterLink}/dir=${dir}/part/${cityName?.toLowerCase()}`)
    .catch((err) => console.error("could not fetch, ", err));
  return response?.data as IRate[];
};

export const fetchDirRates = createAsyncThunk(
  "rates/fetchDirRates",
  _fetchRates
);

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

  const fetcher = initCMSFetcher({ giveName, getName });
  const response = (await fetcher(pmGroupsByNamesQuery)) as {
    pmGroups: IPmGroup[];
  };

  const givePm = pmFromPmGroups(
    giveName,
    giveCurCode,
    giveSubgroupName,
    response.pmGroups
  );
  const getPm = pmFromPmGroups(
    getName,
    getCurCode,
    getSubgroupName,
    response.pmGroups
  );

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
      .get(`${courseFilterLink}/possible_pairs/${code}`)
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

export const fetchCity = createAsyncThunk(
  "initial/fetchCity",
  async (en_name: string) => {
    const fetcher = initParserFetcher();
    const response = await fetcher(`city=${en_name}`);
    return response as ICity;
  }
);

export const submitOrder = createAsyncThunk(
  "order/submitOrder",
  async (_, thunkAPI): Promise<IToast> => {
    const { main } = thunkAPI.getState() as { main: MainState };

    const uid = main.p2p.uid; // запрещаем создавать кучу ордеров с разных IP
    // если localStorage уже хранит uid и он отличается (ip другой) то не создатся
    let id = main.p2p.id; // уже существует
    const fingerprint = main.fingerprint;
    if (!fingerprint?.ip) return { title: "Network error", status: "error" };
    const uid_new = createUID(fingerprint);
    const order = createOrder(main.p2p, uid || uid_new);
    const orderNotChanged =
      JSON.stringify(order) == JSON.stringify(readLocalOrder());
    if (!order.dirs[0].defRate) {
      return { title: "Order is empty!", status: "warning" };
    }
    if (orderNotChanged) {
      return { title: "No changes!", status: "warning" };
    }
    if (!id) {
      // creating
      const fetcher = initCMSFetcher(order);
      const response = await fetcher(CreateOrderMutation);
      response?.createP2P?.id && writeLocalOrder(order);
      return { title: "Order was created!", status: "success" };
    }
    // updating
    const fetcher = initCMSFetcher({ id, ...order });
    await fetcher(UpdateOrderMutation);
    writeLocalOrder(order);
    return { title: "Order was updated!", status: "info" };
  }
);

export const getOrderByUID = createAsyncThunk(
  "order/getOrderByUID",
  async (uidFromLink: string | undefined, thunkAPI) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    const uidFromIP = createUID(main.fingerprint);
    const uid = uidFromLink || uidFromIP;
    const fetcher = initCMSFetcher({ uid });
    const response = await fetcher(OrderByUIDQuery);
    return response?.p2Ps?.[0] as IOrder | undefined;
  }
);

export const redirect = createAsyncThunk(
  "exchanger/redirect",
  async (_, thunkAPI) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    const currentRate = main?.dirRates?.[main.swiperIdVisible];
    const fetcher = initCMSFetcher({
      direction: `${main.givePm?.code}_${main.getPm?.code}`,
      give: +main.amountOutputs.give,
      get: +main.amountOutputs.get,
      id_related_to: currentRate?.exchangerId,
      isP2P: !!currentRate?.tag,
      ip: main.fingerprint?.ip,
    });

    await fetcher(CreateRedirectMutation);
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
