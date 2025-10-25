import { Heading, HStack, VStack, Text } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import {
  ICryptoCodesName,
  IMassDirText,
  IMassDirTextId,
  IMassRate,
} from "../../types/mass";
import { IPm } from "../../types/selector";
import { useEffect } from "react";
import { fetchTopParameters } from "../../redux/thunks";
import { useAppDispatch } from "../../redux/hooks";
import MassTable from "./table";
import MassSideContext from "./sideContext";
import MassSelector from "./massSelector";
import MassTableSelector from "./massTableSelector";

const Mass = ({
  massDirTextId,
  massDirText,
  massRates,
  fiatPms,
  cryptoCodesNames,
  isSell,
  slug,
}: {
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  fiatPms: Record<string, IPm>;
  cryptoCodesNames: ICryptoCodesName[];
  isSell: boolean;
  slug: string;
}) => {
  const { header, subheader, text } = massDirText;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopParameters());
  }, []);

  return (
    <MassSideContext.Provider value={isSell}>
      <Heading
        fontSize={{ base: "2xl", lg: "4xl" }}
        as="h1"
        fontWeight="bold"
        variant="extra_contrast"
      >
        {header}
      </Heading>
      <ResponsiveText
        fontSize={{ base: "xl", lg: "2xl" }}
        as="h2"
        variant="contrast"
      >
        {subheader}
      </ResponsiveText>
      <ResponsiveText
        fontSize={{ base: "lg", lg: "xl" }}
        whiteSpace="unset"
        variant="no_contrast"
      >
        {text}
      </ResponsiveText>

      <VStack gap="5" mt={["2", "8"]}>
        <MassTableSelector slug={slug} cryptoCodesNames={cryptoCodesNames} />

        <MassTable
          massRates={massRates}
          fiatPms={fiatPms}
          massDirTextId={massDirTextId}
        />
      </VStack>
    </MassSideContext.Provider>
  );
};

export default Mass;
