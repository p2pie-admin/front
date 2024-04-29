import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IOrderIntro } from "../../../types/p2p";

import CustomImage from "../../shared/CustomImage";
import { useTranslation } from "next-i18next";

const IntroItem = ({ introItem }: { introItem: IOrderIntro }) => {
  const { id, image } = introItem;
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ru";
  return (
    <VStack key={id} justifyContent="start">
      <CustomImage img={image} w="100" h="100" />
      <ResponsiveText whiteSpace="normal" variant="primary" fontWeight="bold">
        {introItem[`${lang}_header`]}
      </ResponsiveText>
      <HStack h="100%" alignItems="start" px={[1, 2]}>
        <ResponsiveText whiteSpace="normal" w="100%">
          {introItem[`${lang}_description`]}
        </ResponsiveText>
      </HStack>
    </VStack>
  );
};

export default IntroItem;
