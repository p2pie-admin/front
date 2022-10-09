import { Flex } from "@chakra-ui/react";
import { useState, useCallback } from "react";

function Item({
  setTrackIsActive,
  handleSwiperIdVisible,
  swiperIdVisible,
  constraint,
  itemWidth,
  positions,
  children,
  exIdIndexPair,
  gap,
}: any) {
  const [userDidTab, setUserDidTab] = useState(false);

  const handleFocus = () => {
    setTrackIsActive(true);
  };

  const handleBlur = () => {
    userDidTab && setTrackIsActive(false);
    setUserDidTab(false);
  };

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
      onFocus={handleFocus}
      onWheel={handleWheel}
      onBlur={handleBlur}
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
