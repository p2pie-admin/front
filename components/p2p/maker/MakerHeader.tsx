import { Divider, HStack, Tag, VStack } from "@chakra-ui/react";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IMaker } from "../../../types/p2p";
import { getMakerDisplayName } from "../makers/helper";
import ExchangerTopPanel from "../../exchangers/exchanger/exchangerTopPanel";
import { IExchanger, IExchangerTag } from "../../../types/exchanger";
import MakerStats from "../edit/stats";
import MakerTopPanel from "./topPanel";

export default function MakerHeader({ maker }: { maker: IMaker }) {
  const displayName = getMakerDisplayName(maker);
  const nameFallback = displayName || String(maker.id);

  return (
    <BoxWrapper variant="no_contrast">
      <VStack alignItems="start" gap="4" w="100%">
        <MakerTopPanel maker={maker} />

        <HStack spacing="3" w="100%" justifyContent="space-between">
          <HStack spacing="3">
            <ResponsiveText size="sm" color="bg.400" variant="primary">
              {`ID ${maker.slug}`}
            </ResponsiveText>
            {maker.status ? (
              <Tag colorScheme="orange">{maker.status.toUpperCase()}</Tag>
            ) : null}
          </HStack>

        </HStack>

        <Divider mb="2" />
        <MakerStats maker={maker} />
      </VStack>
    </BoxWrapper>
  );
}
