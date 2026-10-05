import { FiHome } from "react-icons/fi";
import { LiaTelegramPlane, LiaExchangeAltSolid } from "react-icons/lia";
import { RiMapPinLine, RiQuestionLine, RiArticleLine } from "react-icons/ri";
import { TbArrowsExchange, TbBuildingStore } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import LinkButton from "../../shared/LinkButton";

// Every public section of the site, in one place: the desktop side nav and the phone
// drawer both render this list, so a section can never be reachable on one and not the other.
export const NAV_ITEMS = [
  { message: "Главная", href: "/", icon: FiHome },
  { message: "Курсы обмена", href: "/buy/usdttrc20-for-rub", icon: TbArrowsExchange },
  { message: "Обменники", href: "/exchangers", icon: LiaExchangeAltSolid },
  { message: "P2P мейкеры", href: "/p2p", icon: HiOutlineUserGroup },
  { message: "Карта офисов", href: "/map", icon: RiMapPinLine },
  { message: "Блог", href: "/articles", icon: RiArticleLine },
  { message: "FAQ", href: "/faq", icon: RiQuestionLine },
  { message: "Для обменников", href: "/for-exchangers", icon: TbBuildingStore },
  { message: "Контакты", href: "/contacts", icon: LiaTelegramPlane },
];

const NavBody = () => {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <LinkButton
          key={item.href}
          message={item.message}
          href={item.href}
          CustomIcon={item.icon}
        />
      ))}
    </>
  );
};

export default NavBody;
