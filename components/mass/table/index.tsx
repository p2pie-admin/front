import React, { useMemo, useState } from "react";
import { Box3D } from "../../../styles/theme/custom";
import { IMassRate, IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";
import { pickKeys } from "../helper";
import MassRate from "./massRate";
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

  const massSort = useAppSelector((state) => state.main.massSort);

  const massAmount = useAppSelector((state) => state.main.massAmount);

  const filteredMassRates = massPmsFilter?.length
    ? massRates.filter((mr) =>
        mr.codes.some((code) => filterSet.has(code.toLowerCase()))
      )
    : massRates;

  const sortedMassRates = useMemo(() => {
    const { direction, key } = massSort;
    const sorted = filteredMassRates?.sort((a, b) => {
      let result = 0;

      if (key === "course") {
        result = (a.course || 0) - (b.course || 0);
      } else if (key === "limit") {
        result =
          direction === "asc"
            ? (a.min.give || 0) - (b.min.give || 0)
            : (a.max.give || 0) - (b.max.give || 0);
      } else if (key === "admin_rating") {
        result =
          (Number(a?.admin_rating) || 0) - (Number(b?.admin_rating) || 0);
      }

      return direction === "asc" ? result : -result;
    });

    return sorted;
  }, [massAmount, filteredMassRates, massSort]);

  return (
    <Box>
      <Box3D px={["1", "4"]} py={["2", "4"]} variant="extra_contrast">
        <TopPanel pmsByCodes={pmsByCodes} massDirTextId={massDirTextId} />
      </Box3D>

      <Box py={["1", "2"]}>
        {sortedMassRates.map((rate) => {
          const pms = pickKeys(pmsByCodes, rate.codes);
          return (
            <MassRate
              rate={rate}
              pmsByCodes={pms}
              massDirTextId={massDirTextId}
              massAmount={massAmount}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default MassTable;
