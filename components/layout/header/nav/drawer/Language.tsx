import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import NavButton from "../NavButton";

const Language = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const changeLanguageHandler = () => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, {
      locale: i18n.language === "en" ? "ru" : "en",
    });
  };
  return (
    <NavButton
      handleClick={changeLanguageHandler}
      icon={i18n.language === "en" ? "Ru" : "En"}
    />
  );
};

export default Language;
