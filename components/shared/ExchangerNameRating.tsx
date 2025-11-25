import {
  VStack,
  useColorModeValue,
  Grid,
  Text,
  useToken,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";
import StarRatings from "react-star-ratings";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { ResponsiveText } from "../../styles/theme/custom";
import Rating from "../main/tv/Rating";
import CustomImage from "./CustomImage";
import { IImage } from "../../types/selector";
import Dot from "../exchangers/Dot";

const ExchangerName = ({
  name,
  logo,
  admin_rating,
  isH1 = false,
  statusColor = "green",
}: {
  name: string;
  logo?: IImage | null;
  admin_rating?: number | null;
  isH1?: boolean;
  statusColor?: "green" | "orange";
}) => {
  return (
    <HStack alignItems="center">
      <Box position="relative">
        <Box borderRadius="xl" overflow="hidden">
          <CustomImage img={logo} w="35px" h="35px" />
        </Box>
        <Box
          position="absolute"
          bottom="-1"
          right="-1"
          p="1"
          bgColor="bg.700"
          borderRadius="50%"
        >
          <Dot color={statusColor} />
        </Box>
      </Box>

      <Text as={isH1 ? "h1" : "p"} fontSize="2xl" fontWeight="bold">
        {capitalize(name)}
      </Text>
      <Rating rating={admin_rating} />
    </HStack>
  );
};

export default ExchangerName;
