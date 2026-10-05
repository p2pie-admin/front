import { Heading, HStack, VStack, Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { useEffect, useMemo } from "react";
import { fetchCity, fetchTopParameters } from "../../redux/thunks";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import MassTable from "./table";
import MassSideContext from "./sideContext";

import MassTableSelector from "./massTableSelector";
import Breadcrumbs from "../shared/Breadcrumbs";
import { addSpaces, curToSymbol, R } from "../../redux/amountsHelper";

const Mass = ({
  massDirTextId,
  massDirText,
  massRates,
  fiatPms,
  cryptoPms,
  isSell,
  slug,
}: {
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  fiatPms: Record<string, IPm>;
  cryptoPms: IPm[];
  isSell: boolean;
  slug: string;
}) => {
  const { header, subheader, text } = massDirText;
  // Best offer for the summary card: the table's default order (course asc) puts it first.
  const best = useMemo(() => {
    const sorted = (massRates || []).filter((r) => r?.course).slice().sort((a, b) => a.course - b.course);
    const top = sorted[0];
    if (!top) return null;
    const shown = top.course < 1 ? 1 / top.course : top.course;
    const symbol = curToSymbol(massDirTextId.currency.code) || massDirTextId.currency.code.toUpperCase();
    return {
      text: `1 ${massDirTextId.code.toUpperCase().slice(0, 4)} ≈ ${addSpaces(R(shown, 1))} ${symbol}`,
      name: top.name,
      count: sorted.length,
    };
  }, [massRates, massDirTextId]);
  const selectedCryptoPm = useMemo(
    () =>
      cryptoPms.find(
        (pm) => pm.code.toUpperCase() === massDirTextId.code.toUpperCase()
      ),
    [cryptoPms, massDirTextId.code]
  );
  const city = useAppSelector((state) => state.main.city);
  const router = useRouter();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopParameters());
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;

    const rawCity = Array.isArray(router.query.city)
      ? router.query.city[0]
      : router.query.city;

    if (!rawCity || typeof rawCity !== "string") return;

    const cityParam = rawCity.trim();
    if (!cityParam) return;

    const currentCitySlug = city?.en_name?.toLowerCase();
    if (currentCitySlug === cityParam.toLowerCase()) return;

    dispatch(fetchCity(cityParam));
  }, [router.isReady, router.query.city, city?.en_name, dispatch]);

  return (
    <MassSideContext.Provider
      value={{
        isSell,
        slug,
        currencyCode: massDirTextId.currency.code,
        currentCryptoPm: selectedCryptoPm,
        city,
      }}
    >
      <Box p="4">
        <Breadcrumbs
          mb="2"
          items={[
            { label: "Главная", href: "/" },
            { label: isSell ? "Продать" : "Купить", href: `/${isSell ? "sell" : "buy"}/${slug}` },
            { label: header },
          ]}
        />
        <Heading
          fontSize={{ base: "xl", lg: "4xl" }}
          as="h1"
          fontWeight="bold"
          variant="extra_contrast"
        >
          {header}
        </Heading>
        <ResponsiveText
          fontSize={{ base: "md", lg: "2xl" }}
          as="h2"
          variant="contrast"
          whiteSpace="unset"
        >
          {subheader}
        </ResponsiveText>
        {best ? (
          <Box3D variant="extra_contrast" px="4" py="3" mt="3" display={{ base: "block", lg: "inline-block" }}>
            <Text fontSize="xs" color="bg.400" textTransform="uppercase" letterSpacing="wide">
              Лучший курс сейчас
            </Text>
            <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight="700" color="green.300" lineHeight="1.2">
              {best.text}
            </Text>
            <Text fontSize="sm" color="bg.300">
              {`${best.name} · ${best.count} ${
                best.count % 10 === 1 && best.count % 100 !== 11
                  ? "обменник"
                  : [2, 3, 4].includes(best.count % 10) && ![12, 13, 14].includes(best.count % 100)
                    ? "обменника"
                    : "обменников"
              }`}
            </Text>
          </Box3D>
        ) : null}
      </Box>

      <VStack gap="5" mt={["2", "8"]} w="100%" minW="0">
        <MassTableSelector cryptoPms={cryptoPms} />

        <MassTable
          massRates={massRates}
          fiatPms={fiatPms}
          massDirTextId={massDirTextId}
        />

        {/* Descriptive text moved under the table: collapsed on phones, open on desktop.
            It stays in the HTML either way. */}
        {text ? (
          <Box w="100%" px="4">
            <Box as="details" display={{ base: "block", lg: "none" }}>
              <Box as="summary" cursor="pointer" color="peach.300" fontSize="sm" fontWeight="600" py="2">
                {`О ${isSell ? "продаже" : "покупке"}: подробнее`}
              </Box>
              <ResponsiveText fontSize="sm" whiteSpace="unset" variant="no_contrast">
                {text}
              </ResponsiveText>
            </Box>
            <Box display={{ base: "none", lg: "block" }}>
              <ResponsiveText fontSize="xl" whiteSpace="unset" variant="no_contrast">
                {text}
              </ResponsiveText>
            </Box>
          </Box>
        ) : null}
      </VStack>
    </MassSideContext.Provider>
  );
};

export default Mass;
