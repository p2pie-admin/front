import {
  Box,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";

import { IPm } from "../../../types/selector";
import { ResponsiveText } from "../../../styles/theme/custom";
import CircularIcon from "../../shared/CircularIcon";

const CryptoPm = ({ cryptoPm }: { cryptoPm: IPm }) => {
  return (
    <Link href={`/articles/${cryptoPm.en_name.toLowerCase()}`} passHref>
      <HStack alignItems="center">
        <CircularIcon
          iconAlt={cryptoPm.en_name}
          small
          color={cryptoPm.color}
          icon={cryptoPm.icon}
        />
        <Box position="relative">
          <ResponsiveText size="sm" variant="primary" fontWeight="bold">
            {`${cryptoPm.currency.code.toUpperCase()}`}
          </ResponsiveText>
          <ResponsiveText
            size="xs"
            position="absolute"
            top="2px"
            right="-12"
          >{`${cryptoPm.subgroup_name?.toUpperCase() || ""}`}</ResponsiveText>
        </Box>
      </HStack>
    </Link>
  );
};

export default CryptoPm;
