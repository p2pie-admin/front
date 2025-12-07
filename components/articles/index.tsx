import React from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { Box, Grid, VStack } from "@chakra-ui/react";
import { ISEO } from "../../types/general";
import { IArticle } from "../../types/pages";
import UniversalSeo from "../shared/UniversalSeo";
import ArticlePreview from "./generalArticle";
import CustomTitle from "../shared/CustomTitle";

export default function ArticlesList({
  articles,
  seo,
}: {
  articles: IArticle[];
  seo: ISEO;
}) {
  return (
    <>
      <UniversalSeo seo={seo} />

      <CustomTitle
        my="16"
        as="h1"
        title={"Последние новости"}
        subtitle={"Узнавайте новости из мира криптовалюты первыми"}
      />

      <VStack gap="4">
        {articles.map((article) => {
          return <ArticlePreview article={article} />;
        })}
      </VStack>
    </>
  );
}
