import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Textarea,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  HiBookmark,
  HiHeart,
  HiOutlineBookmark,
  HiOutlineHeart,
} from "react-icons/hi";
import CustomModal from "../../../shared/CustomModal";

import { IExchanger } from "../../../../types/exchanger";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import exchanger from "..";
import { useT } from "../../../../services/i18n";

const storageKeys = {
  bookmark: (id: string) => `exchanger:${id}:bookmark`,
  liked: (id: string) => `exchanger:${id}:liked`,
};

// stacked: bookmark above like, for the narrow phone header of the maker page.
const Actions = ({ id, displayName, stacked = false }: { displayName: string; id: string; stacked?: boolean }) => {
  const t = useT();
  const dispatch = useAppDispatch();
  const inputColor = useColorModeValue("violet.700", "peach.300");

  const bookmarkStorageKey = useMemo(() => storageKeys.bookmark(id), [id]);
  const likedStorageKey = useMemo(() => storageKeys.liked(id), [id]);

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

  const initialLikes = useMemo(
    () => (!(displayName.length % 3) ? 0 : 1) + Number(liked),
    [displayName.length, liked],
  );

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

  return (
    <Flex
      gap="2"
      alignItems="stretch"
      flexWrap={stacked ? "nowrap" : { base: "wrap", lg: "nowrap" }}
      flexDir={stacked ? "column" : "row"}
      justifyContent="start"
      ml="auto"
    >
      <Button
        p="0"
        w={stacked ? "100%" : "4"}
        h={stacked ? "36px" : undefined}
        variant="no_contrast"
        onClick={handleBookmarkOpen}
        color={bookmark ? "red.400" : "bg.200"}
      >
        <CustomModal
          id={"exchangerBookmark"}
          header={t("Добавьте пометку для себя", "Add a private note")}
        >
          <Box p="4">
            <Textarea
              size="lg"
              rows={3}
              color={inputColor}
              boxShadow="none !important"
              placeholder={t("Ваш комментарий", "Your comment")}
              value={bookmark}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setBookmark(e.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleBookmarkSave();
                }
              }}
              _placeholder={{ color: "bg.500" }}
            />
            <HStack mt="4" spacing="4" justifyContent="end">
              <Button onClick={handleBookmarkClear}>{t("Отмена", "Cancel")}</Button>
              <Button variant="primary" onClick={handleBookmarkSave}>
                {t("Сохранить", "Save")}
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
        px="2"
        h={stacked ? "36px" : undefined}
        color={liked ? "red.400" : "bg.200"}
        rightIcon={
          liked ? <HiHeart size="1rem" /> : <HiOutlineHeart size="1rem" />
        }
      >
        <Text mt="0.5" fontWeight="semi-bold">
          {initialLikes}
        </Text>
      </Button>
    </Flex>
  );
};

export default Actions;
