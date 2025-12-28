import {
  Box,
  Center,
  Collapse,
  Flex,
  Heading,
  HStack,
  SlideFade,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToken,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import greetings from "../../public/greetings.png";
import CustomTitle from "../shared/CustomTitle";

const Greeting = () => {
  const { t } = useTranslation();

  return (
    <VStack
      gap={{ base: "4", lg: "-20" }}
      my={{ base: "4", lg: "10" }}
      zIndex="1"
    >
      <Image
        alt={`${process.env.NEXT_PUBLIC_NAME} greetings`}
        src={greetings}
        width={250}
        priority
      />
      <CustomTitle
        as="h1"
        mt="-20"
        mb="0"
        title={"Все обменники в одном месте"}
        subtitle={"Поиск курсов обмена среди 1000+ обменников и p2p"}
      />
    </VStack>
  );
};

export default Greeting;
