import { Wrap, WrapItem, useColorModeValue, Text, Box } from "@chakra-ui/react";
import { useAppSelector } from "../../../redux/hooks";
import PopularDir from "./PopularDir";

const PopularDirs = () => {
  const populars = useAppSelector((state) => state.main.populars);
  const activePopular = useAppSelector((state) => state.main.activePopular);

  return (
    <Box
      bgColor={useColorModeValue("gray.50", "bg.500")}
      filter={activePopular ? "brightness(0.3)" : "unset"}
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
        популярные направления:
      </Text>
      <Wrap justify="center">
        {populars.map((popular) => (
          <WrapItem key={`popular_${popular.id}`}>
            <PopularDir
              dirId={popular.id}
              giveGroup={popular.popular_groups[0]}
              getGroup={popular.popular_groups[1]}
            />
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
};

export default PopularDirs;
