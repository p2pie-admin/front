import { FiHome } from "react-icons/fi";
import { LiaTelegramPlane, LiaExchangeAltSolid } from "react-icons/lia";
import { RiMapPinLine, RiQuestionLine, RiArticleLine } from "react-icons/ri";
import { TbArrowsExchange, TbBuildingStore } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import LinkButton from "../../shared/LinkButton";
import { useT } from "../../../services/i18n";

// Every public section of the site, in one place: the desktop side nav and the phone
// drawer both render this list, so a section can never be reachable on one and not the other.
export const NAV_ITEMS = [
  { message: "Главная", en: "Home", href: "/", icon: FiHome },
  { message: "Курсы обмена", en: "Exchange rates", href: "/buy/usdttrc20-for-rub", icon: TbArrowsExchange },
  { message: "Обменники", en: "Exchangers", href: "/exchangers", icon: LiaExchangeAltSolid },
  { message: "P2P мейкеры", en: "P2P makers", href: "/p2p", icon: HiOutlineUserGroup },
  { message: "Карта офисов", en: "Office map", href: "/map", icon: RiMapPinLine },
  { message: "Блог", en: "Blog", href: "/articles", icon: RiArticleLine },
  { message: "FAQ", en: "FAQ", href: "/faq", icon: RiQuestionLine },
  { message: "Для обменников", en: "For exchangers", href: "/for-exchangers", icon: TbBuildingStore },
  { message: "Контакты", en: "Contacts", href: "/contacts", icon: LiaTelegramPlane },
];

const NavBody = () => {
  const t = useT();
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <LinkButton
          key={item.href}
          message={t(item.message, item.en)}
          href={item.href}
          CustomIcon={item.icon}
        />
      ))}
    </>
  );
};

export default NavBody;
