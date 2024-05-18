import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { Heading, Highlight } from "@chakra-ui/react";
import { destructureDirSlug } from "../../redux/helper";

const DefaultDirText = ({ slug }: { slug?: string }) => {
  if (!slug) return <></>;
  const {
    giveCurCode,
    giveName,
    giveSubgroupName,
    getCurCode,
    getName,
    getSubgroupName,
  } = destructureDirSlug(slug);
  const U = (str: string) => (str ? str.toUpperCase() : "");
  return (
    <Heading
      textAlign="center"
      as="h1"
      size="md"
      noOfLines={2}
      m="0"
      mb="3"
      color="bg.300"
    >
      <Highlight
        query={[giveName, giveCurCode, getName, getCurCode]}
        styles={{ color: "peach.200" }}
      >
        {`Обмен ${capitalize(giveName)} ${U(giveCurCode)} ${U(
          giveSubgroupName
        )} на ${capitalize(getName)} ${U(getCurCode)} ${U(getSubgroupName)}`}
      </Highlight>
    </Heading>
  );
};

export default DefaultDirText;
