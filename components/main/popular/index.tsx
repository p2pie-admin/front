import {
  Wrap,
  WrapItem,
  useColorModeValue,
  Text,
  Box,
  SlideFade,
  useToken,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../redux/hooks";
import { IDir } from "../../../types/dir";
import Dir from "./Dir";

const Popular = ({ dirs }: { dirs: IDir[] }) => {
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const { t } = useTranslation();
  const [bg700] = useToken("colors", ["bg.700"]);

  return (
    <SlideFade in>
      <Box
        border={`solid 1px ${bg700}`}
        minH="10vh"
        borderRadius="xl"
        p="2"
        mt="2"
      >
        <Text
          fontSize="md"
          mb="2"
          mt="1"
          mx="2"
          w="100%"
          color={useColorModeValue("bg.400", "bg.400")}
        >
          {t("home:popular")}
        </Text>
        <Wrap justify="center" py="2" px={{ base: "2", md: "5" }} w="100%">
          {dirs.map((dir, index) => (
            <WrapItem key={`dir_${dir.id}`}>
              {dir.groups.length > 1 ? (
                <Dir
                  index={index}
                  dirId={dir.id}
                  giveGroup={dir.groups[0]}
                  getGroup={dir.groups[1]}
                />
              ) : (
                <></>
              )}
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </SlideFade>
  );
};

export default Popular;
