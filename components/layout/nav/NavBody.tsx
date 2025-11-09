import { FiHome, FiPlusCircle } from "react-icons/fi";
import { LiaTelegramPlane } from "react-icons/lia";
import { RiTokenSwapLine, RiMapPinLine, RiRobot2Line } from "react-icons/ri";
import LinkButton from "../../shared/LinkButton";
import { Button } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

import { LiaExchangeAltSolid } from "react-icons/lia";

const NavBody = () => {
  const { t } = useTranslation();
  const handleClearStorage = () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  };
  return (
    <>
      <LinkButton message={t("main:homePage")} href={"/"} CustomIcon={FiHome} />

      {/* <LinkButton
        message="Suggest Exchange"
        href={"/order"}
        CustomIcon={FiPlusCircle}
      />
      <LinkButton
        message="Create Exchanger"
        href={"/create"}
        CustomIcon={RiTokenSwapLine}
      /> */}
      <LinkButton
        message={t("main:exchangersPage")}
        href={"/exchangers"}
        CustomIcon={LiaExchangeAltSolid}
      />

      <LinkButton
        message={t("main:contactsPage")}
        href={`https://t.me/${process.env.NEXT_PUBLIC_NAME}`}
        CustomIcon={LiaTelegramPlane}
      />
      {/* <LinkButton
        message={t("main:botPage")}
        href={"https://t.me/p2pie_bot"}
        CustomIcon={RiRobot2Line}
      /> */}
      <LinkButton
        message={t("main:mapPage")}
        href={"/map"}
        CustomIcon={RiMapPinLine}
      />
      <Button
        mt="4"
        size="sm"
        variant="contrast"
        w="100%"
        onClick={handleClearStorage}
      >
        Очистить LocalStorage
      </Button>
    </>
  );
};

export default NavBody;
