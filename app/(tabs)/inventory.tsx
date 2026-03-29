import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Item, Borrow } from "@/types";

type Tab = "lending" | "borrowing";

// Mock data
const LENDING_ITEMS: Item[] = [
  {
    id: "1",
    owner_id: "me",
    title: "Power Drill",
    description: "DeWalt 20V cordless",
    category: "tools",
    image_url: null,
    status: "borrowed",
    latitude: 0,
    longitude: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    owner_id: "me",
    title: "Stand Mixer",
    description: "KitchenAid 5-qt",
    category: "kitchen",
    image_url: null,
    status: "available",
    latitude: 0,
    longitude: 0,
    created_at: new Date().toISOString(),
  },
];

const BORROWING_ITEMS: (Borrow & { item_title: string })[] = [
  {
    id: "b1",
    item_id: "3",
    borrower_id: "me",
    status: "active",
    due_date: "2026-04-05T00:00:00Z",
    created_at: new Date().toISOString(),
    item_title: "Camping Tent",
  },
];

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  available: { bg: "#D1FAE5", text: "#065F46" },
  borrowed: { bg: "#FEF3C7", text: "#92400E" },
  active: { bg: "#DBEAFE", text: "#1E40AF" },
  pending: { bg: "#F3F4F6", text: "#374151" },
  returned: { bg: "#D1FAE5", text: "#065F46" },
  overdue: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function InventoryScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("lending");

  return (
    <View style={styles.container}>
      {/* Segment control */}
      <View style={styles.tabs}>
        {(["lending", "borrowing"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "lending" ? "Lending" : "Borrowing"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "lending" ? (
        <FlatList
          data={LENDING_ITEMS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons name="cube-outline" size={28} color="#10B981" />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.category}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: STATUS_BADGE[item.status]?.bg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: STATUS_BADGE[item.status]?.text },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No items listed yet.</Text>
          }
        />
      ) : (
        <FlatList
          data={BORROWING_ITEMS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconWrap}>
                <Ionicons
                  name="arrow-redo-outline"
                  size={28}
                  color="#6366F1"
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.item_title}</Text>
                <Text style={styles.cardSub}>
                  Due {new Date(item.due_date).toLocaleDateString()}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: STATUS_BADGE[item.status]?.bg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: STATUS_BADGE[item.status]?.text },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Nothing borrowed yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  tabs: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabActive: { backgroundColor: "#fff" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#111827" },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  cardSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
    textTransform: "capitalize",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 48,
    fontSize: 15,
  },
});
