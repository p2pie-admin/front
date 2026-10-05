import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks";
import { ResponsiveText } from "../../styles/theme/custom";
import { IRate } from "../../types/rates";
import OffersTable from "./OffersTable";
import { ISsrRate, pickSsrRate } from "./ssrRates";

const STEP = 20;

// Phone view of the offers: the server-rendered list first (so HTML and hydration match),
// then the live Redux list once the client fetched it. Plain table, page scroll, no slider.
const MobileOffers = ({
  initialDirRates,
  ratesTotal,
  giveCur,
  getCur,
}: {
  initialDirRates?: ISsrRate[] | null;
  ratesTotal?: number | null;
  giveCur: string;
  getCur: string;
}) => {
  const reduxRates = useAppSelector((state) => state.main.dirRates) || [];
  const rates = useMemo<ISsrRate[]>(() => {
    if (reduxRates.length) {
      return (reduxRates as IRate[])
        .slice()
        .sort((a, b) => a.course - b.course)
        .map(pickSsrRate);
    }
    return initialDirRates || [];
  }, [reduxRates, initialDirRates]);

  const total = reduxRates.length ? reduxRates.length : ratesTotal ?? rates.length;
  if (!rates.length) {
    return (
      <ResponsiveText variant="no_contrast" mt="2">
        Сейчас по этому направлению нет предложений.
      </ResponsiveText>
    );
  }

  return (
    <Box mt="2">
      <ResponsiveText variant="contrast" fontWeight="600" mb="-4">
        {`Найдено ${total} предложений`}
      </ResponsiveText>
      <OffersTable
        rates={rates}
        total={total}
        giveCur={giveCur}
        getCur={getCur}
        visibleRows={STEP}
        expandWith="button"
        stickyHead
        hiddenNote={false}
      />
    </Box>
  );
};

export default MobileOffers;
