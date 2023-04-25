import {
  Wrap,
  WrapItem,
  useColorModeValue,
  Text,
  Box,
  SlideFade,
  useToken,
  Flex,
  Grid,
  VStack,
  HStack,
  Center,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../redux/hooks";
import { Box3D } from "../../../styles/theme/wrappers";
import { IDir } from "../../../types/dir";
import Dir from "./Dir";

function sliceIntoChunks(arr: any[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const Popular = () => {
  const populars = useAppSelector((state) => state.main.populars);
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const { t } = useTranslation();

  return (
    <SlideFade in>
      <Box3D borderRadius="2xl" bgColor="bg.900" mb="4">
        <Grid
          gridTemplateRows="1fr 5fr"
          gridGap="2"
          h={{ base: "unset", sm: "36" }}
          p="4"
          pt="3"
          borderRadius="2xl"
        >
          <Text
            fontSize="sm"
            h="4"
            w="100%"
            transition="all .4s ease"
            color={useColorModeValue("bg.400", "bg.400")}
          >
            {t("home:popular")}
          </Text>

          <HStack p="0">
            {populars.map((dir, index) => (
              <Box key={`dir_${dir.id}`} zIndex={dir.id === activeDir ? 2 : 1}>
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
              </Box>
            ))}
          </HStack>
        </Grid>
      </Box3D>
    </SlideFade>
  );
};

export default Popular;
