import { Box, Button, HStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setMassPmsFilter } from "../../../../redux/mainReducer";
import { IPm } from "../../../../types/selector";
import { getPmNameFromPm } from "../../../shared/helper";
import PmIcon from "../../../shared/PmIcon";

// Phone replacement for the icon-stack dropdown: one horizontally scrollable row of
// payment-method chips. Multi-select; "Все" clears the filter.
const PaymentChips = ({ fiatPms }: { fiatPms: Record<string, IPm> }) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.main.massPmsFilter);
  const codes = Object.keys(fiatPms);
  if (codes.length < 2) return null;
  // "Cash" appears once per currency; add the currency so the chips are distinguishable.
  const labelOf = (code: string) => {
    const pm = fiatPms[code];
    const base = getPmNameFromPm(pm, true) || getPmNameFromPm(pm);
    const dup = codes.some((c) => c !== code && (getPmNameFromPm(fiatPms[c], true) || getPmNameFromPm(fiatPms[c])) === base);
    return dup && pm.currency?.code ? `${base} ${pm.currency.code.toUpperCase()}` : base;
  };

  const toggle = (code: string) => {
    const next = selected.includes(code)
      ? selected.filter((c) => c !== code)
      : [...selected, code];
    dispatch(setMassPmsFilter(next));
  };

  const chip = (active: boolean, onClick: () => void, children: any, key: string) => (
    <Button
      key={key}
      size="sm"
      h="36px"
      flexShrink={0}
      borderRadius="full"
      variant={active ? "solid" : "outline"}
      borderColor="bg.500"
      color={active ? "bg.900" : "bg.200"}
      bgColor={active ? "peach.300" : "transparent"}
      _hover={{}}
      onClick={onClick}
      leftIcon={undefined}
    >
      {children}
    </Button>
  );

  return (
    <Box
      w="100%"
      overflowX="auto"
      sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
      mx="-2"
      px="2"
    >
      <HStack spacing="2" w="max-content" py="1">
        {chip(!selected.length, () => dispatch(setMassPmsFilter([])), "Все", "all")}
        {codes.map((code) =>
          chip(
            selected.includes(code),
            () => toggle(code),
            <HStack spacing="1.5">
              <Box transform="scale(0.8)" mx="-1">
                <PmIcon pm={fiatPms[code]} />
              </Box>
              <Box as="span">{labelOf(code)}</Box>
            </HStack>,
            code,
          ),
        )}
      </HStack>
    </Box>
  );
};

export default PaymentChips;
