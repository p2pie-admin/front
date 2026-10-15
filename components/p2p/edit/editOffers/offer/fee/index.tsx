import React from "react";
import { batch } from "react-redux";
import {
  Button,
  ButtonGroup,
  HStack,
  Input,
} from "@chakra-ui/react";
import { IFullOffer, IMakerOffer } from "../../../../../../types/p2p";
import { useAppDispatch } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import OfferSwitch from "../OfferSwitch";
import { useT } from "../../../../../../services/i18n";

export default function OfferFee({
  fullOffer,
}: {
  fullOffer: Partial<IFullOffer>;
}) {
  const dispatch = useAppDispatch();
  const t = useT();
  const offerIndex = fullOffer.index;
  const [feeKind, setFeeKind] = React.useState<"commission" | "surcharge">(
    "commission",
  );
  // What the maker is typing ("1.", "0.0"...): kept locally so the dot is not lost; null = show the stored value.
  const [draft, setDraft] = React.useState<string | null>(null);
  if (offerIndex === undefined) return null;

  const giveCur = fullOffer.givePm?.currency?.code?.toUpperCase();
  const getCur = fullOffer.getPm?.currency?.code?.toUpperCase();
  const feeType = fullOffer.fee_type;
  const feeAmount = fullOffer.fee_amount;
  const isFeeEnabled =
    fullOffer.fee_enabled ??
    (feeAmount !== null && feeAmount !== undefined ? true : Boolean(feeType));
  const derivedFeeKind =
    typeof feeAmount === "number"
      ? feeAmount < 0
        ? "surcharge"
        : "commission"
      : feeKind;

  const setField = (
    field: keyof Pick<IMakerOffer, "fee_amount" | "fee_type" | "fee_enabled">,
    value: IMakerOffer[keyof IMakerOffer] | null | undefined,
  ) => {
    dispatch(setP2PFullOfferField({ index: offerIndex, field, value }));
  };

  React.useEffect(() => {
    if (!isFeeEnabled) return;
    if (feeType) return;
    setField("fee_type", "percentage");
  }, [feeType, isFeeEnabled]);

  return (
    <HStack w="100%" spacing="4" mt="2" justifyContent="start">
      <OfferSwitch
        id={`offer-fee-${offerIndex}`}
        isChecked={isFeeEnabled}
        handleSwitch={(checked) => {
          batch(() => {
            setField("fee_enabled", checked);
            if (!checked) {
              setField("fee_amount", null);
              setField("fee_type", null);
            }
          });
        }}
      />
      <HStack
        spacing="4"
        // Phones: the unit buttons wrap to a second line instead of running off the card.
        flexWrap="wrap"
        rowGap="2"
        opacity={isFeeEnabled ? 1 : 0.3}
        pointerEvents={isFeeEnabled ? "auto" : "none"}
      >
        <ButtonGroup
          size="xs"
          isAttached
          borderRadius="lg"
          borderWidth="1px"
          borderColor="bg.600"
          sx={{ "> button": { h: "22px", minH: "22px", px: "2" } }}
        >
          <Button
            borderRadius="lg"
            onClick={() => {
              setFeeKind("commission");
              if (typeof feeAmount === "number") {
                setField("fee_amount", Math.abs(feeAmount));
              }
            }}
            bg={derivedFeeKind === "commission" ? "bg.700" : "transparent"}
          >
            {t("Комиссия", "Fee")}
          </Button>
          <Button
            borderRadius="lg"
            onClick={() => {
              setFeeKind("surcharge");
              if (typeof feeAmount === "number") {
                setField("fee_amount", -Math.abs(feeAmount));
              }
            }}
            bg={derivedFeeKind === "surcharge" ? "bg.700" : "transparent"}
          >
            {t("Доплата", "Surcharge")}
          </Button>
        </ButtonGroup>
        <Input
          value={draft ?? (typeof feeAmount === "number" ? String(Math.abs(feeAmount)) : "")}
          inputMode="decimal"
          borderWidth="1px"
          borderRadius="lg"
          size="xs"
          focusBorderColor="peach.200"
          w={110}
          pr="1"
          py="0"
          textAlign="end"
          placeholder={"0.00"}
          fontFamily="'Mozilla Text', monospace"
          fontSize="lg"
          _placeholder={{ color: "bg.500" }}
          onBlur={() => setDraft(null)}
          onChange={(event) => {
            const raw = event.target.value.replace(",", ".").trim();
            if (!/^\d*\.?\d*$/.test(raw)) return;
            setDraft(raw);
            if (raw === "" || raw === ".") {
              setField("fee_amount", null);
              return;
            }
            const parsed = Number(raw);
            if (!Number.isFinite(parsed)) return;
            setField(
              "fee_amount",
              derivedFeeKind === "surcharge" ? -parsed : parsed,
            );
          }}
        />
        <ButtonGroup
          size="xs"
          isAttached
          borderRadius="lg"
          borderWidth="1px"
          borderColor="bg.600"
          sx={{ "> button": { h: "22px", minH: "22px", px: "2" } }}
        >
          <Button
            borderRadius="lg"
            onClick={() => setField("fee_type", "percentage")}
            bg={feeType === "percentage" ? "bg.700" : "transparent"}
          >
            %
          </Button>
          <Button
            borderRadius="lg"
            onClick={() => setField("fee_type", "give")}
            bg={feeType === "give" ? "bg.700" : "transparent"}
          >
            {giveCur || "GIVE"}
          </Button>
          <Button
            borderRadius="lg"
            onClick={() => setField("fee_type", "get")}
            bg={feeType === "get" ? "bg.700" : "transparent"}
          >
            {getCur || "GET"}
          </Button>
        </ButtonGroup>
      </HStack>
    </HStack>
  );
}

// лучший курс в обменниках  на Х% выгоднее для клиента, чем твой
// при обмене 100$ клиент получит 107$
