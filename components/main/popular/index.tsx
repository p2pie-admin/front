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
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../redux/hooks";
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

const Popular = ({ dirs }: { dirs: IDir[] }) => {
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const { t } = useTranslation();
  const [bg700] = useToken("colors", ["bg.700"]);
  const chunks = sliceIntoChunks(dirs, 2);

  return (
    <SlideFade in>
      <Grid
        gridTemplateRows="1fr 5fr"
        gridGap="4"
        p="4"
        bgColor="bg.900"
        h="36"
        borderRadius="2xl"
        mt="4"
        w="70%"
      >
        <Text
          fontSize="sm"
          h="4"
          w="100%"
          textAlign="center"
          color={useColorModeValue("bg.400", "bg.400")}
        >
          {t("home:popular")}
        </Text>

        <Box w="100%" h="100%" borderRadius="2xl" bgColor="bg.700"></Box>

        {/* <Center>
          <HStack w="fit-content">
            {chunks.map((dirs, index) => (
              <>
                <VStack py="2" px={{ base: "2", md: "5" }} w="100%">
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
                  <Divider orientation="vertical" h="20" />
                )}
              </>
            ))}
          </HStack>
        </Center> */}
      </Grid>
    </SlideFade>
  );
};

export default Popular;
