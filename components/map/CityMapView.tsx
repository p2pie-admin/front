import { useLoadScript, GoogleMap, OverlayView } from "@react-google-maps/api";
import { Box, Heading, Text, VStack, useToken } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { ICity } from "../../types/exchange";
import { IExchanger } from "../../types/exchanger";
import { createMapStyles } from "./styles";
import CustomMarker from "./CustomMarker";
import { useAppDispatch } from "../../redux/hooks";
import { setCity } from "../../redux/mainReducer";

export type MapHeadings = {
  h1: string;
  h2: string;
  description: string;
  empty: string;
};

type CityMapViewProps = {
  city: ICity;
  exchangerList: IExchanger[];
  headings: MapHeadings;
};

const CityMapView = ({ city, exchangerList, headings }: CityMapViewProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCity(city));
  }, [dispatch, city]);

  const libraries = useMemo(() => ["places"], []);

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "80vh",
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

  const markers = useMemo(() => {
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
            };
          })
          .filter(
            (
              marker
            ): marker is {
              id: string;
              exchanger: IExchanger;
              position: google.maps.LatLngLiteral;
            } => Boolean(marker)
          );
      })
      .filter(Boolean);
  }, [exchangerList]);

  const center = useMemo(() => {
    if (city.coordinates && city.coordinates.length === 2) {
      const [lat, lng] = city.coordinates;
      return { lat, lng } as google.maps.LatLngLiteral;
    }

    return (
      markers[0]?.position ?? ({ lat: 0, lng: 0 } as google.maps.LatLngLiteral)
    );
  }, [city.coordinates, markers]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <VStack align="start" spacing="3" mb="4" w="full">
        <Heading as="h1" size="lg">
          {headings.h1}
        </Heading>
        <Heading as="h2" size="md" color="bg.200">
          {headings.h2}
        </Heading>
        <Text color="bg.300">{headings.description}</Text>
        {!markers.length && (
          <Text color="bg.400" fontSize="sm">
            {headings.empty}
          </Text>
        )}
      </VStack>
      <Box
        bgColor="bg.800"
        borderRadius="lg"
        p="4"
        w={{ base: "100%", md: "888px" }}
        minW={{ base: "100%", lg: "888px" }}
      >
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
              <CustomMarker exchanger={marker.exchanger} />
            </OverlayView>
          ))}
        </GoogleMap>
      </Box>
    </>
  );
};

export default CityMapView;
