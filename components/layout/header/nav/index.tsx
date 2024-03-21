import {
  Box,
  Button,
  useColorMode,
  Text,
  Flex,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import NavButton from "./NavButton";
import Link from "next/link";
import { WeatherSunny } from "@styled-icons/fluentui-system-filled/WeatherSunny";
import { i18n, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FiSun } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
import Location from "./location";
import MultipleCitiesContext from "./location/MultipleCitiesContext";

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const changeLanguageHandler = () => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: i18n.language === "en" ? "ru" : "en",
    });
  };
  return (
    <HStack spacing="2">
      {/* <Button variant="default" p="1" onClick={changeLanguageHandler}>
        <Text>{i18n.language === "en" ? "Ru" : "En"}</Text>
      </Button> */}
      <MultipleCitiesContext.Provider value={false}>
        <Location />
      </MultipleCitiesContext.Provider>
      <Button variant="contrast" p="1" onClick={toggleColorMode}>
        <AiOutlineMenu />
      </Button>

      {/* <NavButton handleClick={() => toggleColorMode()} icon={WeatherSunny} />
      <NavButton
        handleClick={changeLanguageHandler}
        icon={i18n.language === "en" ? "Ru" : "En"}
      /> */}
    </HStack>
  );
};

export default Nav;
