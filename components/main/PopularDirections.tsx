import { Box, Button, Grid, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import Dir from "../exchange/Dir";
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
import { pmsToSlug } from "./side/selector/section/PmGroup/helper";
import { format } from "../../redux/amountsHelper";

const MAX_CARDS = 8;

type Card = {
  slug: string;
  givePm: IPm;
  getPm: IPm;
  rateText: string;
  offers?: number;
};

// Popular directions as plain link cards with the current best rate. Built from the same
// `popularRates` the sidebar table uses, so the home page carries real anchors to the
// direction pages in its HTML (the old picker wheel exposed none).
const buildCards = (
  popularRates?: IPopularDirRates | null,
  popularPms?: IPm[] | null,
): Card[] => {
  if (!popularRates || !popularPms?.length) return [];
  const byCode = new Map(popularPms.map((pm) => [pm.code, pm]));
  const cards: Card[] = [];
  const seen = new Set<string>();
  // Round-robin: the best sell and buy pair of every crypto first, then the second ones.
  for (let round = 0; round < 2 && cards.length < MAX_CARDS; round++) {
    for (const [cryptoCode, buySell] of Object.entries(popularRates)) {
      const cryptoPm = byCode.get(cryptoCode);
      if (!cryptoPm) continue;
      const cryptoCur = cryptoPm.currency?.code?.toUpperCase() || cryptoCode;
      const pairs: Array<{ rate: any; give: IPm; get: IPm; fiat: IPm }> = [];
      const sell = buySell.sell?.[round];
      const sellFiat = sell ? byCode.get(sell.fiat) : null;
      if (sell && sellFiat) pairs.push({ rate: sell, give: cryptoPm, get: sellFiat, fiat: sellFiat });
      const buy = buySell.buy?.[round];
      const buyFiat = buy ? byCode.get(buy.fiat) : null;
      if (buy && buyFiat) pairs.push({ rate: buy, give: buyFiat, get: cryptoPm, fiat: buyFiat });
      for (const p of pairs) {
        if (cards.length >= MAX_CARDS || !p.rate?.course) continue;
        const slug = pmsToSlug({ givePm: p.give, getPm: p.get });
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        const fiatCur = p.fiat.currency?.code?.toUpperCase() || "";
        cards.push({
          slug,
          givePm: p.give,
          getPm: p.get,
          // popular rates are always "fiat per 1 crypto", for both sides
          rateText: `1 ${cryptoCur} = ${format(p.rate.course, 1)} ${fiatCur}`,
          offers: p.rate.exchangers,
        });
      }
    }
  }
  return cards;
};

const PopularDirections = ({
  popularRates,
  popularPms,
}: {
  popularRates?: IPopularDirRates | null;
  popularPms?: IPm[] | null;
}) => {
  const cards = buildCards(popularRates, popularPms);
  if (!cards.length) return null;
  return (
    <Box w="100%" maxW={{ base: 428, lg: "900px" }} px={{ base: 2, lg: 0 }}>
      <Grid
        // minmax(0, …): the card texts are nowrap, a plain 1fr would let them widen the grid past the page
        gridTemplateColumns={{
          base: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        }}
        gap="3"
        alignItems="stretch"
      >
        {cards.map((c) => (
          <Dir
            key={c.slug}
            slug={c.slug}
            givePm={c.givePm}
            getPm={c.getPm}
            fullHeight
            bottomLeft={
              c.offers ? (
                <Text fontSize="xs" color="bg.400" whiteSpace="nowrap" mt="1">
                  {`Обменников: ${c.offers}`}
                </Text>
              ) : null
            }
            bottomRight={
              <Text fontSize="xs" color="green.300" whiteSpace="nowrap" mt="1">
                {c.rateText}
              </Text>
            }
          />
        ))}
      </Grid>
      <Box textAlign="center" mt="4">
        <Button
          as={NextLink}
          href="/buy/usdttrc20-for-rub"
          prefetch={false}
          variant="outline"
          size="md"
          borderColor="bg.500"
          color="bg.200"
        >
          Все курсы обмена
        </Button>
      </Box>
    </Box>
  );
};

export default PopularDirections;
