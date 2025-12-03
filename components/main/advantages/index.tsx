import { HStack } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import Advantage from "./Advantage";
import plots from "../../../public/plots.png";
import dots from "../../../public/dots.png";
import hash from "../../../public/hash.png";
import HashAdvantage from "./HashAdvantage";
import DotsAdvantage from "./DotsAdvantage";
import PlotAdvantage from "./PlotAdvantage";

export default function Advantages() {
  return (
    <HStack gap="4" alignItems="stretch">
      <Advantage alt="advantage-dots" imageSrc={dots}>
        {(hovering) => <DotsAdvantage hovering={hovering} />}
      </Advantage>
      <Advantage alt="advantage-plot" imageSrc={plots}>
        {(hovering) => <PlotAdvantage hovering={hovering} />}
      </Advantage>
      <Advantage alt="advantage-hash" imageSrc={hash}>
        {(hovering) => <HashAdvantage hovering={hovering} />}
      </Advantage>
    </HStack>
  );
}
