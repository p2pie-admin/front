import { HStack } from "@chakra-ui/react";
import Language from "./Language";

import DarkLightTheme from "./DarkLightTheme";
import GlobalSearch from "./globalSearch";

export const NavHeadingDesktopDesktop = () => {
  return (
    <HStack>
      <GlobalSearch />
      {/* <Language /> */}
      <DarkLightTheme />
    </HStack>
  );
};

export default NavHeadingDesktopDesktop;
