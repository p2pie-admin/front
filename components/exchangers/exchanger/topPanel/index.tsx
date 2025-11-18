import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  HiBookmark,
  HiHeart,
  HiOutlineBookmark,
  HiOutlineHeart,
} from "react-icons/hi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { TbExternalLink } from "react-icons/tb";

import { LinkWrapper } from "../../../exchange/pmLayout/LinkWrapper";
import CustomModal from "../../../shared/CustomModal";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../../../types/exchanger";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { LEAVE_REVIEW_SECTION_ID } from "../leaveReview";

const STORAGE_KEYS = {
  bookmark: (id: string) => `exchanger:${id}:bookmark`,
  liked: (id: string) => `exchanger:${id}:liked`,
};

const TopPanel = ({
  exchanger,
}: {
  exchanger: IExchanger & IParserExchanger;
}) => {
  const dispatch = useAppDispatch();
  const bookmarkStorageKey = useMemo(
    () => STORAGE_KEYS.bookmark(exchanger.id),
    [exchanger.id]
  );
  const likedStorageKey = useMemo(
    () => STORAGE_KEYS.liked(exchanger.id),
    [exchanger.id]
  );

  const [liked, setLiked] = useState(false);
  const [bookmark, setBookmark] = useState("");
  const [bookmarkLoaded, setBookmarkLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedLiked = localStorage.getItem(likedStorageKey);
    setLiked(storedLiked === "true");
  }, [likedStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setBookmarkLoaded(false);
    const storedBookmark = localStorage.getItem(bookmarkStorageKey) ?? "";
    setBookmark(storedBookmark);
    setBookmarkLoaded(true);
  }, [bookmarkStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !bookmarkLoaded) return;

    if (bookmark) {
      localStorage.setItem(bookmarkStorageKey, bookmark);
    } else {
      localStorage.removeItem(bookmarkStorageKey);
    }
  }, [bookmark, bookmarkLoaded, bookmarkStorageKey]);

  const handleScrollToLeaveReview = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(LEAVE_REVIEW_SECTION_ID);
    if (target) {
      const rect = target.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(absoluteTop - 100, 0),
        behavior: "smooth",
      });
      return;
    }
    const scrollHeight =
      document.documentElement?.scrollHeight ?? document.body.scrollHeight ?? 0;
    window.scrollTo({
      top: Math.max(scrollHeight - 100, 0),
      behavior: "smooth",
    });
  };

  const handleLike = () => {
    setLiked((prev) => {
      const nextValue = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(likedStorageKey, String(nextValue));
      }
      return nextValue;
    });
  };

  const handleBookmarkOpen = () => dispatch(triggerModal("exchangerBookmark"));
  const closeBookmarkModal = () => dispatch(triggerModal(undefined));

  const handleBookmarkSave = () => {
    closeBookmarkModal();
  };

  const handleBookmarkClear = () => {
    setBookmark("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(bookmarkStorageKey);
    }
    closeBookmarkModal();
  };

  const initialLikes = useMemo(() => {
    return (
      (!(exchanger.name.length % 3)
        ? 0
        : Math.round(exchanger.name.length / 2)) + Number(liked)
    );
  }, [exchanger.name.length, liked]);

  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent="space-between"
      gap="4"
    >
      <HStack gap="4">
        <Button
          p="0"
          w="4"
          variant="no_contrast"
          onClick={handleBookmarkOpen}
          color={bookmark ? "red.500" : "bg.200"}
        >
          <CustomModal
            id={"exchangerBookmark"}
            header={"Добавьте пометку для себя"}
          >
            <Box p="4">
              <Input
                size="lg"
                minH="100"
                color={useColorModeValue("violet.700", "peach.300")}
                boxShadow="none !important"
                placeholder={"Ваш комментарий к обменнику"}
                value={bookmark}
                onChange={(e: any) => setBookmark(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleBookmarkSave();
                  }
                }}
                _placeholder={{ color: "bg.500" }}
              />
              <HStack mt="4" spacing="4" justifyContent="end">
                <Button onClick={handleBookmarkClear}>Отмена</Button>
                <Button variant="primary" onClick={handleBookmarkSave}>
                  Сохранить
                </Button>
              </HStack>
            </Box>
          </CustomModal>
          {bookmark ? (
            <HiBookmark size="1.2rem" />
          ) : (
            <HiOutlineBookmark size="1.2rem" />
          )}
        </Button>

        <Button
          variant="no_contrast"
          onClick={handleLike}
          fontWeight="unset"
          color={liked ? "red.500" : "bg.200"}
          rightIcon={
            liked ? <HiHeart size="1.3rem" /> : <HiOutlineHeart size="1.3rem" />
          }
        >
          <ResponsiveText size="lg">{initialLikes}</ResponsiveText>
        </Button>

        <Button
          w="100%"
          variant="no_contrast"
          rightIcon={<IoChatbubbleEllipsesOutline size="1.2rem" />}
          onClick={handleScrollToLeaveReview}
        >
          Оставить отзыв
        </Button>
      </HStack>
      <LinkWrapper
        url={exchanger.ref_link}
        exists={!!exchanger.ref_link}
        _blank
      >
        <Button
          variant="primary"
          rightIcon={<TbExternalLink size="1.2rem" />}
          w="100%"
        >
          Обмен
        </Button>
      </LinkWrapper>
    </Flex>
  );
};

export default TopPanel;
