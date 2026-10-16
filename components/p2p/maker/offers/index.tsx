import { useState } from "react";
import { Divider, Grid, Box, VStack, HStack, Button, Link, Text, IconButton, Input } from "@chakra-ui/react";
import { BsArrowRightShort } from "react-icons/bs";
import { FiArrowRight } from "react-icons/fi";
import OwnerEdit from "../topPanel/OwnerEdit";
import { IoSearch } from "react-icons/io5";
import PmName from "../../../shared/PmName";
import { dealLink } from "../../../../services/p2pSanctions";
import { IoMdListBox } from "react-icons/io";
import { IMaker, IMakerOffer } from "../../../../types/p2p";
import { IPm } from "../../../../types/selector";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

import { intlLocale, useLocale, useT } from "../../../../services/i18n";

// Anchor of the offers block: deals start from an offer, so "Начать сделку" buttons elsewhere scroll here.
export const MAKER_OFFERS_ID = "maker-offers";
export const scrollToMakerOffers = () => {
  if (typeof window === "undefined") return;
  const target = document.getElementById(MAKER_OFFERS_ID);
  if (!target) return;
  window.scrollTo({ top: Math.max(target.getBoundingClientRect().top + window.pageYOffset - 100, 0), behavior: "smooth" });
};

const fmt = (n: number, locale: string, digits = 4) => n.toLocaleString(locale, { maximumFractionDigits: digits });

// What the client really gets per unit: the course plus the maker's percentage fee, shown as "1 <stronger> = x <weaker>".
const rateParts = (offer: IMakerOffer, give: string, get: string) => {
  const course = Number(offer.course);
  if (!(course > 0)) return null;
  const fee = offer.fee_amount && (offer.fee_type === "percentage" || !offer.fee_type) ? offer.fee_amount / 100 : 0;
  const getPerGive = (1 / course) * (1 - fee);
  return getPerGive >= 1 ? { from: give, value: getPerGive, to: get } : { from: get, value: 1 / getPerGive, to: give };
};

function MakerOfferCard({ offer, pmsByCode, locale }: { offer: IMakerOffer; pmsByCode: Map<string, IPm>; locale: string }) {
  const t = useT();
  const [giveCode, getCode] = offer.dir.split("_");
  const givePm = pmsByCode.get((giveCode || "").toUpperCase());
  const getPm = pmsByCode.get((getCode || "").toUpperCase());
  const give = givePm?.currency?.code?.toUpperCase() || giveCode;
  const get = getPm?.currency?.code?.toUpperCase() || getCode;
  const rate = rateParts(offer, give, get);
  // Limits are kept in the give currency unless the offer says "get"; the second line converts them.
  const inGet = offer.side === "get";
  const course = Number(offer.course) || 0;
  const convert = (n: number) => (course > 0 ? (inGet ? n * course : n / course) : 0);
  const hasLimits = offer.min != null || offer.max != null;
  const range = (a?: number | null, b?: number | null, digits = 0) =>
    `${a != null ? fmt(a, locale, digits) : "0"} – ${b != null ? fmt(b, locale, digits) : "∞"}`;

  return (
    <Box p="4" borderRadius="xl" bg="bg.900" borderWidth="1px" borderColor="whiteAlpha.100">
      <Grid gridTemplateColumns="1fr 28px 1fr" alignItems="center" columnGap="2">
        {givePm ? <PmName pm={givePm} isTwoLines /> : <Text fontSize="sm">{giveCode}</Text>}
        <Box color="bg.500" justifySelf="center">
          <BsArrowRightShort size="1.5rem" />
        </Box>
        {getPm ? <PmName pm={getPm} isTwoLines /> : <Text fontSize="sm">{getCode}</Text>}
      </Grid>
      <HStack mt="3" justifyContent="space-between" alignItems="center" spacing="3">
        <VStack alignItems="flex-start" spacing="1" minW={0}>
          {rate ? (
            <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight="semibold" lineHeight="1.2">
              {`1 ${rate.from} = `}
              <Text as="span" color="peach.300">
                {fmt(rate.value, locale)}
              </Text>
              {` ${rate.to}`}
            </Text>
          ) : null}
          {hasLimits ? (
            <HStack alignItems="flex-start" spacing="4" fontSize="sm">
              <Text color="bg.400">{t("Лимиты", "Limits")}</Text>
              <VStack alignItems="flex-start" spacing="0">
                <Text>{`${range(offer.min, offer.max)} ${inGet ? get : give}`}</Text>
                {course > 0 ? (
                  <Text color="bg.500" fontSize="xs">
                    {`${range(offer.min != null ? convert(offer.min) : null, offer.max != null ? convert(offer.max) : null)} ${inGet ? give : get}`}
                  </Text>
                ) : null}
              </VStack>
            </HStack>
          ) : null}
        </VStack>
        {offer.isActive !== false ? (
          <Button
            as={Link}
            href={dealLink(offer.id)}
            isExternal
            rel="nofollow noopener"
            variant="primary"
            flexShrink={0}
            w="52px"
            h="52px"
            borderRadius="xl"
            aria-label={t("Начать сделку", "Start a deal")}
            title={t("Начать сделку", "Start a deal")}
            _hover={{ textDecoration: "none" }}
          >
            <FiArrowRight size="1.5rem" strokeWidth={3} />
          </Button>
        ) : null}
      </HStack>
    </Box>
  );
}

export default function MakerOffers({
  offers,
  pms,
  slug,
}: {
  offers: IMaker["offers"];
  pms: IPm[] | null;
  slug: string;
}) {
  const t = useT();
  const locale = intlLocale(useLocale());
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pmsByCode = new Map<string, IPm>();
  (pms || []).forEach((pm) => {
    if (pm?.code) {
      pmsByCode.set(pm.code.toUpperCase(), pm);
    }
  });
  const q = query.trim().toLowerCase();
  // Search by currency code or payment method name on either side.
  const shown = (offers || []).filter((offer) => {
    if (!q) return true;
    return offer.dir.split("_").some((code) => {
      const pm = pmsByCode.get(code.toUpperCase());
      return [code, pm?.currency?.code, pm?.en_name, pm?.ru_name].some((v) => (v || "").toLowerCase().includes(q));
    });
  });

  return (
    <BoxWrapper id={MAKER_OFFERS_ID} p={{ base: "3", lg: "4" }}>
      <HStack justifyContent="space-between">
        <HStack spacing="3" color="peach.200">
          <CustomHeader text={t("Предложения", "Offers")} Icon={IoMdListBox} />
          <OwnerEdit slug={slug} place="offers" />
        </HStack>
        <IconButton
          aria-label={t("Поиск по предложениям", "Search offers")}
          icon={<IoSearch size="1.2rem" />}
          variant="outline"
          onClick={() => setSearchOpen((v) => !v)}
        />
      </HStack>
      {searchOpen ? (
        <Input mt="3" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Валюта или способ оплаты", "Currency or payment method")} />
      ) : null}
      <Divider my="4" />
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap="3">
        {shown.map((offer) => (
          <MakerOfferCard key={offer.id} offer={offer} pmsByCode={pmsByCode} locale={locale} />
        ))}
      </Grid>
      {!shown.length ? (
        <Text color="bg.400" fontSize="sm">
          {t("Ничего не найдено", "Nothing found")}
        </Text>
      ) : null}
    </BoxWrapper>
  );
}
