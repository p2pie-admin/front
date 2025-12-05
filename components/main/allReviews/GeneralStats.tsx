import { Flex, HStack, Tag } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiCopperCoinLine } from "react-icons/ri";
import { RiExchange2Line } from "react-icons/ri";
import { RiBarChartBoxLine } from "react-icons/ri";

const GeneralStat = ({
  colorScheme,
  text,
  icon,
}: {
  colorScheme: string;
  text: string;
  icon?: any;
}) => {
  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      align="center"
      justify="center"
      gap="2"
    >
      <Tag
        size="lg"
        px="3"
        py="2"
        colorScheme={colorScheme || "green"}
        border="1px solid"
        borderRadius="xl"
        mt="1.5"
      >
        {icon}
        <ResponsiveText ml="2" size="lg" color="inherit">
          {text}
        </ResponsiveText>
      </Tag>
    </Flex>
  );
};

export default function GeneralStats() {
  return (
    <HStack
      justifyContent="space-between"
      w="100%"
      px="4"
      mt="6"
      flexWrap="wrap"
      spacing="3"
    >
      <GeneralStat
        colorScheme="orange"
        text="Обменников: 670"
        icon={<RiCopperCoinLine size="1.5rem" />}
      />
      <GeneralStat
        colorScheme="purple"
        text="Направлений: 24 450"
        icon={<RiExchange2Line size="1.5rem" />}
      />
      <GeneralStat
        colorScheme="cyan"
        text="Курсов: 12 570 900"
        icon={<RiBarChartBoxLine size="1.5rem" />}
      />
    </HStack>
  );
}
