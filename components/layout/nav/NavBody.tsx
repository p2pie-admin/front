import { FiHome, FiPlusCircle } from "react-icons/fi";
import { LiaTelegramPlane } from "react-icons/lia";
import { RiTokenSwapLine, RiMapPinLine, RiRobot2Line } from "react-icons/ri";
import LinkButton from "../../shared/LinkButton";
import { Button } from "@chakra-ui/react";

import { LiaExchangeAltSolid } from "react-icons/lia";

const NavBody = () => {
  const handleClearStorage = () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  };
  return (
    <>
      <LinkButton message="Домой" href={"/"} CustomIcon={FiHome} />

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
        message="Обменники"
        href={"/exchangers"}
        CustomIcon={LiaExchangeAltSolid}
      />

      <LinkButton
        message="Телеграм"
        href={`https://t.me/${process.env.NEXT_PUBLIC_NAME}`}
        CustomIcon={LiaTelegramPlane}
      />
      {/* <LinkButton
        message={t("main:botPage")}
        href={"https://t.me/p2pie_bot"}
        CustomIcon={RiRobot2Line}
      /> */}
      <LinkButton
        message="Офисы"
        href={"/map"}
        CustomIcon={RiMapPinLine}
      />
    </>
  );
};

export default NavBody;
