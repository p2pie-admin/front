import { Box, Button, Center, Grid, HStack, Select, Text } from "@chakra-ui/react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Pagination from "../../mass/table/Pagination";
import { BoxWrapper } from "../../shared/BoxWrapper";
import Loader from "../../shared/Loader";
import UniversalSeo from "../../shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import { IMakerCity, IMakerPreview } from "../../../types/p2p";
import MakerLink from "./MakerLink";
import MakersHeader from "./MakersHeader";
import TopPanel from "./TopPanel";
import { getMakerCityKeys, getMakerDisplayName, getMakerStatusColor } from "./helper";
import { SortCriteria } from "./SortButtons";
import { useLocale, usePublicPathname, useT } from "../../../services/i18n";

export default function MakersList({
  makers,
  seo,
  initialPage,
  cities = [],
}: {
  makers: IMakerPreview[] | null;
  seo: ISEO;
  initialPage: number;
  cities?: IMakerCity[];
}) {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  // English pages live under /xen internally; links and navigation use the public path.
  const pathname = usePublicPathname();
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSearchSort, setLoadingSearchSort] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  // Makers without a single offer are noise for a visitor; hidden by default, one tap to show.
  const [onlyWithOffers, setOnlyWithOffers] = useState(true);
  // City key from the makers' offers ("" = any city).
  const [cityFilter, setCityFilter] = useState("");
  const withOffersCount = useMemo(
    () => (makers || []).filter((m) => (m.offers?.length || 0) > 0).length,
    [makers],
  );
  const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT || "";

  const toggleFilter = (status: string) => {
    setLoadingSearchSort(true);
    setActiveFilter((prev) => (prev === status ? null : status));
  };

  const toggleSort = (criteria: SortCriteria) => {
    setLoadingSearchSort(true);
    if (sortCriteria === criteria) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortCriteria(criteria);
      setSortDirection("desc");
    }
  };

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setLoadingSearchSort(true);
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingSearchSort(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [debouncedQuery, sortCriteria, sortDirection, activeFilter]);

  const filteredMakers = useMemo(() => {
    return makers?.filter((maker) => {
      const displayName = getMakerDisplayName(maker).toLowerCase();
      const matchesFilter =
        activeFilter === null || activeFilter === getMakerStatusColor(maker);
      if (onlyWithOffers && !(maker.offers?.length || 0)) return false;
      if (cityFilter && !getMakerCityKeys(maker).includes(cityFilter)) return false;

      const matchesSearch =
        debouncedQuery === "" ||
        displayName.includes(debouncedQuery) ||
        (maker.slug || "").toLowerCase().includes(debouncedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [makers, debouncedQuery, activeFilter, onlyWithOffers, cityFilter]);

  const sortedMakers = useMemo(() => {
    const sorted = filteredMakers?.slice().sort((a, b) => {
      let result = 0;

      if (sortCriteria === "name") {
        const nameA = getMakerDisplayName(a);
        const nameB = getMakerDisplayName(b);
        result = nameA.localeCompare(nameB, "ru", { sensitivity: "base" });
      } else if (sortCriteria === "offers") {
        result = (a.offers?.length || 0) - (b.offers?.length || 0);
      } else if (sortCriteria === "reviews") {
        result = (a.reviews?.length || 0) - (b.reviews?.length || 0);
      }

      return sortDirection === "asc" ? result : -result;
    });

    return sorted;
  }, [filteredMakers, sortCriteria, sortDirection]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil((sortedMakers?.length || 0) / itemsPerPage);
  const rawPage = useMemo(() => {
    if (!router.isReady) return initialPage;
    const pageValue = Array.isArray(router.query.page)
      ? router.query.page[0]
      : router.query.page;
    const parsed = Number.parseInt(pageValue || "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [router.isReady, router.query.page, initialPage]);

  const currentPage = useMemo(
    () => Math.min(Math.max(rawPage, 1), Math.max(totalPages, 1)),
    [rawPage, totalPages],
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMakers = sortedMakers?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const setPage = useCallback(
    (page: number) => {
      if (!router.isReady) return;
      const nextPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
      if (nextPage === rawPage) return;
      const nextQuery = { ...router.query };
      if (nextPage === 1) {
        delete nextQuery.page;
      } else {
        nextQuery.page = String(nextPage);
      }
      router.push({ pathname, query: nextQuery });
    },
    [router.isReady, pathname, router.query, rawPage, totalPages],
  );

  const getPageHref = useCallback(
    (page: number) =>
      page > 1 ? `${pathname}?page=${page}` : pathname,
    [pathname],
  );

  const effectiveSeo = useMemo(() => {
    const canonicalSlug = currentPage > 1 ? `p2p?page=${currentPage}` : "p2p";
    return { ...seo, canonicalSlug };
  }, [seo, currentPage]);

  useEffect(() => {
    if (!router.isReady) return;
    if (totalPages > 0 && rawPage > totalPages) {
      setPage(totalPages);
    }
  }, [router.isReady, totalPages, rawPage, setPage]);

  if (!makers?.length) return <>{t("Мейкеров нет", "No makers")}</>;

  return (
    <>
      <UniversalSeo seo={effectiveSeo} />

      <BoxWrapper p="4" variant="no_contrast" mt="10" minH="100vh">
        <MakersHeader makers={makers} />

        <Box px="4" pb="2">
          <Text fontSize="sm" color="bg.300" maxW="720px">
            {t(
              "Частные обменники, подтвердившие аккаунт через Telegram. Сделка проходит напрямую между вами и мейкером: p2pie не участвует в обмене и не хранит средства — проверяйте отзывы и начинайте с небольших сумм.",
              "Private exchangers who verified their account via Telegram. The deal goes directly between you and the maker: p2pie does not take part in the exchange and does not hold funds, so check the reviews and start with small amounts.",
            )}
          </Text>
          <HStack mt="3" spacing="2" flexWrap="wrap">
            <Button
              size="sm"
              borderRadius="full"
              variant={onlyWithOffers ? "solid" : "outline"}
              bgColor={onlyWithOffers ? "peach.300" : "transparent"}
              color={onlyWithOffers ? "bg.900" : "bg.200"}
              borderColor="bg.500"
              _hover={{}}
              onClick={() => setOnlyWithOffers(true)}
            >
              {t(`С предложениями · ${withOffersCount}`, `With offers · ${withOffersCount}`)}
            </Button>
            <Button
              size="sm"
              borderRadius="full"
              variant={!onlyWithOffers ? "solid" : "outline"}
              bgColor={!onlyWithOffers ? "peach.300" : "transparent"}
              color={!onlyWithOffers ? "bg.900" : "bg.200"}
              borderColor="bg.500"
              _hover={{}}
              onClick={() => setOnlyWithOffers(false)}
            >
              {t(`Все · ${makers.length}`, `All · ${makers.length}`)}
            </Button>
            {cities.length ? (
              <Select
                size="sm"
                w="auto"
                maxW="220px"
                borderRadius="full"
                borderColor={cityFilter ? "peach.300" : "bg.500"}
                color={cityFilter ? "peach.200" : "bg.200"}
                aria-label={t("Город", "City")}
                value={cityFilter}
                onChange={(e) => {
                  setCityFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">{t("Все города", "All cities")}</option>
                {cities.map((city) => (
                  <option key={city.key} value={city.key}>
                    {`${locale === "en" ? city.en_name : city.ru_name} · ${city.count}`}
                  </option>
                ))}
              </Select>
            ) : null}
            {botLink ? (
              <Button
                as="a"
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="primary"
                color="white"
                ml={{ base: 0, md: "auto" }}
              >
                {t("Стать мейкером", "Become a maker")}
              </Button>
            ) : null}
          </HStack>
        </Box>

        <TopPanel
          toggleFilter={toggleFilter}
          activeFilter={activeFilter}
          setSearchQuery={setSearchQuery}
          sortCriteria={sortCriteria}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
        />

        <Box mt="4">
          <Box maxW="container.xl" mx="auto">
            {loadingSearchSort ? (
              <Center py="20">
                <Loader size="xl" />
              </Center>
            ) : (
              <Grid
                gap="4"
                w="100%"
                justifyItems="center"
                gridTemplateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                }}
              >
                {paginatedMakers?.map((maker) => (
                  <MakerLink key={maker.id} maker={maker} />
                ))}
              </Grid>
            )}
            {!loadingSearchSort && !paginatedMakers?.length ? (
              <Text textAlign="center" color="bg.400" py="10">
                {cityFilter
                  ? t("В этом городе пока нет мейкеров.", "No makers in this city yet.")
                  : onlyWithOffers
                  ? t("Пока нет мейкеров с активными предложениями.", "No makers with active offers yet.")
                  : t("Ничего не найдено.", "Nothing found.")}
              </Text>
            ) : null}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                getPageHref={getPageHref}
              />
            )}
          </Box>
        </Box>
      </BoxWrapper>
    </>
  );
}
