import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  HiBookmark,
  HiHeart,
  HiOutlineBookmark,
  HiOutlineHeart,
} from "react-icons/hi";
import CustomModal from "../../../shared/CustomModal";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IExchanger } from "../../../../types/exchanger";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { LEAVE_REVIEW_SECTION_ID } from "../leaveReview";
import LeaveReviewButton from "./LeaveReviewButton";
import ExchangeButton from "./ExchangeButton";

const storageKeys = {
  bookmark: (id: string) => `exchanger:${id}:bookmark`,
  liked: (id: string) => `exchanger:${id}:liked`,
};

const Actions = ({ exchanger }: { exchanger: IExchanger }) => {
  const dispatch = useAppDispatch();
  const inputColor = useColorModeValue("violet.700", "peach.300");
  const bookmarkStorageKey = useMemo(
    () => storageKeys.bookmark(exchanger.id),
    [exchanger.id]
  );
  const likedStorageKey = useMemo(
    () => storageKeys.liked(exchanger.id),
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

  const initialLikes = useMemo(
    () =>
      (!(exchanger.name.length % 3)
        ? 0
        : Math.round(exchanger.name.length / 2)) + Number(liked),
    [exchanger.name.length, liked]
  );

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

  return (
    <Flex
      gap="4"
      alignItems="stretch"
      flexWrap={{ base: "wrap", lg: "nowrap" }}
      flexDir="row"
      justifyContent="start"
    >
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
              color={inputColor}
              boxShadow="none !important"
              placeholder={"Ваш комментарий к обменнику"}
              value={bookmark}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
        px="6"
        color={liked ? "red.500" : "bg.200"}
        rightIcon={
          liked ? <HiHeart size="1.3rem" /> : <HiOutlineHeart size="1.3rem" />
        }
      >
        <ResponsiveText size="lg">{initialLikes}</ResponsiveText>
      </Button>

      <LeaveReviewButton onClick={handleScrollToLeaveReview} />
      <ExchangeButton refLink={exchanger.ref_link} fullWidth />
    </Flex>
  );
};

export default Actions;
