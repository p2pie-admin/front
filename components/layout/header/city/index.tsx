import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt } from "react-icons/fa";
import Arrow from "../../../shared/Arrow";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { ResponsiveButton } from "../../../../styles/theme/custom";
import CustomModal from "../../../shared/CustomModal";
import Countries from "./Countries";
import React from "react";
import { useRouter } from "next/router";

const CitySelector = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router as { locale: "en" | "ru" };
  const { exchange: slug } = router.query as { exchange: string };
  const currentCity = useAppSelector(
    (state) => state.main?.city[`${locale}_name`]
  );

  const dispatch = useAppDispatch();
  if (!slug || !(slug.startsWith("cash-") || slug.includes("-cash-")))
    return <></>;
  return (
    <Box>
      <CustomModal id="location" header={t("main:chooseCity")}>
        <Countries />
      </CustomModal>

      <ResponsiveButton
        variant="default"
        p="1"
        mx="2"
        leftIcon={<FaMapMarkerAlt size="1.2rem" />}
        rightIcon={<Arrow isUp={false} />}
        onClick={() => dispatch(triggerModal("location"))}
      >
        {currentCity || t("main:city")}
      </ResponsiveButton>
    </Box>
  );
};

export default CitySelector;
