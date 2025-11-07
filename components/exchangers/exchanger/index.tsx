import React from "react";
import {
  IDotColors,
  IExchanger,
  IParserExchanger,
} from "../../../types/exchanger";
import { Box, Button, Center, HStack, Spinner } from "@chakra-ui/react";

import { Box3D, ResponsiveText } from "../../../styles/theme/custom";

import UniversalSeo from "../../shared/UniversalSeo";
import { ISEO } from "../../../types/general";
import ExchangerCard from "./description";
import { TbExternalLink } from "react-icons/tb";
import { LinkWrapper } from "../../exchange/pmLayout/LinkWrapper";
import ExchangerName from "../../shared/ExchangerNameRating";
import Dot from "../Dot";
import { FaRegCommentDots } from "react-icons/fa6";

export default function Exchanger({
  exchanger,
  seo,
}: {
  exchanger: IExchanger & IParserExchanger;
  seo: ISEO;
}) {
  if (!exchanger || !exchanger.ref_link) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  }

  //const status = exchanger.status == "active" ? "Активен" : "Приостановлен";
  const color =
    exchanger.status == "active" ? "green" : ("orange" as IDotColors);

  return (
    <>
      <UniversalSeo seo={seo} />

      <Box p="4" mt="10">
        <LinkWrapper
          url={exchanger.ref_link}
          articleExists={!!exchanger.ref_link}
        >
          <HStack w="100%" justifyContent="space-between">
            <HStack gap="4">
              <Dot color={color} />
              <ExchangerName
                name={exchanger.name}
                logo={exchanger.logo}
                admin_rating={exchanger.admin_rating}
                isH1={true}
              />
            </HStack>
            <HStack gap="4">
              <Button rightIcon={<FaRegCommentDots size="1rem" />}>
                Оставить отзыв
              </Button>
              <Button
                variant="primary"
                rightIcon={<TbExternalLink size="1rem" />}
              >
                Обмен
              </Button>
            </HStack>
          </HStack>
        </LinkWrapper>

        <ExchangerCard exchangerCard={exchanger.exchanger_card} />
      </Box>
    </>
  );
}
