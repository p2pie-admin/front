import {
  Box,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";

import {
  curToSymbol,
  R,
  addSpaces,
  localFormat,
} from "../../../../redux/amountsHelper";
import { useAppDispatch } from "../../../../redux/hooks";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { IMassRate, IMassDirTextId } from "../../../../types/mass";
import { IPm } from "../../../../types/selector";
import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import { useIsMobile } from "../../../main/tv/hooks";
import Rating from "../../../main/tv/Rating";
import TopParameter from "../../../main/tv/TopParameter";
import CustomImage from "../../../shared/CustomImage";
import MassFiat from "../MassFiat";
import SmartGrid from "../SmartGrid";
import { redirect } from "../../../../redux/thunks";
import MassRateAmount from "./MassRateAmount";

const MassRate = ({
  rate,
  fiatPms,
  massDirTextId,
  massAmount,
}: {
  rate: IMassRate;
  fiatPms: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
  massAmount: { code?: string; value: string };
}) => {
  const { name, admin_rating, course, min, max, ref_link, codes, logo } = rate;
  const { code, currency } = massDirTextId;

  const amount =
    massDirTextId.code == massAmount.code
      ? course < 1
        ? (1 / course) * Number(massAmount.value)
        : course * Number(massAmount.value)
      : Number(massAmount.value);

  const side = course > 1 ? "give" : "get";

  const bgColor = useColorModeValue("bg.10", "bg.700");
  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];

  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  if (!rate) return <></>;

  return (
    <Grid
      key={rate.exchangerId + rate.course}
      gridTemplateColumns="1fr 3rem 100px 1fr  1fr"
      w="100%"
      gap={["2", "4"]}
      my="2"
      px="2"
      py="1.5"
      bgColor={
        amount && (MIN > amount || MAX < amount) ? "whiteAlpha.100" : "none"
      }
      borderRadius="lg"
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
          size={name.length > 14 ? "sm" : name.length > 10 ? "md" : "lg"}
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
        <MassRateAmount
          massDirTextId={massDirTextId}
          course={course}
          massAmount={massAmount}
        />
        <HStack gap="0.5">
          <ResponsiveText
            size="xs"
            variant={amount && MIN > amount ? "red" : "no_contrast"}
          >
            {`от ${localFormat(MIN, currency.code)}`}
          </ResponsiveText>
          <ResponsiveText size="xs" variant="no_contrast">
            {"—"}
          </ResponsiveText>
          <ResponsiveText
            size="xs"
            variant={amount && MAX < amount ? "red" : "no_contrast"}
          >
            {`до ${localFormat(MAX, currency.code)}`}
          </ResponsiveText>
        </HStack>
      </VStack>

      <MassFiat codes={rate.codes} fiatPms={fiatPms} />
    </Grid>
  );
};

export default MassRate;
