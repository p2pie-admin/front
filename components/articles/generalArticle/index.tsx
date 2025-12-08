import { Box, Divider, Text } from "@chakra-ui/react";
import React from "react";
import { IArticle } from "../../../types/pages";
import { ISEO } from "../../../types/general";
import { IoMdInformationCircle } from "react-icons/io";
import description from "../../map/description";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { TextToHTML } from "../../shared/helper";
import UniversalSeo from "../../shared/UniversalSeo";

export default function GeneralArticle({
  article,
  seo,
}: {
  article: IArticle | null;
  seo: ISEO;
}) {
  return (
    <>
      <UniversalSeo seo={seo} />
      <BoxWrapper>
        <CustomHeader text={`Описание`} Icon={IoMdInformationCircle} />
        <Divider my="4" />
        <Box px="2" color="bg.400">
          {article?.text && (
            <TextToHTML
              text={article.text}
              components={{
                p: ({ children }) => (
                  <Text color="bg.300" px="2" my="2">
                    {children}
                  </Text>
                ),
              }}
            />
          )}
        </Box>
      </BoxWrapper>
    </>
  );
}
