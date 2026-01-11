import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface LevelSliderProps {
  label: string;
  value: number;
  maxValue?: number;
  onChange: (value: number) => void;
  labels?: string[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LevelSlider({
  label,
  value,
  maxValue = 5,
  onChange,
  labels,
}: LevelSliderProps) {
  const { theme } = useTheme();

  const getColor = (level: number) => {
    const colors = [
      theme.textSecondary,
      "#A78BFA",
      "#8B5CF6",
      "#7C3AED",
      "#6D28D9",
      "#5B21B6",
    ];
    return colors[Math.min(level, maxValue)];
  };

  const handlePress = (level: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(level);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="body" style={styles.label}>
          {label}
        </ThemedText>
        {labels && labels[value] ? (
          <ThemedText
            type="caption"
            style={{ color: getColor(value) }}
          >
            {labels[value]}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.dotsContainer}>
        {[...Array(maxValue + 1)].map((_, i) => (
          <Pressable
            key={i}
            onPress={() => handlePress(i)}
            style={styles.dotWrapper}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: i <= value ? getColor(value) : theme.border,
                  width: i <= value ? 24 : 16,
                  height: i <= value ? 24 : 16,
                  borderRadius: i <= value ? 12 : 8,
                },
              ]}
            >
              {i <= value ? (
                <ThemedText
                  type="caption"
                  style={[styles.dotText, { color: "#FFFFFF" }]}
                >
                  {i}
                </ThemedText>
              ) : null}
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontWeight: "600",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dotWrapper: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  dot: {
    justifyContent: "center",
    alignItems: "center",
  },
  dotText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
