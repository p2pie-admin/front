import React from "react";
import { Box } from "@chakra-ui/react";
import useSWR from "swr";
import {
  initCurrencyConverterFetcher,
  initParserFetcher,
} from "../../../../../../services/fetchers";
import { IFullOffer } from "../../../../../../types/p2p";
import { ICurrencyConverterRate } from "../../../../../../types/shared";
import { beautifyAmount } from "../../../../../../redux/amountsHelper";
import Chart from "../../../../../exchange/Chart";
import { getSuggestedRate } from "./helper";

export default function ({ fullOffer }: { fullOffer: Partial<IFullOffer> }) {
  const currencyPair = `${fullOffer?.givePm?.currency.code.toUpperCase()}_${fullOffer?.getPm?.currency.code.toUpperCase()}`;
  const initialCourse = fullOffer.course;
  const dir =
    fullOffer.dir ||
    (fullOffer.givePm?.code && fullOffer.getPm?.code
      ? `${fullOffer.givePm.code}_${fullOffer.getPm.code}`
      : undefined);
  const fetcher = initCurrencyConverterFetcher();
  const parserFetcher = initParserFetcher();
  const { data: googleData } = useSWR<ICurrencyConverterRate | null>(
    currencyPair ? ["currency-converter", currencyPair] : null,
    async () => {
      const response = await fetcher(currencyPair);
      return (response?.data as ICurrencyConverterRate | null) ?? null;
    },
  );
  const { data: parserData } = useSWR(dir ? ["similar-dirs", dir] : null, () =>
    parserFetcher(`similar/dirs=${dir}`),
  ) as { data?: ([number, number] | [])[] | null };
  const bestRate = parserData?.[0]?.[0];
  const bestOffers = parserData?.[0]?.[1];
  const googleRate = googleData?.currentRate;
  const giveCur = fullOffer?.givePm?.currency.code.toUpperCase();
  const getCur = fullOffer?.getPm?.currency.code.toUpperCase();
  const suggestedRate = getSuggestedRate({
    googleRate,
    bestRate,
  });
  // const rate = (data?.data as ICurrencyConverterRate | null) || undefined;
  // const displayCourse = rate?.currentRate ?? course;

  return (
    <Box>
      <div>
        {initialCourse
          ? `  initialCourse: ${beautifyAmount(initialCourse)}`
          : null}
        {bestRate ? ` | similar: ${beautifyAmount(bestRate)}` : null}
        {bestOffers ? ` (${bestOffers})` : null}
        {googleRate ? ` | googleRate: ${beautifyAmount(googleRate)}` : null}
        {suggestedRate
          ? ` | suggestedRate: ${beautifyAmount(suggestedRate)}`
          : null}
      </div>
      {giveCur && getCur && (
        <Box w="fit-content">
          <Chart
            giveCur={giveCur}
            getCur={getCur}
            currentRateOverride={googleRate}
          />
        </Box>
      )}
    </Box>
  );
}
