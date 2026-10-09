import { Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAppSelector } from "../../redux/hooks";
import { ResponsiveText } from "../../styles/theme/custom";
import { IRate } from "../../types/rates";
import OffersTable from "./OffersTable";
import { ISsrRate, pickSsrRate } from "./ssrRates";

// Rows shown before "Показать ещё"; the rest sits in a collapsed <details>.
const VISIBLE = 5;

// Short offers table, the swiper's data as rows (phones: under the swiper, desktop: in the wide
// block). Server-rendered list first (so HTML and hydration match), then the live Redux list.
const ShortOffers = ({
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
    <Box mt="4">
      {/* Same data as the swiper above, just as a table for those who prefer it. */}
      <ResponsiveText variant="contrast" fontWeight="600">
        Те же предложения таблицей
      </ResponsiveText>
      <ResponsiveText size="xs" variant="no_contrast" mb="-4">
        Все предложения из списка выше, если так удобнее сравнивать
      </ResponsiveText>
      <OffersTable
        rates={rates}
        total={total}
        giveCur={giveCur}
        getCur={getCur}
        visibleRows={VISIBLE}
        hiddenNote={false}
      />
    </Box>
  );
};

export default ShortOffers;
