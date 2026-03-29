import React, { useState } from "react";
import { View, Text, Platform, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocation } from "@/hooks/useLocation";
import type { Item } from "@/types";

// react-native-maps is native-only; lazy-import to avoid web crash
const MapView = Platform.OS !== "web"
  ? require("react-native-maps").default
  : null;
const Marker = Platform.OS !== "web"
  ? require("react-native-maps").Marker
  : null;
const Callout = Platform.OS !== "web"
  ? require("react-native-maps").Callout
  : null;

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// Mock items scattered around default NYC coordinates
const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    owner_id: "u1",
    title: "Power Drill",
    description: "DeWalt 20V cordless",
    category: "tools",
    image_url: null,
    status: "available",
    latitude: 40.7138,
    longitude: -74.008,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    owner_id: "u2",
    title: "Stand Mixer",
    description: "KitchenAid 5-qt",
    category: "kitchen",
    image_url: null,
    status: "available",
    latitude: 40.7115,
    longitude: -74.003,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    owner_id: "u3",
    title: "Yoga Mat",
    description: "Extra thick, like new",
    category: "sports",
    image_url: null,
    status: "available",
    latitude: 40.715,
    longitude: -74.005,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    owner_id: "u4",
    title: 'Monitor 27"',
    description: "Dell 4K USB-C",
    category: "electronics",
    image_url: null,
    status: "available",
    latitude: 40.7105,
    longitude: -74.009,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    owner_id: "u5",
    title: "Camping Tent",
    description: "2-person, waterproof",
    category: "sports",
    image_url: null,
    status: "available",
    latitude: 40.714,
    longitude: -74.002,
    created_at: new Date().toISOString(),
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  tools: "#EF4444",
  electronics: "#6366F1",
  kitchen: "#F59E0B",
  sports: "#10B981",
  books: "#8B5CF6",
  other: "#6B7280",
};

export default function ExploreScreen() {
  const { location } = useLocation();
  const [region, setRegion] = useState<Region>({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  if (Platform.OS === "web" || !MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Text style={styles.searchText}>
            {MOCK_ITEMS.length} items nearby
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.webList}>
          {MOCK_ITEMS.map((item) => (
            <View key={item.id} style={styles.webCard}>
              <View
                style={[
                  styles.webDot,
                  { backgroundColor: CATEGORY_COLORS[item.category] ?? "#6B7280" },
                ]}
              />
              <View style={styles.webCardBody}>
                <Text style={styles.calloutTitle}>{item.title}</Text>
                <Text style={styles.calloutCategory}>{item.category}</Text>
                <Text style={styles.calloutDesc}>{item.description}</Text>
              </View>
              <Ionicons name="location-outline" size={18} color="#9CA3AF" />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {MOCK_ITEMS.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            pinColor={CATEGORY_COLORS[item.category] ?? "#6B7280"}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{item.title}</Text>
                <Text style={styles.calloutCategory}>{item.category}</Text>
                <Text style={styles.calloutDesc}>{item.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchBar}>
        <Text style={styles.searchText}>
          {MOCK_ITEMS.length} items nearby
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { padding: 8, maxWidth: 180 },
  calloutTitle: { fontWeight: "700", fontSize: 14, marginBottom: 2 },
  calloutCategory: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  calloutDesc: { fontSize: 12, color: "#374151" },
  searchBar: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  webList: { padding: 16, paddingTop: 72 },
  webCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  webDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  webCardBody: { flex: 1 },
});
