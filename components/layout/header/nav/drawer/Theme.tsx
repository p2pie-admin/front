import { useColorMode } from "@chakra-ui/react";
import { WeatherSunny } from "styled-icons/fluentui-system-filled";
import NavButton from "../NavButton";
import { TbMoonFilled } from "react-icons/tb";

const Theme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <NavButton
      handleClick={() => toggleColorMode()}
      icon={colorMode === "light" ? TbMoonFilled : WeatherSunny}
    />
  );
};

export default Theme;
