import { BsTelegram } from "react-icons/bs";
import LinkButton from "../../shared/LinkButton";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { exchangerNameToSlug } from "../../exchangers/helper";
import Link from "next/link";
import { useT } from "../../../services/i18n";

const FoundError = () => {
  const t = useT();
  return (
    <Box w="100%">
      <Link
        passHref
        href={String(process.env.NEXT_PUBLIC_TELEGRAM_CHAT)}
        color="inherit"
      >
        <VStack
          bgColor="blackAlpha.100"
          _hover={{ bgColor: "blackAlpha.200" }}
          mt="10"
          p="4"
          justifyContent="center"
          borderRadius="lg"
          gap="2"
        >
          <ResponsiveText variant="no_contrast" size="lg">
            {t("Есть замечания?", "Any remarks?")}
          </ResponsiveText>
          <HStack>
            <ResponsiveText variant="shaded" size="sm">
              {t("Обсудить в чате →", "Discuss in the chat →")}
            </ResponsiveText>
            <BsTelegram size="1.2rem" />
          </HStack>
        </VStack>
      </Link>
    </Box>
  );
};

export default FoundError;
