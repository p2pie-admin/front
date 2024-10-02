import { Grid, Box } from "@chakra-ui/react";

import Link from "next/link";
import { BsArrowRightShort } from "react-icons/bs";
import PmName from "../shared/PmName";
import { IPm } from "../../types/selector";
import { Box3D } from "../../styles/theme/custom";

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
    <Link href={`/${slug}`} passHref>
      <Box3D
        p="2"
        my="2"
        cursor="pointer"
        transition="filter 0.2s ease-in"
        _hover={{ filter: "brightness(1.1)" }}
        variant="contrast"
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
      </Box3D>
    </Link>
  );
};

export default Dir;
