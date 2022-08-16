import { Wrap, WrapItem, useColorModeValue, Text, Box } from "@chakra-ui/react";
import PopularDir from "./PopularDir";

const PopularDirs = () => {
  const popularDirs = ["BTC_SBERRUB", "ETH_QWRUB"];

  const recentDirs = ["BTC_CASHRUB", "SBERRUB_BTC"];

  return (
    <Box
      bgColor={useColorModeValue("gray.50", "bg.500")}
      w="100%"
      mt="5"
      minH="10vh"
      p={{ base: "10px 2px", md: "2", sm: "1" }}
      borderRadius="xl"
      boxShadow={useColorModeValue(
        "0px 0px 2px rgb(0 0 0 / 25%), 10px 10px 15px #e3e3e3, -10px 10px 15px #e3e3e3, -15px -15px 15px rgb(255 255 255 / 40%), 15px -15px 15px rgb(255 255 255 / 40%), inset 0px 2px 0px white",
        "none"
      )}
    >
      <Text
        fontSize="md"
        mb="2"
        w="100%"
        textAlign="center"
        color={useColorModeValue("bg.400", "bg.300")}
      >
        popular
      </Text>
      <Wrap justify="center">
        {popularDirs.map((dir) => (
          <WrapItem key={`popular_${dir}`}>
            <PopularDir dir={dir} />
          </WrapItem>
        ))}
      </Wrap>
      <Text
        fontSize="md"
        m="2"
        w="100%"
        textAlign="center"
        color={useColorModeValue("bg.400", "bg.300")}
      >
        recent
      </Text>
      <Wrap justify="center">
        {recentDirs.map((dir) => (
          <WrapItem key={`recent_${dir}`}>
            <PopularDir dir={dir} />
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default PopularDirs;
