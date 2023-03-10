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
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const populars = useAppSelector((state) => state.main.populars);
  const { t } = useTranslation();
  const [bg700] = useToken("colors", ["bg.700"]);
  const chunkLength = useBreakpointValue({ base: 3, sm: 2 }) || 2;
  const chunks = sliceIntoChunks(populars, chunkLength);

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
            color={useColorModeValue("bg.400", "bg.400")}
          >
            {t("home:popular")}
          </Text>

          <HStack p="0">
            {chunks.map((dirs, index) => (
              <HStack w="100%" key={"chunk_" + index}>
                <VStack w="100%">
                  {dirs.map((dir, index) => (
                    <Box key={`dir_${dir.id}`}>
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
                </VStack>
                {index !== chunks.length - 1 && (
                  <Box h="16" w="1px" bgColor="bg.800" />
                )}
              </HStack>
            ))}
          </HStack>
        </Grid>
      </Box3D>
    </SlideFade>
  );
};

export default Popular;
