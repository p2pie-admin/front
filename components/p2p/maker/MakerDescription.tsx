import { Box, Divider, HStack, Text } from "@chakra-ui/react";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { IoMdInformationCircle } from "react-icons/io";

import { ResponsiveText } from "../../../styles/theme/custom";
import { useT } from "../../../services/i18n";
import OwnerEdit from "./topPanel/OwnerEdit";

export default function MakerDescription({
  description,
  slug,
}: {
  description?: string | null;
  slug: string;
}) {
  const t = useT();
  return (
    <BoxWrapper>
      <HStack spacing="3" color="peach.200">
        <CustomHeader text={t("Описание", "Description")} Icon={IoMdInformationCircle} />
        <OwnerEdit slug={slug} place="description" />
      </HStack>
      <Divider my="4" />
      <Box px="2" color="bg.400">
        <Text color="bg.300">{description}</Text>
      </Box>
    </BoxWrapper>
  );
}
