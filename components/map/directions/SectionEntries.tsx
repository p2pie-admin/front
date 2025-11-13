import { Button, Collapse, Divider, Grid } from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import { CityCashEntry } from "../types";
import { IoMdInformationCircle } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import PmName from "../../shared/PmName";
import PmIcon from "../../shared/PmIcon";
import { IPm } from "../../../types/selector";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { RiExchangeFill } from "react-icons/ri";
import Arrow from "../../shared/Arrow";

type SectionEntriesProps = {
  title: string;
  entries: CityCashEntry[];
  cashPm: IPm;
  direction: "buy" | "sell";
};

const SectionEntries = ({
  title,
  entries,
  cashPm,
  direction,
}: SectionEntriesProps) => {
  const [showAll, setShowAll] = useState(false);
  if (!entries.length) return null;
  const ArrowIcon = direction === "sell" ? BsArrowLeftShort : BsArrowRightShort;
  const visibleEntries = entries.slice(0, 6);
  const hiddenEntries = entries.slice(6);

  return (
    <BoxWrapper>
      <CustomHeader text={title} as="h3" Icon={RiExchangeFill} />
      <Divider my="4" />

      <Grid gap="4" gridTemplateColumns="1fr 1fr 1fr">
        {visibleEntries.map((entry) => (
          <Button
            as={NextLink}
            href={`/${entry.slug}`}
            key={entry.slug}
            justifyContent="start"
            fontWeight="medium"
            gap="2"
            variant="ghost"
            color="bg.300"
            w="full"
          >
            <PmIcon pm={cashPm} />
            <ArrowIcon size="1.5rem" />
            <PmName pm={entry.cryptoPm} isFull={false} />
            <ResponsiveText color="peach.300" size="xs" fontWeight="semibold">
              {` (${entry.count})`}
            </ResponsiveText>
          </Button>
        ))}
      </Grid>
      {hiddenEntries.length > 0 && (
        <>
          <Collapse in={showAll} animateOpacity>
            <Grid gap="4" gridTemplateColumns="1fr 1fr 1fr" mt="4">
              {hiddenEntries.map((entry) => (
                <Button
                  as={NextLink}
                  href={`/${entry.slug}`}
                  key={entry.slug}
                  justifyContent="start"
                  fontWeight="medium"
                  gap="2"
                  variant="ghost"
                  color="bg.300"
                  w="full"
                >
                  <PmIcon pm={cashPm} />
                  <ArrowIcon size="1.5rem" />
                  <PmName pm={entry.cryptoPm} isFull={false} />
                  <ResponsiveText
                    color="peach.300"
                    size="xs"
                    fontWeight="semibold"
                  >
                    {` (${entry.count})`}
                  </ResponsiveText>
                </Button>
              ))}
            </Grid>
          </Collapse>
          <Button
            mt="4"
            color="bg.400"
            w="100%"
            variant="ghost"
            onClick={() => setShowAll((prev) => !prev)}
            rightIcon={<Arrow isUp={showAll} />}
          >
            {showAll ? "Скрыть" : "Показать все"}
          </Button>
        </>
      )}
    </BoxWrapper>
  );
};

export default SectionEntries;
