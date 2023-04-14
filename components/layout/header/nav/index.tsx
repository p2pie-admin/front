import { Box, Button, useColorMode, Text, Flex } from "@chakra-ui/react";
import NavButton from "./NavButton";
import { WeatherSunny } from "@styled-icons/fluentui-system-filled/WeatherSunny";
import { i18n, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FiSun } from "react-icons/fi";

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
    <Flex w="24" justifyContent="space-between">
      <Button variant="black" p="1">
        <FiSun />
      </Button>
      <Button variant="black" p="1">
        <Text>{i18n.language === "en" ? "Ru" : "En"}</Text>
      </Button>

      {/* <NavButton handleClick={() => toggleColorMode()} icon={WeatherSunny} />
      <NavButton
        handleClick={changeLanguageHandler}
        icon={i18n.language === "en" ? "Ru" : "En"}
      /> */}
    </Flex>
  );
};

export default Nav;
