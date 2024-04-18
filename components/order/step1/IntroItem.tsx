import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IOrderIntro } from "../../../types/p2p";
import Image from "next/image";
import CustomImage from "../../shared/CustomImage";
import image from "next/image";

const IntroItem = ({ introItem }: { introItem: IOrderIntro }) => {
  const { id, en_header, en_description, image } = introItem;

  return (
    <VStack justifyContent="start">
      <CustomImage img={image} w="50" h="50" />
      <ResponsiveText size="lg" variant="primary">
        {en_header}
      </ResponsiveText>
      <HStack h="100%" alignItems="start">
        <ResponsiveText whiteSpace="normal" w="100%">
          {en_description}
        </ResponsiveText>
        {+id % 3 && <Divider orientation="vertical" />}
      </HStack>
    </VStack>
  );
};

export default IntroItem;
