import { memo, useCallback, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Box, Text } from "@chakra-ui/react";

const containerStyle = {
  width: "90vw",
  height: "90vh",
};

const center = {
  lat: 41.02571061642778,
  lng: 28.974107139116633,
};

const markers = [
  {
    id: 1,
    name: "Chicago, Illinois",
    position: { lat: 41.081832, lng: 28.9623177 },
  },
  {
    id: 2,
    name: "Denver, Colorado",
    position: { lat: 41.021832, lng: 28.9023177 },
  },
  {
    id: 3,
    name: "Los Angeles, California",
    position: { lat: 41.121832, lng: 28.8923177 },
  },
  {
    id: 4,
    name: "New York, New York",
    position: { lat: 41.481832, lng: 28.8623177 },
  },
];

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCAsTQCzFsHpWIHQ-VlIBL1_kDDG06VpVA",
  });

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <Box bgColor="bg.600" borderRadius="lg" p="4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => setActiveMarker(null)}
      >
        {markers.map(({ id, name, position }) => (
          <Marker
            key={id}
            position={position}
            onClick={() => handleActiveMarker(id)}
          >
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <Box p="2" color="bg.600">
                  <Text>test</Text>
                </Box>
              </InfoWindow>
            ) : null}
          </Marker>
        ))}
      </GoogleMap>
    </Box>
  ) : (
    <></>
  );
}

export default memo(MyComponent);
