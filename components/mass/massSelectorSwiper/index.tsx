import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { firstItems, secondItems, thirdItems } from "./items";
import MassSwiper from "./massSwiper";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import NextLink from "next/link";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMassSelectorSlug } from "../../../redux/mainReducer";
import { readSlug } from "./helper";
import { ResponsiveText } from "../../../styles/theme/custom";

const MassSelector = ({ initialSlug }: { initialSlug?: string }) => {
  const massSelectorSlug =
    useAppSelector((state) => state.main.massSelectorSlug) || initialSlug;
  const dispatch = useAppDispatch();

  let f = "";
  let s = "";
  let t = "";

  if (massSelectorSlug) {
    [f, s, t] = readSlug(massSelectorSlug);
  } else {
    // ✅ fallback to first items, not index 0 hardcoded
    f = firstItems[0]?.id ?? "";
    s = secondItems[0]?.id ?? "";
    t = thirdItems[0]?.id ?? "";
  }

  const [first, setFirst] = useState(f);
  const [second, setSecond] = useState(s);
  const [third, setThird] = useState(t);

  const slug = `/${first}/${second}-for-${third}`;

  return (
    <VStack gap={initialSlug ? "2" : "10"} w="100%" position="relative">
      <HStack w="100%" justifyContent="center">
        <MassSwiper initialId={first} items={firstItems} set={setFirst} />
        <MassSwiper initialId={second} items={secondItems} set={setSecond} />
        <MassSwiper initialId={third} items={thirdItems} set={setThird} />
      </HStack>
      {initialSlug ? (
        <NextLink href={slug}>
          <Button
            color="white"
            variant="primary"
            position="absolute"
            h="50px"
            sx={{ top: "calc(50% - 28px )" }}
            right="-80px"
            onClick={() => dispatch(setMassSelectorSlug(slug))}
          >
            <FaSearch size="1.5rem" />
          </Button>
        </NextLink>
      ) : (
        <NextLink href={slug}>
          <Button
            mt={"20"}
            h={"70px"}
            variant="primary"
            size="lg"
            onClick={() => dispatch(setMassSelectorSlug(slug))}
          >
            <HStack color="white">
              <ResponsiveText color="inherit" size="xl">
                Искать курсы
              </ResponsiveText>
              <FaSearch size="1.5rem" />
            </HStack>
          </Button>
        </NextLink>
      )}
    </VStack>
  );
};

export default MassSelector;
