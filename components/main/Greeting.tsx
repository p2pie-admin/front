import {
  Box,
  Center,
  Collapse,
  Flex,
  Heading,
  HStack,
  SlideFade,
  Text,
  useColorModeValue,
  useToken,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import greetings from "../../public/greetings.png";

const Greeting = () => {
  const { t } = useTranslation();

  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.700"], ["bg.200", "peach.300"])
  );

  // const pmCodesToShowAsIcons = [
  //   "eth",
  //   "usdttrc20",
  //   "btc",
  //   "sberrub",
  //   "tcsbrub",
  // ];

  return (
    <VStack gap="-20" my="10">
      <Image
        alt={`${process.env.NEXT_PUBLIC_NAME} greetings`}
        src={greetings}
        width={300}
      />
      <Box
        mt="-20"
        bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 10%, ${peripheryColor} 70%)`}
        bgClip="text"
      >
        {/* <HStack>
        {pmCodesToShowAsIcons.map((code) => {
          const pm = pms.find(
            (pm) => pm.code.toLowerCase() == code.toLowerCase()
          );
          if (!pm) return <></>;
          return <CircularIcon size="lg" color={pm.color} icon={pm.icon} />;
        })}
      </HStack> */}
        <Heading
          as="h1"
          fontWeight="bold"
          color="inherit"
          fontSize={{ base: "3xl", md: "5xl" }}
          textAlign={"center"}
        >
          Все обменники в одном месте
        </Heading>
        <Heading
          as="p"
          textAlign="center"
          fontSize={{ base: "lg", md: "xl" }}
          mt={2}
          color="bg.400"
          fontWeight="light"
        >
          Поиск курсов обмена среди 1000+ обменников и p2p
          {/* {t("main:subtitle")} */}
        </Heading>
      </Box>
    </VStack>
  );
};

export default Greeting;
