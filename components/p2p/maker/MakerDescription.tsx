import { Box, Divider, Text } from "@chakra-ui/react";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { IoMdInformationCircle } from "react-icons/io";

import { ResponsiveText } from "../../../styles/theme/custom";
import { useT } from "../../../services/i18n";

export default function MakerDescription({
  description,
}: {
  description?: string | null;
}) {
  const t = useT();
  return (
    <BoxWrapper>
      <CustomHeader text={t("Описание", "Description")} Icon={IoMdInformationCircle} />
      <Divider my="4" />
      <Box px="2" color="bg.400">
        <Text color="bg.300">{description}</Text>
      </Box>
    </BoxWrapper>
  );
}
