import { FiHome, FiPlusCircle } from "react-icons/fi";
import { LiaTelegramPlane } from "react-icons/lia";
import { RiTokenSwapLine, RiMapPinLine, RiRobot2Line } from "react-icons/ri";
import LinkButton from "../../shared/LinkButton";
import { Box } from "@chakra-ui/react";
import { useAppDispatch } from "../../../redux/hooks";

const NavBody = () => {
  return (
    <>
      <LinkButton message="Home" href={"/"} CustomIcon={FiHome} />

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
        message="Exchangers Map"
        href={"/map"}
        CustomIcon={RiMapPinLine}
      />

      <LinkButton
        message="Contact Support"
        href={"https://t.me/p2pie"}
        CustomIcon={LiaTelegramPlane}
      />
      <LinkButton
        message="Telegram Bot"
        href={"https://t.me/p2pie_bot"}
        CustomIcon={RiRobot2Line}
      />
    </>
  );
};

export default NavBody;
