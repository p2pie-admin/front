import { Flex } from "@chakra-ui/react";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { updateScrollLock } from "../../../../redux/mainReducer";

function Item({
  handleSwiperIdVisible,
  swiperIdVisible,
  constraint,
  itemWidth,
  positions,
  children,
  gap,
}: any) {
  const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);

  const dispatch = useAppDispatch();

  // const handleFocus = () => {
  //   setTrackIsActive(true);
  //   console.log("handleFocus");
  // };

  // const handleBlur = () => {
  //   userDidTab && setTrackIsActive(false);
  //   setUserDidTab(false);
  //   console.log("handleBlur");
  // };

  // const handleKeyUp = (event) => {
  //   event.key === "Tab" &&
  //     !(swiperIdVisible === positions.length - constraint) &&
  //     handleSwiperIdVisible(index);
  // };

  // const handleKeyDown = (event) => {
  //   event.key === "Tab" && setUserDidTab(true);
  // };

  const handleWheel = useCallback((event) => {
    // event.preventDefault();
    console.log("handleWheel");
    if (swiperIdVisible === 0) {
      // если первый, то ничего не делаем

      if (event.deltaY > 0) {
        handleSwiperIdVisible(swiperIdVisible + 1);
      }
      return;
    }

    if (swiperIdVisible < positions.length - constraint) {
      if (event.deltaY > 0) {
        handleSwiperIdVisible(swiperIdVisible + 1);
      }
      if (event.deltaY < 0) {
        handleSwiperIdVisible(swiperIdVisible - 1);
      }
    }
    if (swiperIdVisible > positions.length - constraint && event.deltaY > 0) {
      // if (event.deltaY > 0) {
      //   // если последний, то идем в начало
      //   handleSwiperIdVisible(0);
      // }
      if (event.deltaY < 0) {
        handleSwiperIdVisible(swiperIdVisible - 1);
      }
    }
  }, []);

  return (
    <Flex
      // onFocus={handleFocus}
      onTouchMove={() => {
        !isScrollLocked && dispatch(updateScrollLock(true));
      }}
      onTouchEndCapture={() => {
        dispatch(updateScrollLock(false));
      }}
      onWheel={handleWheel}
      // onBlur={handleBlur}
      // onKeyUp={handleKeyUp}
      // onKeyDown={handleKeyDown}
      w={`${itemWidth}px`}
      _notLast={{
        mr: `${gap}px`,
      }}
      py="4px"
    >
      {children}
    </Flex>
  );
}

export default Item;
