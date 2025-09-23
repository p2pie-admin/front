import {
  useColorModeValue,
  Center,
  Button,
  useToken,
  Box,
} from "@chakra-ui/react";
import { BiRefresh } from "react-icons/bi";
import { CgArrowsExchange } from "react-icons/cg";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { clearDirRates, reverseDir } from "../../redux/mainReducer";
import { useRouter } from "next/router";

import NextLink from "next/link";
import {
  exchangeToSlugCity,
  slugCityToExchange,
} from "../exchange/exchangeHelper";

const Patch = () => {
  const [bg10, bg900] = useToken("colors", ["bg.10", "bg.900"]);
  const color1 = useColorModeValue(bg10, bg900);
  return (
    <Box position="absolute" zIndex="2">
      <Box
        w="30"
        h="8"
        background={`radial-gradient(circle at 0 100%, rgba(11, 111, 111, 0) 15px,${color1} 16px), 
      radial-gradient(circle at 100% 100%, rgba(111, 0, 0, 0) 15px, ${color1} 16px)`}
        backgroundPosition="bottom left, bottom right"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
      <Box
        w="40"
        h="8"
        background={`radial-gradient(circle at 100% 0, rgba(1, 111, 0, 0) 15px, ${color1} 16px), 
  radial-gradient(circle at 0 0, rgba(204, 111, 0, 0) 15px, ${color1} 16px)`}
        backgroundPosition="top right, top left"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
    </Box>
  );
};

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const color = useColorModeValue("bg.700", "bg.200");
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );
  const oppositeDirExists = useAppSelector((state) => {
    if (state.main?.getPm?.possible_pairs) {
      return state.main?.getPm?.possible_pairs?.find(
        (c) => c == state.main?.givePm?.code
      );
    }
    return;
  });
  const router = useRouter();
  const { exchange } = router.query as { exchange: string };
  let reversedExchange = "";
  if (exchange && exchange.length) {
    try {
      const [slug, city] = exchangeToSlugCity(exchange);
      const [leftPart, rightPart] = slug.split("-to-");
      const reversed_slug = `${rightPart}-to-${leftPart}`;
      reversedExchange = slugCityToExchange(reversed_slug, city);
    } catch (e) {}
  }

  return (
    <Center position="relative" w="100%" minH="4">
      <Box position="absolute">
        {bothPmsSelected && oppositeDirExists ? (
          <NextLink href={`/${reversedExchange}`}>
            <Button
              w="4"
              p="0"
              variant="no_contrast"
              onClick={() => dispatch(clearDirRates())}
              color={color}
              zIndex="3"
              aria-label="Reverse direction"
              transform={"rotate(90deg)"}
            >
              <CgArrowsExchange size="2rem" />
            </Button>
          </NextLink>
        ) : (
          <Button
            w="4"
            p="0"
            variant="extra_contrast"
            color={"bg.500"}
            disabled
            zIndex="3"
            transform={"rotate(90deg)"}
            aria-label="Reverse direction"
          >
            <CgArrowsExchange size="2rem" />
          </Button>
        )}
      </Box>
      <Patch />
    </Center>
  );
};

export default ReverseButton;
