import { createAsyncThunk } from "@reduxjs/toolkit";
import { DirRates, DirTops } from "../types/rates";
import { FiatRates } from "../types/selector";
import axios from "axios";
import { setPm } from "./mainReducer";

type Side = "give" | "get";

export const fetchFiatByCode = createAsyncThunk(
  "currencies/fetchFiatByCode",
  async ({ code, side }: { code: string; side: Side }) => {
    const response = await axios
      .get(`https://coingecko-parser.herokuapp.com/${code.toLowerCase()}`)
      .catch((err) => console.error(err));
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
      .get(`http://localhost:5000/dir=${dir}/tops=false`)
      .catch((err) => console.error(err));
    return response?.data as DirRates;
  }
);

export const fetchDirTops = createAsyncThunk(
  "rates/fetchDirTops",
  async (dir: string, thunkAPI) => {
    const response = await axios
      .get(`http://localhost:5000/dir=${dir}/tops=true`)
      .catch((err) => console.error(err));
    return response?.data as DirTops;
  }
);

export const fetchPossiblePairs = createAsyncThunk(
  "currencies/fetchPossiblePairs",
  async ({ code, side }: { code: string; side: Side }) => {
    const response = await axios
      .get(`http://localhost:5000/possible_pairs/code=${code}`)
      .catch((err) => console.error(err));
    const possiblePairs = response?.data as string[];
    return {
      possiblePairs,
      side,
    };
  }
);

// export const reverseDir = createAsyncThunk(
//   "rates/reverseDir",
//   async (r: string, thunkAPI) => {
//     thunkAPI.dispatch(setPm())
//   }
// );
