import { useRouter } from "next/router";
import NavButton from "./NavButton";

const Language = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  const changeLanguageHandler = () => {
    router.push({ pathname, query }, asPath, {
      locale: locale === "en" ? "ru" : "en",
    });
  };
  return (
    <NavButton
      handleClick={changeLanguageHandler}
      icon={locale === "en" ? "Ru" : "En"}
    />
  );
};

export default Language;
