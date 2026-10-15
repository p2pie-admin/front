import {
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { FaLink } from "react-icons/fa";
import { getMakerSlug } from "../../makers/helper";
import {
  RiPagesLine,
  RiRobot2Line,
  RiFileCopyLine,
} from "react-icons/ri";
import { useAppDispatch } from "../../../../redux/hooks";
import { sendToast } from "../../../../redux/mainReducer";
import { base } from "../../../../services/utils";
import { useMakerEditContext } from "../MakerEditContext";
import { useT } from "../../../../services/i18n";

export default function MakersLinks() {
  const maker = useMakerEditContext();
  const dispatch = useAppDispatch();
  const t = useT();
  const makerSlug = getMakerSlug(maker);
  const profilePath = `${base}/p2p/${makerSlug}`;
  const botLink = process.env.NEXT_PUBLIC_TELEGRAM_BOT || "";

  const links = [
    {
      text: t("Ваша страница обмена", "Your exchange page"),
      icon: RiPagesLine,
      link: profilePath,
    },
    {
      text: t("Ваш телеграм бот", "Your Telegram bot"),
      icon: RiRobot2Line,
      link: botLink,
    },
  ].filter((link) => Boolean(link.link));

  const copyLink = async (url: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      dispatch(
        sendToast({
          status: "success",
          title: t("Ссылка скопирована", "Link copied"),
          timeBeforeClosing: 2000,
        }),
      );
    } catch (error) {
      dispatch(
        sendToast({
          status: "error",
          title: t("Не удалось скопировать ссылку", "Could not copy the link"),
          timeBeforeClosing: 2000,
        }),
      );
    }
  };

  return (
    <Menu placement="bottom-end" isLazy>
      <MenuButton
        as={Button}
        onClick={(e) => e.stopPropagation()}
        variant="no_contrast"
        size={{ base: "sm", lg: "md" } as any}
        minW="unset"
        px={{ base: 3, lg: 4 }}
      >
        <FaLink size="1rem" />
      </MenuButton>
      <MenuList bgColor="bg.800" minW="200px">
        {links.map((link) => (
          <MenuItem
            key={link.text}
            bgColor="bg.800"
            _hover={{
              bgColor: "bg.700",
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void copyLink(link.link);
            }}
          >
            <HStack color="bg.500" justifyContent="space-between" w="100%">
              <HStack spacing="3" color="bg.300">
                <Icon as={link.icon} />
                <span>{link.text}</span>
              </HStack>

              <RiFileCopyLine size="1rem" />
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
