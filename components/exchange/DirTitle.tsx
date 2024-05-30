import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { Heading, Highlight } from "@chakra-ui/react";
import { destructureDirSlug } from "../../redux/helper";

const DirTitle = ({ slug, locale }: { slug: string; locale: "en" | "ru" }) => {
  const {
    giveCurCode,
    giveName,
    giveSubgroupName,
    getCurCode,
    getName,
    getSubgroupName,
  } = destructureDirSlug(slug);
  const U = (str: string) => (str ? str.toUpperCase() : "");
  const title =
    locale === "ru"
      ? `Обмен ${capitalize(giveName)} ${U(giveCurCode)} ${U(
          giveSubgroupName
        )} на ${capitalize(getName)} ${U(getCurCode)} ${U(getSubgroupName)}`
      : `Exchange ${capitalize(giveName)} ${U(giveCurCode)} ${U(
          giveSubgroupName
        )} to ${capitalize(getName)} ${U(getCurCode)} ${U(getSubgroupName)}`;
  return (
    <Heading
      textAlign="center"
      as="h1"
      size={title.length > 38 ? "sm" : "md"}
      m="2"
      mb="4"
      color="bg.300"
    >
      <Highlight
        query={[giveName, giveCurCode, getName, getCurCode]}
        styles={{ color: "peach.200" }}
      >
        {title}
      </Highlight>
    </Heading>
  );
};

export default DirTitle;
