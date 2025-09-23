import React, { useState } from "react";
import { Box3D } from "../../../styles/theme/custom";
import { IMassRate, IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";
import { pickKeys } from "../helper";
import MassRate from "./MassRate";

import { Box } from "@chakra-ui/react";

import TopPanel from "./topPanel";
import { useAppSelector } from "../../../redux/hooks";

function MassTable({
  massRates,
  pmsByCodes,
  massDirTextId,
}: {
  massRates: IMassRate[];
  pmsByCodes: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
}) {
  const massPmsFilter = useAppSelector((state) => state.main.massPmsFilter);
  const filterSet = new Set(massPmsFilter.map((f) => f.toLowerCase()));

  const filteredMassRates = massPmsFilter?.length
    ? massRates.filter((mr) =>
        mr.codes.some((code) => filterSet.has(code.toLowerCase()))
      )
    : massRates;

  return (
    <Box mt={["4", "8"]}>
      <Box3D px={["1", "4"]} py={["2", "4"]} variant="extra_contrast">
        <TopPanel
          pmsByCodes={pmsByCodes}
          toggleFilter={() => {}}
          activeFilter={""}
        />
      </Box3D>

      <Box py={["1", "2"]}>
        {filteredMassRates.map((rate) => {
          const pms = pickKeys(pmsByCodes, rate.codes);
          return (
            <MassRate
              rate={rate}
              pmsByCodes={pms}
              massDirTextId={massDirTextId}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default MassTable;

// const [sortCriteria, setSortCriteria] = useState<
//   "course" | "min" | "admin_rating"
// >("course");
// const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

// const [searchQuery, setSearchQuery] = useState("");
// const [loadingSearchSort, setLoadingSearchSort] = useState(false);
// const [activeFilter, setActiveFilter] = useState<string | null>("green");
// const [visibleCount, setVisibleCount] = useState(30);

// const toggleFilter = (status: string) => {
//   setLoadingSearchSort(true);
//   setActiveFilter((prev) => (prev === status ? null : status));
// };

// const toggleSort = (criteria: typeof sortCriteria) => {
//   setLoadingSearchSort(true);
//   if (sortCriteria === criteria) {
//     setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
//   } else {
//     setSortCriteria(criteria);
//     setSortDirection("desc");
//   }
// };

// const [debouncedQuery, setDebouncedQuery] = useState("");

// useEffect(() => {
//   setLoadingSearchSort(true);
//   const timeout = setTimeout(() => {
//     setDebouncedQuery(searchQuery.trim().toLowerCase());
//   }, 300);
//   return () => clearTimeout(timeout);
// }, [searchQuery]);

// useEffect(() => {
//   const timeout = setTimeout(() => {
//     setLoadingSearchSort(false);
//   }, 200);
//   return () => clearTimeout(timeout);
// }, [debouncedQuery, sortCriteria, sortDirection, activeFilter]);

// const filteredExchangers = useMemo(() => {
//   return exchangers?.filter((exchanger) => {
//     const matchesFilter =
//       activeFilter === null || activeFilter === getStatus(exchanger);

//     const matchesSearch =
//       debouncedQuery === "" ||
//       exchanger.name.toLowerCase().includes(debouncedQuery) ||
//       exchanger?.ref_link?.toLowerCase().includes(debouncedQuery);

//     return matchesFilter && matchesSearch;
//   });
// }, [exchangers, debouncedQuery, activeFilter]);

// const sortedExchangers = useMemo(() => {
//   const sorted = filteredExchangers?.slice().sort((a, b) => {
//     let result = 0;

//     if (sortCriteria === "name") {
//       result = a.name.localeCompare(b.name, "ru", { sensitivity: "base" });
//     } else if (sortCriteria === "total_rates") {
//       result = (a.total_rates || 0) - (b.total_rates || 0);
//     } else if (sortCriteria === "admin_rating") {
//       result =
//         (Number(a?.admin_rating) || 0) - (Number(b?.admin_rating) || 0);
//     }

//     return sortDirection === "asc" ? result : -result;
//   });

//   return sorted;
// }, [filteredExchangers, sortCriteria, sortDirection]);

// const visibleExchangers = useMemo(
//   () => sortedExchangers?.slice(0, visibleCount),
//   [sortedExchangers, visibleCount]
// );
