import {
  Box,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { IMassDirTextId, IMassRate } from "../../../types/mass";
import { IPm } from "../../../types/selector";
import NextLink from "next/link";
import course from "next-seo/lib/jsonld/course";
import logo from "next-seo/lib/jsonld/logo";

import {
  addSpaces,
  R,
  localFormat,
  curToSymbol,
} from "../../../redux/amountsHelper";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import CustomImage from "../../shared/CustomImage";
import { redirect } from "../../../redux/thunks";
import { useAppDispatch } from "../../../redux/hooks";
import { useIsMobile } from "../../main/tv/hooks";
import PmName from "../../shared/PmName";
import CircularIcon from "../../shared/CircularIcon";
import MassFiat from "./MassFiat";
import Rating from "../../main/tv/Rating";
import TopParameter from "../../main/tv/TopParameter";
import SmartGrid from "./SmartGrid";

const MassRate = ({
  rate,
  pmsByCodes,
  massDirTextId,
}: {
  rate: IMassRate;
  pmsByCodes: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
}) => {
  const { name, admin_rating, course, min, max, ref_link, codes, logo } = rate;
  const { code, currency } = massDirTextId;
  const symbol = curToSymbol(currency.code);

  const side = course > 1 ? "give" : "get";

  const bgColor = useColorModeValue("bg.10", "bg.700");
  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];

  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  if (!rate) return <></>;

  return (
    <Box3D variant="extra_contrast">
      <Grid
        key={rate.exchangerId + rate.course}
        gridTemplateColumns="1fr 3rem 100px 1fr  1fr"
        w="100%"
        gap="2"
        my="2"
        px="2"
        py="1.5"
      >
        <HStack
          alignItems="center"
          cursor="pointer"
          onClick={() => {
            dispatch(redirect());
            window.open(ref_link, "_blank");
          }}
        >
          <Box borderRadius="xl" overflow="hidden">
            <CustomImage img={logo} w="35px" h="35px" />
          </Box>

          <ResponsiveText
            variant="primary"
            size={name.length > 10 ? "md" : "lg"}
            fontWeight="bold"
          >
            {capitalize(name)}
          </ResponsiveText>
        </HStack>
        <Rating rating={rate.admin_rating || 4.4} />

        <SmartGrid>
          {rate.parameterCodes.map((code, i) => (
            <TopParameter
              isExtended={false}
              code={code}
              key={code + i + "mobile"}
            />
          ))}
        </SmartGrid>
        <VStack alignItems="end" gap="0">
          <ResponsiveText size="sm" mt="1" variant="contrast">
            {`1 ${code} ≈ ${
              course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
            } ${symbol}`}
          </ResponsiveText>
          <ResponsiveText size="xs" variant="no_contrast">
            {`${localFormat(MIN, currency.code)} — ${localFormat(
              MAX,
              currency.code
            )}`}
          </ResponsiveText>
        </VStack>

        <MassFiat codes={rate.codes} pmsByCodes={pmsByCodes} />
      </Grid>
    </Box3D>
  );
};

export default MassRate;
