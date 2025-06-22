import { Collapse, Divider, Grid } from "@chakra-ui/react";
import { useAppSelector } from "../../../redux/hooks";
import { ResponsiveText } from "../../../styles/theme/custom";
import { OrderIntrosQuery } from "./queries";
import useSWR from "swr";
import { initCMSFetcher } from "../../../services/fetchers";
import { IOrderIntro } from "../../../types/p2p";
import IntroItem from "./IntroItem";

const Intro = () => {
  const fetcher = initCMSFetcher();

  const { data, error } = useSWR(OrderIntrosQuery, fetcher) as {
    data: {
      orderIntros: IOrderIntro[];
    };
    error: boolean;
  };

  const introItems = data?.orderIntros;
  const hidden = useAppSelector((state) => !state.main.p2p.dirs[0].toUsdRate);
  return (
    <Collapse in={hidden}>
      <ResponsiveText size="xl" textAlign="center" fontWeight="bold" my="4">
        Why publish rates on {process.env.NEXT_PUBLIC_NAME}?
      </ResponsiveText>

      <Grid
        my={["2", "4"]}
        gridTemplateColumns={["6fr 2px", "6fr 2px 6fr 1px"]}
      >
        {introItems &&
          introItems.map((introItem, idx) => (
            <>
              <IntroItem introItem={introItem} />
              <Divider
                variant="dashed"
                alignSelf="end"
                h="calc(100% - 150px)"
                orientation="vertical"
                visibility={["hidden", (+idx + 1) % 2 ? "unset" : "hidden"]}
              />
            </>
          ))}
      </Grid>
    </Collapse>
  );
};

export default Intro;
