import { Theme, useColorMode } from "@chakra-ui/react";
import { WeatherSunny } from "styled-icons/fluentui-system-filled";

import { TbMoonFilled } from "react-icons/tb";
import NavButton from "./NavButton";

const DarkLightTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <NavButton
      handleClick={() => toggleColorMode()}
      icon={colorMode === "light" ? TbMoonFilled : WeatherSunny}
    />
  );
};

export default DarkLightTheme;
