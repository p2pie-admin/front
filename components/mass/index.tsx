import { Heading, HStack, VStack, Text } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IPm, IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
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
  cryptoPms,
  isSell,
  slug,
}: {
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  fiatPms: Record<string, IPm>;
  cryptoPms: IPm[];
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
        <MassTableSelector slug={slug} cryptoPms={cryptoPms} />

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
