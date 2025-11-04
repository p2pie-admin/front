type MapColorTokens = {
  peach200: string;
  bg100: string;
  bg300: string;
  bg500: string;
  bg600: string;
  bg700: string;
  bg800: string;
  bg900: string;
};

export const createMapStyles = ({
  peach200,
  bg100,
  bg300,
  bg500,
  bg600,
  bg700,
  bg800,
  bg900,
}: MapColorTokens): google.maps.MapTypeStyle[] => [
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
];
