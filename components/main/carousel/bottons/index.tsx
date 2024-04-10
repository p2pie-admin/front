import { Button, Grid } from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  decrementSwiper,
  incrementSwiper,
} from "../../../../redux/mainReducer";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { BiLinkExternal } from "react-icons/bi";
import ExchangeInfo from "../card/ExchangeInfo";
import { redirect } from "../../../../redux/thunks";
import NextLink from "next/link";

const SwiperButtons = () => {
  const dispatch = useAppDispatch();

  const href = useAppSelector((state) => {
    const ref_link =
      state.main?.dirRates?.[state.main.swiperIdVisible].ref_link;
    const [giveCode, getCode] = [
      state.main.givePm?.code,
      state.main.getPm?.code,
    ];
    const dirSlug =
      giveCode && getCode ? `cur_from=${giveCode}&cur_to=${getCode}` : "";
    return ref_link?.includes("?")
      ? `${ref_link}&${dirSlug}`
      : `${ref_link}?${dirSlug}`;
  });

  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      gridGap="4"
      justifyContent="space-between"
      h="10"
      px="1"
    >
      <Button
        p="1"
        variant="contrast"
        onClick={() => dispatch(decrementSwiper())}
      >
        <IoIosArrowBack size="1.2rem" />
      </Button>
      <ExchangeInfo />
      <NextLink href={href || ""} target="_blank">
        <Button
          w="100%"
          variant="primary"
          rightIcon={<BiLinkExternal size="1rem" />}
          onClick={() => dispatch(redirect())}
        >
          Exchange
        </Button>
      </NextLink>
      <Button
        p="1"
        variant="contrast"
        onClick={() => dispatch(incrementSwiper())}
      >
        <IoIosArrowForward size="1.2rem" />
      </Button>
    </Grid>
  );
};

export default SwiperButtons;
