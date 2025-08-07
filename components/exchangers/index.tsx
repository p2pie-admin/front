import { Box, Center, Grid, Spinner } from "@chakra-ui/react";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { Box3D } from "../../styles/theme/custom";
import ExchangerPreview from "./index";
import { getStatus } from "./helper";
import TopPanel from "./TopPanel";
import ExchangersHeader from "./ExchangersHeader";
import ExchangerLink from "./ExchangerLink";

import UniversalSeo from "../shared/UniversalSeo";

import { ISEO } from "../../types/general";

export default function ExchangersList({
  exchangers,
  seo,
}: {
  exchangers: (IExchanger & IParserExchanger)[] | null;
  seo: ISEO;
}) {
  const [sortCriteria, setSortCriteria] = useState<
    "name" | "total_rates" | "admin_rating"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSearchSort, setLoadingSearchSort] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(30);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadMore = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 30);
      }
    });

    if (node) observerRef.current.observe(node);
  }, []);

  const toggleFilter = (status: string) => {
    setLoadingSearchSort(true);
    setActiveFilter((prev) => (prev === status ? null : status));
  };

  const toggleSort = (criteria: typeof sortCriteria) => {
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

  const filteredExchangers = useMemo(() => {
    return exchangers?.filter((exchanger) => {
      const matchesFilter =
        activeFilter === null || activeFilter === getStatus(exchanger);

      const matchesSearch =
        debouncedQuery === "" ||
        exchanger.name.toLowerCase().includes(debouncedQuery) ||
        exchanger?.ref_link?.toLowerCase().includes(debouncedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [exchangers, debouncedQuery, activeFilter]);

  const sortedExchangers = useMemo(() => {
    const sorted = filteredExchangers?.slice().sort((a, b) => {
      let result = 0;

      if (sortCriteria === "name") {
        result = a.name.localeCompare(b.name, "ru", { sensitivity: "base" });
      } else if (sortCriteria === "total_rates") {
        result = (a.total_rates || 0) - (b.total_rates || 0);
      } else if (sortCriteria === "admin_rating") {
        result =
          (Number(a?.admin_rating) || 0) - (Number(b?.admin_rating) || 0);
      }

      return sortDirection === "asc" ? result : -result;
    });

    return sorted;
  }, [filteredExchangers, sortCriteria, sortDirection]);

  const visibleExchangers = useMemo(
    () => sortedExchangers?.slice(0, visibleCount),
    [sortedExchangers, visibleCount]
  );

  if (!exchangers?.length) return <>no exchangers</>;

  return (
    <>
      <UniversalSeo seo={seo} />

      <Box3D p="4" variant="no_contrast" mt="10" minH="100vh">
        <ExchangersHeader exchangers={exchangers} />

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
                <Spinner
                  size="xl"
                  thickness="4px"
                  speed="0.7s"
                  color="blue.400"
                />
              </Center>
            ) : (
              <Grid
                gap="4"
                justifyItems="center"
                gridTemplateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
              >
                {visibleExchangers?.map((exchanger) => (
                  <ExchangerLink key={exchanger.id} exchanger={exchanger} />
                ))}
              </Grid>
            )}
            <div ref={loadMore} style={{ height: "1px" }} />
          </Box>
        </Box>
      </Box3D>
    </>
  );
}
