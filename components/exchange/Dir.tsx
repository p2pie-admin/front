import { Box, Grid } from "@chakra-ui/react";

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
  bottomLeft,
  bottomRight,
}: {
  slug: string;
  givePm?: IPm;
  getPm?: IPm;
  children?: any;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
}) => {
  const leftContent = bottomLeft ?? children ?? null;
  const rightContent = bottomRight ?? null;

  return (
    <Link href={`/${slug}`} passHref>
      <Box3D
        flex="1"
        px="4"
        py="2"
        cursor="pointer"
        transition="filter 0.2s ease-in"
        _hover={{ filter: "brightness(1.1)" }}
        variant="contrast"
      >
        <Grid
          gridTemplateColumns={"1fr 40px 1fr"}
          gridTemplateRows="auto"
          color="bg.500"
          alignItems="center"
          columnGap="2"
        >
          <Box gridColumn="1" display="flex" flexDir="column" gap="1">
            <PmName pm={givePm} isFull={false} />
            {leftContent}
          </Box>

          <Box gridColumn="2" justifySelf="center">
            <BsArrowRightShort size="1.5rem" />
          </Box>

          <Box
            gridColumn="3"
            justifySelf="end"
            display="flex"
            flexDir="column"
            gap="1"
            alignItems="flex-end"
          >
            <PmName pm={getPm} isFull={false} />
            {rightContent}
          </Box>
        </Grid>
      </Box3D>
    </Link>
  );
};

export default Dir;
