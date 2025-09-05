import { Text, Box, Heading, Link, Divider } from "@chakra-ui/react";

import { IDirText } from "../../types/exchange";
import { useRouter } from "next/router";
import { TextToHTML } from "../shared/helper";

const DirText = ({ dirText }: { dirText: IDirText | null }) => {
  if (!dirText) return <></>;
  const { text, seo_title } = dirText;

  return (
    <Box p="2">
      <Heading as="h2" fontSize="2xl">
        {dirText.subheader}
      </Heading>
      <Divider my="5" />
      <TextToHTML text={text} />
    </Box>
  );
};

export default DirText;
