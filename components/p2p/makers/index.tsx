import { Box, Button, Center, Grid, HStack, Text } from "@chakra-ui/react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Pagination from "../../mass/table/Pagination";
import { BoxWrapper } from "../../shared/BoxWrapper";
import Loader from "../../shared/Loader";
import UniversalSeo from "../../shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import { IMakerPreview } from "../../../types/p2p";
import MakerLink from "./MakerLink";
import MakersHeader from "./MakersHeader";
import TopPanel from "./TopPanel";
import { getMakerDisplayName, getMakerStatusColor } from "./helper";
import { SortCriteria } from "./SortButtons";

export default function MakersList({
  makers,
  seo,
  initialPage,
}: {
  makers: IMakerPreview[] | null;
  seo: ISEO;
  initialPage: number;
}) {
  const router = useRouter();
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSearchSort, setLoadingSearchSort] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  // Makers without a single offer are noise for a visitor; hidden by default, one tap to show.
  const [onlyWithOffers, setOnlyWithOffers] = useState(true);
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

      const matchesSearch =
        debouncedQuery === "" ||
        displayName.includes(debouncedQuery) ||
        maker.telegram_username.toLowerCase().includes(debouncedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [makers, debouncedQuery, activeFilter, onlyWithOffers]);

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
      router.push({ pathname: router.pathname, query: nextQuery });
    },
    [router.isReady, router.pathname, router.query, rawPage, totalPages],
  );

  const getPageHref = useCallback(
    (page: number) =>
      page > 1 ? `${router.pathname}?page=${page}` : router.pathname,
    [router.pathname],
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

  if (!makers?.length) return <>no makers</>;

  return (
    <>
      <UniversalSeo seo={effectiveSeo} />

      <BoxWrapper p="4" variant="no_contrast" mt="10" minH="100vh">
        <MakersHeader makers={makers} />

        <Box px="4" pb="2">
          <Text fontSize="sm" color="bg.300" maxW="720px">
            Частные обменники, подтвердившие аккаунт через Telegram. Сделка проходит напрямую
            между вами и мейкером: p2pie не участвует в обмене и не хранит средства — проверяйте
            отзывы и начинайте с небольших сумм.
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
              {`С предложениями · ${withOffersCount}`}
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
              {`Все · ${makers.length}`}
            </Button>
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
                Стать мейкером
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
                {onlyWithOffers
                  ? "Пока нет мейкеров с активными предложениями."
                  : "Ничего не найдено."}
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
