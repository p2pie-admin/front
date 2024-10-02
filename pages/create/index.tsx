import MenuFooter from "../../components/main/menu-footer";
import PopularRates from "../../components/main/menu-footer/popular-rates";
import QuickChange from "../../components/main/menu-footer/popular-pms";
import { Box3D, RegularBox, ResponsiveText } from "../../styles/theme/custom";
import { Box, Center, Text } from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import LinkButton from "../../components/shared/LinkButton";

const CreateExchanger = () => {
  return (
    <Box3D
      variant="contrast"
      minH="70vh"
      px="6"
      py="4"
      fontSize="lg"
      w={{ base: "100%", md: 600 }}
    >
      <Text fontSize="2xl" fontWeight="bold" my="2">
        Create Exchanger
      </Text>
      <Text>
        Service p2pie suggests custom exchange pages and telegram bots for your
        own p2p rates. After suggesting rates you will get your own links to
        exchanger that looks like this:
      </Text>
      <Center m="5">
        <Box>
          <QuickChange />
        </Box>
      </Center>

      <Text size="lg">Or like this:</Text>
      <Center m="5">
        <Box>
          <PopularRates />
        </Box>
      </Center>

      <Text size="lg">
        The content will depend on what exchange directions you suggest. Please
        contact our support team for more information.
      </Text>
      <Center w="100%" my="5">
        <LinkButton
          message="Suggest Exchange"
          href={"/order"}
          CustomIcon={FiPlusCircle}
        />
      </Center>
    </Box3D>
  );
};

export default CreateExchanger;
