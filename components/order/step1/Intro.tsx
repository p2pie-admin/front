import { Collapse, Grid } from "@chakra-ui/react";
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
        Why publish rates on p2pie?
      </ResponsiveText>

      <Grid
        my={["2", "4"]}
        gap="2"
        gridTemplateColumns={["1fr 1fr", "1fr 1fr 1fr"]}
      >
        {introItems &&
          introItems.map((introItem) => <IntroItem introItem={introItem} />)}
      </Grid>
    </Collapse>
  );
};

export default Intro;
