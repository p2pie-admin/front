import { Heading, HStack, VStack, Text } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IMassDirText, IMassDirTextId, IMassRate } from "../../types/mass";
import { IPm } from "../../types/selector";
import { useEffect } from "react";
import { fetchTopParameters } from "../../redux/thunks";
import { useAppDispatch } from "../../redux/hooks";
import MassTable from "./table";
import MassSideContext from "./sideContext";

const Mass = ({
  massDirTextId,
  massDirText,
  massRates,
  pmsByCodes,
  isSell,
}: {
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  pmsByCodes: Record<string, IPm>;
  isSell: boolean;
}) => {
  const { header, subheader, text } = massDirText;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopParameters());
  }, []);

  return (
    <MassSideContext.Provider value={isSell}>
      <VStack gap="5" mt={["2", "8"]}>
        <Box3D variant="no_contrast" w="100%" px={["2", "8"]} py={["4", "8"]}>
          <Heading
            fontSize={{ base: "2xl", lg: "4xl" }}
            as="h1"
            fontWeight="bold"
            variant="extra_contrast"
          >
            {header}
          </Heading>
          <ResponsiveText
            fontSize={{ base: "lg", lg: "xl" }}
            as="h2"
            variant="contrast"
          >
            {subheader}
          </ResponsiveText>
          <ResponsiveText whiteSpace="unset" variant="no_contrast">
            {text}
          </ResponsiveText>

          <MassTable
            massRates={massRates}
            pmsByCodes={pmsByCodes}
            massDirTextId={massDirTextId}
          />
        </Box3D>
      </VStack>
    </MassSideContext.Provider>
  );
};

export default Mass;
