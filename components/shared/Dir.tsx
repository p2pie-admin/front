import { Grid, Box } from "@chakra-ui/react";

import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import PmName from "./PmName";
import { IPm } from "../../types/selector";

const Dir = ({
  children,
  givePm,
  getPm,
  slug,
}: {
  slug: string;
  givePm?: IPm;
  getPm?: IPm;
  children?: any;
}) => {
  return (
    <Link href={`/exchange/${slug}`} passHref>
      <Box
        borderRadius="lg"
        border="1px dashed"
        borderColor="whiteAlpha.200"
        p="2"
        my="2"
        cursor="pointer"
        transition="background 0.1s ease-in"
        _hover={{ bgColor: "bg.1000" }}
      >
        <Grid
          gridTemplateColumns={"1fr 40px  1fr"}
          color="bg.500"
          alignItems="center"
        >
          <PmName pm={givePm} />

          <BsArrowRightShort size="1.5rem" />
          <PmName pm={getPm} />
        </Grid>
        {children || ""}
      </Box>
    </Link>
  );
};

export default Dir;
