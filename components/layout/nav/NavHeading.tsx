import { HStack } from "@chakra-ui/react";
import Language from "./Language";

import DarkLightTheme from "./DarkLightTheme";
import SearchAll from "./search";

export const NavHeading = () => {
  return (
    <HStack>
      <SearchAll />
      {/* <Language /> */}
      <DarkLightTheme />
    </HStack>
  );
};

export default NavHeading;
