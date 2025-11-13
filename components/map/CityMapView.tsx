import { useLoadScript, GoogleMap, OverlayView } from "@react-google-maps/api";
import {
  Box,
  Center,
  Divider,
  Heading,
  HStack,
  Spinner,
  Text,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { ICity } from "../../types/exchange";
import { IExchanger } from "../../types/exchanger";
import { createMapStyles } from "./styles";
import CustomMarker from "./CustomMarker";
import { useAppDispatch } from "../../redux/hooks";
import { setCity } from "../../redux/mainReducer";
import { IDirText } from "../../types/exchange";
import { CityCashSection, MapHeadings } from "./types";
import CityDescription from "./description";
import CashDirections from "./directions";
import { BoxWrapper, CustomHeader } from "../shared/BoxWrapper";
import { IoMdInformationCircle } from "react-icons/io";
import OfficeSearchInput from "./OfficeSearchInput";
import { TbMapPinFilled } from "react-icons/tb";
import ClosestCities from "./closest";
import { ClosestCityMatch } from "./helper";

type CityMapViewProps = {
  city: ICity;
  exchangerList: IExchanger[];
  headings: MapHeadings;
  cashSections: CityCashSection[];
  cityText: IDirText | null;
  closestCities: ClosestCityMatch[];
};

type MapMarker = {
  id: string;
  exchanger: IExchanger;
  position: google.maps.LatLngLiteral;
  officeName: string;
  searchIndex: string;
};

const CityMapView = ({
  city,
  exchangerList,
  headings,
  cashSections,
  cityText,
  closestCities,
}: CityMapViewProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(setCity(city));
  }, [dispatch, city]);

  const libraries = useMemo(() => ["places"], []);

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "70vh",
      boxShadow: "5px 5px 15px 5px #222",
      borderRadius: "10px",
    }),
    []
  );

  const [peach200, bg100, bg300, bg500, bg600, bg700, bg800, bg900] = useToken(
    "colors",
    [
      "peach.300",
      "bg.100",
      "bg.300",
      "bg.500",
      "bg.600",
      "bg.700",
      "bg.800",
      "bg.900",
    ]
  );

  const mapStyles = useMemo(
    () =>
      createMapStyles({
        peach200,
        bg100,
        bg300,
        bg500,
        bg600,
        bg700,
        bg800,
        bg900,
      }),
    [peach200, bg100, bg300, bg500, bg600, bg700, bg800, bg900]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      gestureHandling: "greedy",
      fullscreenControl: true,
      styles: mapStyles,
    }),
    [mapStyles]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const parseCoordinates = (value?: string | null) => {
    if (!value) return null;
    const sanitized = value
      .replace(/SRID=\d+;/i, "")
      .replace(/POINTZ?/gi, "")
      .replace(/[()]/g, " ")
      .trim();

    const parts = sanitized.includes(",")
      ? sanitized.split(",").map((p) => p.trim())
      : sanitized.split(/\s+/).map((p) => p.trim());

    const numbers = parts
      .map((part) => parseFloat(part.replace(/[^\d.\-]/g, "")))
      .filter((num) => Number.isFinite(num));

    if (numbers.length < 2) return null;

    const [first, second] = numbers;
    const isValidLat = (n: number) => Math.abs(n) <= 90;
    const isValidLng = (n: number) => Math.abs(n) <= 180;

    if (isValidLat(first) && isValidLng(second)) {
      return { lat: first, lng: second } as google.maps.LatLngLiteral;
    }

    if (isValidLat(second) && isValidLng(first)) {
      return { lat: second, lng: first } as google.maps.LatLngLiteral;
    }

    return null;
  };

  const markers = useMemo<MapMarker[]>(() => {
    return exchangerList
      .flatMap((exchanger) => {
        const offices = Array.isArray(exchanger.offices)
          ? exchanger.offices
          : [];

        return offices
          .map((office) => {
            const position = parseCoordinates(office.coordinates);
            if (!position) return null;

            return {
              id: `${exchanger.id}-${office.id}`,
              exchanger,
              position,
              officeName: office.address || "",
              searchIndex: `${exchanger.name || ""} ${
                office.address || ""
              }`.toLowerCase(),
            };
          })
          .filter((marker): marker is MapMarker => Boolean(marker));
      })
      .filter(Boolean);
  }, [exchangerList]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const highlightedIds = useMemo(() => {
    if (!normalizedSearch) return new Set<string>();
    return new Set(
      markers
        .filter((marker) => marker.searchIndex.includes(normalizedSearch))
        .map((marker) => marker.id)
    );
  }, [markers, normalizedSearch]);

  const center = useMemo(() => {
    if (city.coordinates && city.coordinates.length === 2) {
      const [lat, lng] = city.coordinates;
      return { lat, lng } as google.maps.LatLngLiteral;
    }

    return (
      markers[0]?.position ?? ({ lat: 0, lng: 0 } as google.maps.LatLngLiteral)
    );
  }, [city.coordinates, markers]);

  return (
    <Box>
      <BoxWrapper>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap="3"
        >
          <CustomHeader
            text={`${cityText?.header || headings.h1} (${markers.length})`}
            as="h1"
            Icon={TbMapPinFilled}
          />
          <HStack spacing="3">
            <OfficeSearchInput value={searchTerm} onChange={setSearchTerm} />
            {normalizedSearch && (
              <Text fontSize="sm" color="bg.300">
                {highlightedIds.size
                  ? `Найдено: ${highlightedIds.size}`
                  : "Ничего не найдено"}
              </Text>
            )}
          </HStack>
        </HStack>

        <Divider my="4" />
        <Box borderRadius="lg" overflow="hidden" bg="bg.900">
          {isLoaded ? (
            <GoogleMap
              options={mapOptions}
              zoom={12}
              center={center}
              mapContainerStyle={containerStyle}
            >
              {markers.map((marker) => (
                <OverlayView
                  key={marker.id}
                  getPixelPositionOffset={(width, height) => ({
                    x: -(width / 2),
                    y: -(height / 2),
                  })}
                  position={marker.position}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <CustomMarker
                    exchanger={marker.exchanger}
                    highlighted={
                      highlightedIds.size > 0 && highlightedIds.has(marker.id)
                    }
                  />
                </OverlayView>
              ))}
            </GoogleMap>
          ) : (
            <Center h="70vh">
              <Spinner
                thickness="4px"
                speed="0.7s"
                color="peach.300"
                size="xl"
              />
            </Center>
          )}
        </Box>
      </BoxWrapper>
      <CityDescription cityText={cityText} />
      <ClosestCities city={city} closestCities={closestCities} />
      <CashDirections sections={cashSections} headings={headings} />
    </Box>
  );
};

export default CityMapView;
