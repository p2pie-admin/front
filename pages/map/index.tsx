//@ts-nocheck
import { useLoadScript, GoogleMap, OverlayView } from "@react-google-maps/api";
import type { GetStaticProps, NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { Box, Text, useToken } from "@chakra-ui/react";
import { initCMSFetcher } from "../../services/fetchers";
import useSWR from "swr";
import { IPhysicalExchanger } from "../../types/exchanger";
import CustomMarker from "../../components/map";
import { getPricesUSD } from "../../components/map/helper";
import { FAKE_PHYSICAL_EXCHANGERS } from "../../components/map/fakeData";
import { PhysicalExchangersQuery } from "../../components/map/queries";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const MapPageContent = () => {
  const fetcher = initCMSFetcher();
  const { data, error } = useSWR(PhysicalExchangersQuery, fetcher) as {
    data: {
      physicalExchangers: IPhysicalExchanger[];
    };
    error: boolean;
  };

  const libraries = useMemo(() => ["places"], []);

  const containerStyle = {
    width: "100%",
    height: "80vh",
  };

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

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      gestureHandling: "greedy",
      fullscreenControl: true,

      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.attraction",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.medical",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.park",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.government",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.school",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.place_of_worship",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.sports_complex",
          stylers: [{ visibility: "off" }],
        },
        {
          elementType: "geometry",
          stylers: [{ color: bg700 }],
        },
        { elementType: "labels.text.stroke", stylers: [{ color: bg600 }] },
        { elementType: "labels.text.fill", stylers: [{ color: bg100 }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: peach200 }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: bg100 }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: bg300 }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: bg500 }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: bg600 }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: bg100 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: bg300 }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: bg800 }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: bg300 }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: bg600 }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: bg100 }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: bg900 }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: bg500 }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: bg700 }],
        },
      ],
    }),
    [
      peach200,
      bg100,
      bg300,
      bg500,
      bg600,
      bg700,
      bg800,
      bg900,
    ]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  const physicalExchangers = data?.physicalExchangers?.length
    ? data.physicalExchangers
    : FAKE_PHYSICAL_EXCHANGERS;

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  const priceBasis = getPricesUSD(physicalExchangers);

  return (
    <Box
      bgColor="bg.800"
      borderRadius="lg"
      p="4"
      w={{ base: "100%", md: "888px" }}
      minW={{ base: "100%", lg: "888px" }}
    >
      <GoogleMap
        options={mapOptions}
        zoom={13}
        center={{
          lat: 41.02571061642778,
          lng: 28.974107139116633,
        }}
        mapContainerStyle={containerStyle}
      >
        {physicalExchangers.map((physicalExchanger) => {
          const { id, lat, lng } = physicalExchanger;
          return (
            <OverlayView
              getPixelPositionOffset={(width, height) => ({
                x: -(width / 2),
                y: -(height / 2),
              })}
              key={id}
              position={{ lat, lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CustomMarker
                physicalExchanger={physicalExchanger}
                priceBasis={priceBasis}
              />
            </OverlayView>
          );
        })}
      </GoogleMap>
    </Box>
  );
};

const Home: NextPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Text>Loading...</Text>;
  }

  return <MapPageContent />;
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLocale =
    (locale as string) || process.env.NEXT_PUBLIC_SITE_LANG || "ru";

  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ["main"])),
    },
  };
};
