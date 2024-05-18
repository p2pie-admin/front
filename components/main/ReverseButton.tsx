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
import { reverseDir } from "../../redux/mainReducer";
import { useRouter } from "next/router";

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

  const color2 = useColorModeValue("bg.700", "bg.200");
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );
  const router = useRouter();
  const slug = router.query.slug as string;
  let reversed_slug = "";
  if (slug && slug.length) {
    const [leftPart, rightPart] = slug.split("-to-");
    reversed_slug = `${rightPart}-to-${leftPart}`;
  }

  const handleReverseDir = () => {
    router.push(`/exchange/${reversed_slug}`, undefined, {
      shallow: true,
    });

    dispatch(reverseDir());
  };

  return (
    <Center position="relative" w="100%" minH="5">
      <Box position="absolute">
        <Button
          w="4"
          p="0"
          variant="extra_contrast"
          onClick={handleReverseDir}
          color={bothPmsSelected ? color2 : "bg.500"}
          zIndex="3"
          aria-label="Reverse direction"
        >
          {bothPmsSelected ? (
            <BiRefresh size="2rem" />
          ) : (
            <CgArrowsExchange size="2rem" />
          )}
        </Button>
      </Box>
      <Patch />
    </Center>
  );
};

export default ReverseButton;
