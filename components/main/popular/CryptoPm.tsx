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
          size="sm"
          color={cryptoPm.color}
          icon={cryptoPm.icon}
        />
        <Box position="relative">
          {/* <ResponsiveText size="sm" variant="primary" fontWeight="bold">
            {`${cryptoPm.currency.code.toUpperCase()}`}
          </ResponsiveText> */}
          <ResponsiveText
            fontSize="10px"
            fontWeight="bold"
            position="absolute"
            top="2"
            right="-5"
            variant="no_contrast"
          >{`${cryptoPm.subgroup_name?.toUpperCase() || ""}`}</ResponsiveText>
        </Box>
      </HStack>
    </Link>
  );
};

export default CryptoPm;
