import { Divider, Grid, Box, VStack, HStack, Button, Link } from "@chakra-ui/react";
import { dealLink } from "../../../../services/p2pSanctions";
import { IoMdListBox } from "react-icons/io";
import { addSpaces } from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IMaker } from "../../../../types/p2p";
import { IPm } from "../../../../types/selector";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

import Offer from "./Offer";
import OfferDetails from "./OfferDetails";
import { useT } from "../../../../services/i18n";

// Anchor of the offers block: deals start from an offer, so "Начать сделку" buttons elsewhere scroll here.
export const MAKER_OFFERS_ID = "maker-offers";
export const scrollToMakerOffers = () => {
  if (typeof window === "undefined") return;
  const target = document.getElementById(MAKER_OFFERS_ID);
  if (!target) return;
  window.scrollTo({ top: Math.max(target.getBoundingClientRect().top + window.pageYOffset - 100, 0), behavior: "smooth" });
};

export default function MakerOffers({
  offers,
  pms,
}: {
  offers: IMaker["offers"];
  pms: IPm[] | null;
}) {
  const t = useT();
  const pmsByCode = new Map<string, IPm>();
  (pms || []).forEach((pm) => {
    if (pm?.code) {
      pmsByCode.set(pm.code.toUpperCase(), pm);
    }
  });
  return (
    <BoxWrapper id={MAKER_OFFERS_ID}>
      <CustomHeader text={t("Предложения", "Offers")} Icon={IoMdListBox} />
      <Divider my="4" />
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap="4"
        px="2"
      >
        {offers?.map((offer) => (
          <Box key={offer.id} p="4" borderRadius="xl" bg="bg.900">
            <Offer offer={offer} pmsByCode={pmsByCode} />
            <OfferDetails offer={offer} />
            {offer.isActive !== false && (
              <Button
                as={Link}
                href={dealLink(offer.id)}
                isExternal
                rel="nofollow noopener"
                mt="3"
                size="sm"
                w="full"
                colorScheme="green"
                _hover={{ textDecoration: "none" }}
              >
                {t("Начать сделку", "Start a deal")}
              </Button>
            )}
          </Box>
        )) || null}
      </Grid>
    </BoxWrapper>
  );
}
