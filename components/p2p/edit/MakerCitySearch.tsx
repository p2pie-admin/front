import { Box, Input, Text, VStack } from "@chakra-ui/react";
import { gql } from "graphql-request";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Arrow from "../../shared/Arrow";
import CustomModal from "../../shared/CustomModal";
import Countries from "../../layout/header/city/Countries";
import { ResponsiveButton } from "../../../styles/theme/custom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { triggerModal } from "../../../redux/mainReducer";
import { initCMSFetcher } from "../../../services/fetchers";
import { useLocale, useT } from "../../../services/i18n";

export type PickedPlace = { lat: number; lng: number; label: string };

type GeoCity = {
  ru_name: string;
  en_name: string;
  ru_country?: string | null;
  en_country?: string | null;
  lat: number;
  lng: number;
};

const MODAL_ID = "maker_location";

// Strapi runs on SQLite, whose case-insensitive LIKE only folds latin letters: Cyrillic is matched as typed and
// with a capital first letter, which covers how city names start.
const geoCitiesQuery = gql`
  query GeoCitySearch($lower: String!, $capital: String!) {
    geoCities(
      filters: {
        or: [
          { ru_name: { contains: $lower } }
          { ru_name: { contains: $capital } }
          { en_name: { containsi: $lower } }
        ]
      }
      sort: ["population:desc"]
      pagination: { limit: 30 }
    ) {
      data {
        id
        attributes {
          ru_name
          en_name
          ru_country
          en_country
          lat
          lng
        }
      }
    }
  }
`;

const toList = (res: any): GeoCity[] => {
  const raw = res?.geoCities?.data ?? res?.geoCities ?? res?.data ?? res;
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => item?.attributes ?? item).filter((c: any) => c && Number.isFinite(c.lat));
};

// City picker of the maker map: a search over our geo-city list (RU/EN names) above the usual country/city list.
export default function MakerCitySearch({
  picked,
  onPick,
}: {
  picked: PickedPlace | null;
  onPick: (place: PickedPlace) => void;
}) {
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const t = useT();
  const isOpen = useAppSelector((state) => state.main?.modal === MODAL_ID);
  const currentCityName = useAppSelector(
    (state) => state.main?.city?.[`${locale}_name`] || state.main?.city?.ru_name,
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoCity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      const lower = q.toLowerCase();
      const capital = lower.charAt(0).toUpperCase() + lower.slice(1);
      const res = await initCMSFetcher()(geoCitiesQuery, { lower, capital }).catch(() => null);
      if (cancelled) return;
      setResults(toList(res));
      setLoading(false);
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const nameOf = (c: GeoCity) => (locale === "en" ? c.en_name : c.ru_name) || c.en_name;
  const countryOf = (c: GeoCity) => (locale === "en" ? c.en_country : c.ru_country) || c.en_country || "";
  const searching = query.trim().length >= 2;

  return (
    <Box>
      <CustomModal id={MODAL_ID} header={t("Выберите город:", "Choose a city:")}>
        <Box p="2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("Поиск города: Москва, Tirana…", "Search a city: Moscow, Тирана…")}
            size="lg"
            borderRadius="lg"
            focusBorderColor="peach.300"
            mb="3"
          />
          {searching ? (
            <VStack alignItems="stretch" spacing="1">
              {results.map((city) => (
                <Box
                  key={`${city.en_name}-${city.lat}-${city.lng}`}
                  px="3"
                  py="2"
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: "bg.800" }}
                  onClick={() => {
                    onPick({ lat: city.lat, lng: city.lng, label: nameOf(city) });
                    dispatch(triggerModal(undefined));
                  }}
                >
                  <Text fontWeight="bold" variant="extra_contrast">
                    {nameOf(city)}
                  </Text>
                  <Text fontSize="sm" color="bg.400">
                    {countryOf(city)}
                  </Text>
                </Box>
              ))}
              {!loading && !results.length ? (
                <Text color="bg.400" px="3">
                  {t("Ничего не найдено", "Nothing found")}
                </Text>
              ) : null}
            </VStack>
          ) : (
            <Countries pageType="p2p" />
          )}
        </Box>
      </CustomModal>

      <ResponsiveButton
        variant="default"
        p="1"
        mx="2"
        leftIcon={<FaMapMarkerAlt size="1.2rem" />}
        rightIcon={<Arrow isUp={false} />}
        onClick={() => dispatch(triggerModal(MODAL_ID))}
      >
        {picked?.label || currentCityName || t("Город", "City")}
      </ResponsiveButton>
    </Box>
  );
}
