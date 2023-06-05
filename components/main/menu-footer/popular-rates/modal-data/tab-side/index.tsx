import { Box, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { useAppSelector } from "../../../../../../redux/hooks";
import { Box3D } from "../../../../../../styles/theme/wrappers";
import { IPopularRate } from "../../../../../../types/rates";
import SideContext from "../../../../../shared/SideContext";
import RateLayer from "./RateLayer";

const TabSide = () => {
  const side = useContext(SideContext) as "buy" | "sell";
  const popularRatePairs = useAppSelector((state) =>
    state.main.popularRates
      ? Object.entries(state.main.popularRates).map(([code, rate]) => [
          code,
          rate?.[side],
        ])
      : []
  );

  return (
    <Box>
      {popularRatePairs.map((ratePair) => (
        <RateLayer
          code={ratePair[0] as string}
          rates={ratePair[1] as IPopularRate[]}
        />
      ))}
    </Box>
  );
};

export default TabSide;
