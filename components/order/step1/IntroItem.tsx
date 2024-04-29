import { Box, Center, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IOrderIntro } from "../../../types/p2p";

import CustomImage from "../../shared/CustomImage";
import { useTranslation } from "next-i18next";

const IntroItem = ({ introItem }: { introItem: IOrderIntro }) => {
  const { id, image } = introItem;
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "ru";
  return (
    <Flex flexDir={["row", "column"]} key={id} justifyContent="start">
      <Center>
        <CustomImage img={image} w="100" h="100" />
      </Center>

      <VStack
        w={["calc(100% - 100px)", "100%"]}
        justifyContent="center"
        alignItems={["start", "center"]}
      >
        <ResponsiveText
          whiteSpace="normal"
          variant="primary"
          size="lg"
          fontWeight="bold"
        >
          {introItem[`${lang}_header`]}
        </ResponsiveText>
        <Box h="100%" px={[0, 2]}>
          <ResponsiveText whiteSpace="normal" w="100%">
            {introItem[`${lang}_description`]}
          </ResponsiveText>
        </Box>
      </VStack>
    </Flex>
  );
};

export default IntroItem;
