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

const ExchangerName = ({
  name,
  logo,
  admin_rating,
  isH1 = false,
}: {
  name: string;
  logo?: IImage | null;
  admin_rating?: number | null;
  isH1?: boolean;
}) => {
  return (
    <HStack>
      <Box borderRadius="xl" overflow="hidden">
        <CustomImage img={logo} w="35px" h="35px" />
      </Box>
      <ResponsiveText
        as={isH1 ? "h1" : "p"}
        size={name.length > 15 ? "md" : name.length > 10 ? "lg" : "xl"}
        fontWeight="bold"
        color="inherit"
      >
        {capitalize(name)}
      </ResponsiveText>
      <Rating rating={admin_rating} />
    </HStack>
  );
};

export default ExchangerName;
