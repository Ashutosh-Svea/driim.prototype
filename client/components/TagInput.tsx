import React, { useState } from "react";
import { View, StyleSheet, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface TagInputProps {
  label: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({
  label,
  tags,
  onTagsChange,
  placeholder = "Add tag...",
}: TagInputProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setInputValue("");
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="body" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.tagsContainer}>
        {tags.map((tag) => (
          <Pressable
            key={tag}
            onPress={() => handleRemoveTag(tag)}
            style={[styles.tag, { backgroundColor: theme.primary + "20" }]}
          >
            <ThemedText type="caption" style={{ color: theme.primary }}>
              {tag}
            </ThemedText>
            <Feather name="x" size={14} color={theme.primary} />
          </Pressable>
        ))}
      </View>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          onSubmitEditing={handleAddTag}
          returnKeyType="done"
        />
        {inputValue.trim() ? (
          <Pressable onPress={handleAddTag} style={styles.addButton}>
            <Feather name="plus" size={20} color={theme.primary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
  },
  addButton: {
    padding: Spacing.sm,
  },
});
