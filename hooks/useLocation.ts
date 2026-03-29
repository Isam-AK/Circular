import { useEffect, useState } from "react";
import * as Location from "expo-location";

type Coords = {
  latitude: number;
  longitude: number;
};

const DEFAULT_LOCATION: Coords = {
  latitude: 40.7128,
  longitude: -74.006,
};

export function useLocation() {
  const [location, setLocation] = useState<Coords>(DEFAULT_LOCATION);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    })();
  }, []);

  return { location, error };
}
