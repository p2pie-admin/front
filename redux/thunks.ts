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
import {
  CreateOrderMutation,
  GetIDFromUIDQuery,
  UpdateOrderMutation,
} from "../pages/order/step3/queries";
import { IOrder } from "../types/p2p";
import {
  readLocalOrder,
  writeLocalOrder,
} from "../pages/order/localStorageHandler";
import { OrderByUIDQuery } from "../pages/order/queries";
import { createOrder, createUID } from "./helper";
import { IToast } from "../types/general";
//import { redirect } from "next/navigation";

// export async function navigate() {
//   redirect(`/posts`);
// }

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

export const submitOrder = createAsyncThunk(
  "order/submitOrder",
  async (_, thunkAPI): Promise<IToast> => {
    const { main } = thunkAPI.getState() as { main: MainState };

    const uid = main.p2p.uid; // запрещаем создавать кучу ордеров с разных IP
    // если localStorage уже хранит uid и он отличается (ip другой) то не создатся
    let id = main.p2p.id;
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
    if (uid) {
      // Если uid восстановлен и происходит редактирование
      if (!id) {
        // в случае восстановления из localStorage мы не знаем id
        const fetcher = initCMSFetcher({ uid });
        const response = await fetcher(GetIDFromUIDQuery);
        id = response.p2Ps[0].id;
        if (!id) {
          writeLocalOrder(); // чистим localStorage
          return { title: "Order does not exist!", status: "error" };
        }
      }
      const fetcher = initCMSFetcher({ id, ...order });
      const response = await fetcher(UpdateOrderMutation);
      response?.updateP2P?.id && writeLocalOrder(order);
      return { title: "Order was updated!", status: "info" };
    } else {
      // Если создается новый
      const fetcher = initCMSFetcher(order);
      const response = await fetcher(CreateOrderMutation);
      response?.createP2P?.id && writeLocalOrder(order);
      return { title: "Order was created!", status: "success" };
    }
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
