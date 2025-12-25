import { Box } from "@chakra-ui/react";
import SideContext from "../shared/contexts/SideContext";
import ReverseButton from "./ReverseButton";
import Side from "./side";

const Calculator = ({
  givePmHasArticle,
  getPmHasArticle,
}: {
  givePmHasArticle: boolean;
  getPmHasArticle: boolean;
}) => {
  return (
    <Box>
      <SideContext.Provider value={"give"}>
        <Side pmHasArticle={givePmHasArticle} />
      </SideContext.Provider>

      <ReverseButton />

      <SideContext.Provider value={"get"}>
        <Side pmHasArticle={getPmHasArticle} />
      </SideContext.Provider>
    </Box>
  );
};

export default Calculator;
