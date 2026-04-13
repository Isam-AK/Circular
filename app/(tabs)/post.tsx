import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ItemCategory } from "@/types";

const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: "tools", label: "Tools", icon: "hammer-outline" },
  { value: "electronics", label: "Electronics", icon: "laptop-outline" },
  { value: "kitchen", label: "Kitchen", icon: "restaurant-outline" },
  { value: "sports", label: "Sports", icon: "football-outline" },
  { value: "books", label: "Books", icon: "book-outline" },
  { value: "other", label: "Other", icon: "ellipsis-horizontal-outline" },
];

export default function PostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory | null>(null);

  const handlePost = () => {
    if (!title.trim() || !category) {
      Alert.alert("Missing info", "Please add a title and pick a category.");
      return;
    }
    Alert.alert("Item Listed!", `"${title}" is now visible to your neighbors.`);
    setTitle("");
    setDescription("");
    setCategory(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Photo placeholder */}
      <TouchableOpacity style={styles.photoBox}>
        <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
        <Text style={styles.photoText}>Add Photo</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g. "Power Drill"'
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Condition, brand, anything helpful..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      {/* Category picker */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.catChip,
              category === cat.value && styles.catChipActive,
            ]}
            onPress={() => setCategory(cat.value)}
          >
            <Ionicons
              name={cat.icon as any}
              size={18}
              color={category === cat.value ? "#fff" : "#6B7280"}
            />
            <Text
              style={[
                styles.catLabel,
                category === cat.value && styles.catLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>List Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 20, paddingBottom: 40 },
  photoBox: {
    height: 160,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  photoText: { marginTop: 8, fontSize: 14, color: "#9CA3AF", fontWeight: "500" },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 28,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  catChipActive: { backgroundColor: "#10B981" },
  catLabel: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  catLabelActive: { color: "#fff" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
