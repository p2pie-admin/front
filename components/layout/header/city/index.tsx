import { Box } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Arrow from "../../../shared/Arrow";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { ResponsiveButton } from "../../../../styles/theme/custom";
import CustomModal from "../../../shared/CustomModal";
import Countries from "./Countries";
import React from "react";
import { useRouter } from "next/router";
import { useLocale, useT } from "../../../../services/i18n";

const CitySelector = ({ forceVisible }: { forceVisible?: boolean }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();

  const path = router.asPath;
  const currentCityName = useAppSelector(
    (state) => state.main?.city[`${locale}_name`] || state.main?.city?.ru_name
  );

  const dispatch = useAppDispatch();

  const lastString = path.split("/")[path.split("/").length - 1];
  let pageType;
  const isCash =
    lastString.startsWith("cash-") || lastString.includes("-cash-");
  const isMapPage = path.includes("map/");
  const isMassPage = path.includes("sell/") || path.includes("buy/");

  if (isCash) pageType = "cash";
  if (isMapPage) pageType = "map";
  if (isMassPage) pageType = "mass";
  if (!forceVisible && !isCash && !isMapPage && !isMassPage) return <></>;

  return (
    // minW=0 + maxW on the button: the header gives the city whatever is left after the logo, the
    // language switch and the menu button; a name that does not fit is cut with an ellipsis.
    <Box minW="0">
      <CustomModal id="location" header={t("Выберите город:", "Choose a city:")}>
        <Countries pageType={pageType} />
      </CustomModal>

      <ResponsiveButton
        variant="default"
        p="1"
        mx={{ base: 0, sm: 2 }}
        maxW="100%"
        iconSpacing={{ base: 1, sm: 2 }}
        leftIcon={<FaMapMarkerAlt size="1.2rem" />}
        rightIcon={
          // Phones: no dropdown arrow, the width goes to the city name.
          <Box as="span" display={{ base: "none", sm: "inline-flex" }}>
            <Arrow isUp={false} />
          </Box>
        }
        onClick={() => dispatch(triggerModal("location"))}
      >
        <Box
          as="span"
          minW="0"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {currentCityName || t("Город", "City")}
        </Box>
      </ResponsiveButton>
    </Box>
  );
};

export default CitySelector;
