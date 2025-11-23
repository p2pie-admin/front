import { Divider, Grid, Text, Box } from "@chakra-ui/react";

import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { PiArrowsSplitThin } from "react-icons/pi";
import { curToSymbol, format, R } from "../../../redux/amountsHelper";

import { capitalize, pmsToSlug } from "../side/selector/section/PmGroup/helper";

import { IPopularRate } from "../../../types/rates";
import { IPm } from "../../../types/selector";
import RateLink from "./RateLink";
import { ResponsiveText } from "../../../styles/theme/custom";
import { useRouter } from "next/router";
import { slugCityToExchange } from "../../exchange/exchangeHelper";
import { useAppSelector } from "../../../redux/hooks";

const CryptoRates = ({
  cryptoPm,
  buySell,
  popularPms,
}: {
  cryptoPm: IPm;
  popularPms: IPm[];
  buySell: {
    buy: IPopularRate[];
    sell: IPopularRate[];
  };
}) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const citySlug = useAppSelector((state) =>
    state.main.city?.en_name.replaceAll(" ", "-").toLowerCase()
  );
  return (
    <>
      <Box>
        {buySell.buy.map((rate, index) => {
          const pm = popularPms?.find((pm) => pm?.code == rate?.fiat);
          return (
            <ResponsiveText
              key={String(pm?.code) + index}
              size="sm"
              _hover={{ color: "bg.200" }}
              my="1"
            >
              {`${capitalize(pm?.[`${locale}_name`])}`}
            </ResponsiveText>
          );
        })}
      </Box>
      <Box>
        {buySell.buy.map((rate, index) => {
          const pm = popularPms?.find((pm) => pm?.code == rate?.fiat);
          const slug = pmsToSlug({ givePm: pm, getPm: cryptoPm });
          const fullSlug = `/${slugCityToExchange(slug, citySlug)}`;
          const rateNumber = `${curToSymbol(
            pm?.currency.code.toUpperCase()
          )} ${format(rate?.course, 2)} `;
          return (
            <RateLink
              key={String(rate?.exchangerId) + index + "buy"}
              slug={fullSlug}
              rateNumber={rateNumber}
              side="buy"
            />
          );
        })}
      </Box>
      <Box>
        {buySell.sell.map((rate, index) => {
          const pm = popularPms?.find((pm) => pm?.code == rate?.fiat);
          const slug = pmsToSlug({ givePm: cryptoPm, getPm: pm });

          const fullSlug = `/${slugCityToExchange(slug, citySlug)}`;
          const rateNumber = `${curToSymbol(
            pm?.currency.code.toUpperCase()
          )} ${format(rate?.course, 2)} `;
          return (
            <RateLink
              key={String(rate?.exchangerId) + index + "sell"}
              slug={fullSlug}
              rateNumber={rateNumber}
              side="sell"
            />
          );
        })}
      </Box>
    </>
  );
};

export default CryptoRates;
