import { createAsyncThunk } from "@reduxjs/toolkit";
import { DirRates, DirTops } from "../types/rates";
import { FiatRates } from "../types/selector";
import axios from "axios";

import { popularQuery } from "../services/initialQueries";
import initFetcher from "../services/graphql";
import { IDir } from "../types/dir";
import { MainState } from "./mainReducer";

type Side = "give" | "get";
const env = process.env.NODE_ENV;
const courseFilterLink =
  env === "production"
    ? process.env.NEXT_PUBLIC_COURSE_FILTER_PROD_URL
    : process.env.NEXT_PUBLIC_COURSE_FILTER_DEV_URL;

export const fetchFiatByCurrencyCode = createAsyncThunk(
  "currencies/fetchFiatByCurrencyCode",
  async ({ code, side }: { code: string; side: Side }) => {
    console.log(
      `${process.env.NEXT_PUBLIC_COINGECKO_URL}/${code.toLowerCase()}`
    );
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_COINGECKO_URL}/${code.toLowerCase()}`)
      .catch((err) => console.error("ERROR: ", err));
    const fiatRates = response?.data;
    return {
      fiatRates,
      side,
    };
  }
);

export const fetchDirRates = createAsyncThunk(
  "rates/fetchDirRates",
  async (dir: string) => {
    const response = await axios
      .get(`${courseFilterLink}/dir=${dir}/tops=false`)
      .catch((err) => console.error(err));
    return response?.data as DirRates;
  }
);

export const fetchDirTops = createAsyncThunk(
  "rates/fetchDirTops",
  async (code: string | null, thunkAPI) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    // dir не успевает записаться в redux до вызова fetchDirTops, поэтому нужно передать последний выбранный code
    const dir = !code
      ? `${main.givePm?.code}_${main.getPm?.code}`
      : main.activeSide === "give"
      ? `${code.toUpperCase()}_${main.getPm?.code}`
      : main.activeSide === "get"
      ? `${main.givePm?.code}_${code.toUpperCase()}`
      : "";

    const response = await axios
      .get(`${courseFilterLink}/dir=${dir}/tops=true`)
      .catch((err) => console.error("could not fetch, ", err));

    return response?.data as DirTops;
  }
);

export const fetchPossiblePairs = createAsyncThunk(
  "currencies/fetchPossiblePairs",
  async ({ code, side }: { code: string; side: Side }) => {
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

export const fetchPopular = createAsyncThunk(
  "initial/fetchPopular",
  async () => {
    const fetcher = initFetcher();
    const response = await fetcher(popularQuery);
    return response?.popularDirs as IDir[];
  }
);

// export const reverseDir = createAsyncThunk(
//   "rates/reverseDir",
//   async (r: string, thunkAPI) => {
//     thunkAPI.dispatch(setPm())
//   }
// );
