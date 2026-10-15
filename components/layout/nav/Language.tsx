import { Button, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { Locale, setLangCookie, useLocale } from "../../../services/i18n";

// RU | EN switcher. Both languages live on the same URLs: the middleware reads the `lang` cookie,
// so switching only sets the cookie and reloads the current page.
const LANGS: Locale[] = ["ru", "en"];

const Language = () => {
  const locale = useLocale();
  const activeColor = useColorModeValue("violet.700", "violet.300");
  const choose = (next: Locale) => {
    if (next === locale) return;
    setLangCookie(next);
    window.location.reload();
  };

  return (
    <HStack spacing="0" mx="1" aria-label="Language / Язык">
      {LANGS.map((l, i) => (
        <HStack key={l} spacing="0">
          {i > 0 && (
            <Text as="span" color="bg.500" fontSize={["xs", "sm"]} px="0.5">
              |
            </Text>
          )}
          <Button
            variant="unstyled"
            minW="auto"
            h={["7", "8"]}
            px={["1", "1.5"]}
            fontSize={["xs", "sm"]}
            fontWeight={l === locale ? "800" : "500"}
            color={l === locale ? activeColor : "bg.500"}
            textDecoration={l === locale ? "underline" : "none"}
            textUnderlineOffset="4px"
            aria-pressed={l === locale}
            lang={l}
            onClick={() => choose(l)}
          >
            {l.toUpperCase()}
          </Button>
        </HStack>
      ))}
    </HStack>
  );
};

export default Language;
