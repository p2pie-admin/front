import { createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";
import { IPopularDirRates, IRate } from "../types/rates";
import axios from "axios";
import {
  createP2POfferMutation,
  TopParametersQuery,
  pmGroupsByNamesQuery,
  pmsQuery,
  updateP2PMakerOffersMutation,
  updateP2POfferMutation,
} from "../services/queries";
import {
  initCMSFetcher,
  initCurrencyConverterFetcher,
  initParserFetcher,
} from "../services/fetchers";
import { MainState } from "./mainReducer";
import { IPm, IPmGroup, IPmPointer } from "../types/selector";
import { ICurrencyConverterRate } from "../types/shared";

import { destructureDirSlug } from "./helper";
import { IToast } from "../types/general";

import { pmFromPmGroups } from "../components/main/side/selector/section/PmGroup/helper";
import { CreateRedirectMutation } from "../components/exchange/tv/queries";
import { ICity } from "../types/exchange";
import { serverLinkPROD, serverLinkDEV } from "../services/utils";
import { getSuggestedCourse } from "../components/p2p/edit/editOffers/offer/course/helper";
import { sendToast } from "./mainReducer";
import {
  buildTelegramStartLink,
  clearTelegramConfirmation,
  normalizeTelegramSlug,
  readTelegramConfirmation,
  verifyTelegramToken,
} from "../services/telegram";
import { IMakerOffer } from "../types/p2p";
//import { redirect } from "next/navigation";

// export async function navigate() {
//   redirect(`/posts`);
// }

type ISide = "give" | "get";
const env = process.env.NODE_ENV;
const courseFilterLink = env === "production" ? serverLinkPROD : serverLinkDEV;
const P2P_SAVE_DEDUP_WINDOW_MS = 6000;
const p2pSaveInFlight = new Set<string>();
const p2pLastSuccess = new Map<string, number>();

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
  },
);

export const fetchCCRates = async ({
  curPair, // not dir but BTC_RUB
}: {
  curPair: string;
}) => {
  const fetcher = initCurrencyConverterFetcher();
  return await fetcher(curPair);
};

export const fetchCurrencyConverterRates = createAsyncThunk(
  "order/fetchCurrencyConverterRates",
  fetchCCRates,
);

export const fetchP2POfferCourseRates = createAsyncThunk<
  {
    index: number;
    dir?: string;
    currencyPair?: string;
    googleRate?: number;
    giveToUSD?: number;
    getToUSD?: number;
    bestRate?: number;
    bestRateRev?: number;
    suggestedCourse?: number;
  },
  { index: number }
>("p2p/fetchOfferCourseRates", async ({ index }, thunkAPI) => {
  const { main } = thunkAPI.getState() as { main: MainState };
  const offer = main?.p2pFullOffers?.[index];
  if (!offer) return { index };

  const givePm = offer.givePm;
  const getPm = offer.getPm;
  const giveCur = givePm?.currency?.code?.toUpperCase();
  const getCur = getPm?.currency?.code?.toUpperCase();
  const currencyPair = giveCur && getCur ? `${giveCur}_${getCur}` : undefined;
  const dir =
    offer.dir ||
    (givePm?.code && getPm?.code ? `${givePm.code}_${getPm.code}` : undefined);

  if (!dir && !currencyPair) return { index };

  const currencyFetcher = initCurrencyConverterFetcher();
  const parserFetcher = initParserFetcher();

  const [googleResponse, parserData] = await Promise.all([
    currencyPair
      ? currencyFetcher(currencyPair)
      : Promise.resolve({ data: null }),
    dir
      ? parserFetcher(
          `similar/dirs=${dir},${dir?.split("_")[1] + "_" + dir?.split("_")[0]}`,
        )
      : Promise.resolve(null),
  ]);

  const googlePayload = googleResponse?.data as ICurrencyConverterRate | null;
  const googleRate = googlePayload?.currentRate;
  const giveToUSD = googlePayload?.giveToUSD;
  const getToUSD = googlePayload?.getToUSD;
  const bestRate = parserData?.[0]?.[0];
  const bestRateRevRaw = parserData?.[1]?.[0];
  const bestRateRev = bestRateRevRaw ? 1 / bestRateRevRaw : undefined;

  const suggestedCourse = getSuggestedCourse({
    bestRate,
    bestRateReversed: bestRateRev,
    googleRate,
  });

  return {
    index,
    dir,
    currencyPair,
    googleRate,
    giveToUSD,
    getToUSD,
    bestRate,
    bestRateRev,
    suggestedCourse,
  };
});
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
  slug: string,
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
    pmGroups,
  );
  const getPm = pmFromPmGroups(getName, getCurCode, getSubgroupName, pmGroups);

  return {
    givePm,
    getPm,
  };
};

export const restorePmsFromSlug = createAsyncThunk(
  "rates/restorePmsFromSlug",
  (slug: string) => restoreFromSlug(slug),
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
  },
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
  },
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
  },
);
export const saveProjectP2P = createAsyncThunk(
  "exchanger/saveProjectP2P",
  async (
    {
      makerId,
      makerSlug,
      confirmed,
    }: { makerId: string; makerSlug: string; confirmed?: boolean },
    thunkAPI,
  ) => {
    const { main } = thunkAPI.getState() as { main: MainState };
    const offers = main?.p2pFullOffers || [];
    const maker = main?.maker;

    const validateP2PProject = ({
      offers,
      maker,
      makerId,
      makerSlug,
    }: {
      offers: Partial<IMakerOffer>[];
      maker?: MainState["maker"];
      makerId: string;
      makerSlug: string;
    }) => {
      if (!makerId || !makerSlug) {
        thunkAPI.dispatch(
          sendToast({
            status: "error",
            title: "Не удалось определить мейкера",
            timeBeforeClosing: 3000,
          }),
        );
        return false;
      }

      if (!offers.length) {
        thunkAPI.dispatch(
          sendToast({
            status: "warning",
            title: "Добавьте хотя бы одно направление",
            timeBeforeClosing: 2500,
          }),
        );
        return false;
      }

      const hasEmpty = offers.some(({ givePm, getPm }) => !givePm || !getPm);
      if (hasEmpty) {
        thunkAPI.dispatch(
          sendToast({
            status: "warning",
            title: "Заполните все направления",
            timeBeforeClosing: 2500,
          }),
        );
        return false;
      }

      const seen = new Set<string>();
      const hasRepeated = offers.some(({ givePm, getPm }) => {
        const key = `${givePm?.code}|${getPm?.code}`;
        if (seen.has(key)) return true;
        seen.add(key);
        return false;
      });

      if (hasRepeated) {
        thunkAPI.dispatch(
          sendToast({
            status: "warning",
            title: "Уберите повторяющиеся направления",
            timeBeforeClosing: 2500,
          }),
        );
        return false;
      }

      if (!maker) {
        thunkAPI.dispatch(
          sendToast({
            status: "warning",
            title: "Данные мейкера не загружены",
            timeBeforeClosing: 2500,
          }),
        );
        return false;
      }

      console.log("all fine");
      return true;
    };

    const isValid = validateP2PProject({
      offers,
      maker,
      makerId,
      makerSlug,
    });
    if (!isValid) return;

    const normalizedSlug = normalizeTelegramSlug(makerSlug);
    const isConfirmed = Boolean(confirmed);
    const confirmation = isConfirmed
      ? { token: "confirmed" }
      : readTelegramConfirmation(normalizedSlug);

    if (!confirmation?.token) {
      const botUsername =
        process.env.NEXT_PUBLIC_BOT_USERNAME || process.env.BOT_USERNAME;
      const botStartSecret =
        process.env.NEXT_PUBLIC_BOT_START_SECRET ||
        process.env.BOT_START_SECRET;

      if (!botUsername || !botStartSecret) {
        thunkAPI.dispatch(
          sendToast({
            status: "error",
            title: "Не настроены BOT_USERNAME или BOT_START_SECRET",
            timeBeforeClosing: 4000,
          }),
        );
        return;
      }

      const botLink = await buildTelegramStartLink({
        slug: normalizedSlug,
        botUsername,
        botStartSecret,
      });

      if (typeof window !== "undefined") {
        window.open(botLink, "_blank", "noopener,noreferrer");
      }
      thunkAPI.dispatch(
        sendToast({
          status: "info",
          title: "Откройте бота в Telegram и подтвердите",
          timeBeforeClosing: 4000,
        }),
      );
      return;
    }

    const dedupeKey = `${makerId}:${normalizedSlug.toLowerCase()}`;
    const now = Date.now();
    const lastSuccessAt = p2pLastSuccess.get(dedupeKey);
    if (lastSuccessAt && now - lastSuccessAt < P2P_SAVE_DEDUP_WINDOW_MS) {
      return;
    }
    if (p2pSaveInFlight.has(dedupeKey)) {
      return;
    }
    p2pSaveInFlight.add(dedupeKey);

    try {
      if (!isConfirmed) {
        let verifyResponse;
        try {
          verifyResponse = await verifyTelegramToken(confirmation.token);
        } catch (error) {
          thunkAPI.dispatch(
            sendToast({
              status: "error",
              title: "Не удалось проверить подтверждение Telegram",
              timeBeforeClosing: 4000,
            }),
          );
          return;
        }
        const verifiedSlug = normalizeTelegramSlug(verifyResponse.slug);

        if (!verifyResponse.ok || !verifiedSlug) {
          clearTelegramConfirmation(normalizedSlug);
          thunkAPI.dispatch(
            sendToast({
              status: "error",
              title: "Подтверждение Telegram не прошло проверку",
              timeBeforeClosing: 4000,
            }),
          );
          return;
        }

        if (verifiedSlug.toLowerCase() !== normalizedSlug.toLowerCase()) {
          clearTelegramConfirmation(normalizedSlug);
          thunkAPI.dispatch(
            sendToast({
              status: "error",
              title: "Подтверждение Telegram относится к другому пользователю",
              timeBeforeClosing: 4000,
            }),
          );
          return;
        }
      }

      const fetcher = initCMSFetcher();
      const offerInputs = offers.map((offer) => {
        const dir =
          offer.dir ||
          (offer.givePm?.code && offer.getPm?.code
            ? `${offer.givePm.code}_${offer.getPm.code}`
            : undefined);
        const data: Record<string, any> = {
          dir,
          side: offer.side,
          isActive: offer.isActive,
          follow_market: offer.follow_market,
          fee_enabled: offer.fee_enabled,
          course: offer.course,
          min: offer.min ?? null,
          max: offer.max ?? null,
          fee_type: offer.fee_type ?? null,
          fee_amount: offer.fee_amount ?? null,
          city_from: offer.city_from ?? null,
          city_to: offer.city_to ?? null,
        };
        Object.keys(data).forEach((key) => {
          if (data[key] === undefined) delete data[key];
        });
        return { id: offer.id, data };
      });

      if (
        offerInputs.some(
          (offer) => !offer.data.dir || offer.data.course == null,
        )
      ) {
        thunkAPI.dispatch(
          sendToast({
            status: "warning",
            title: "Заполните курс и направление в каждом оффере",
            timeBeforeClosing: 3000,
          }),
        );
        return;
      }

      const createdOfferIds: string[] = [];
      const existingOfferIds: string[] = [];

      for (const offer of offerInputs) {
        if (offer.id) {
          existingOfferIds.push(String(offer.id));
          await fetcher(updateP2POfferMutation, {
            id: offer.id,
            data: offer.data,
          });
          continue;
        }

        const created = await fetcher(createP2POfferMutation, {
          data: offer.data,
        });
        const createdId = created?.id || created?.data?.id;
        if (createdId) {
          createdOfferIds.push(String(createdId));
        }
      }

      const allOfferIds = [...existingOfferIds, ...createdOfferIds];
      if (allOfferIds.length) {
        await fetcher(updateP2PMakerOffersMutation, {
          id: makerId,
          offers: allOfferIds,
        });
      }

      p2pLastSuccess.set(dedupeKey, Date.now());
      thunkAPI.dispatch(
        sendToast({
          status: "success",
          title: "Данные сохранены",
          timeBeforeClosing: 2500,
        }),
      );
    } catch (error) {
      thunkAPI.dispatch(
        sendToast({
          status: "error",
          title: "Не удалось сохранить данные",
          timeBeforeClosing: 4000,
        }),
      );
    } finally {
      p2pSaveInFlight.delete(dedupeKey);
    }
  },
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
