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
import { EMOTION_OPTIONS } from "@/types/dream";

interface EmotionPickerProps {
  selected: string[];
  onSelect: (emotions: string[]) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function EmotionChip({
  emotion,
  isSelected,
  onToggle,
}: {
  emotion: (typeof EMOTION_OPTIONS)[0];
  isSelected: boolean;
  onToggle: () => void;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected
            ? emotion.color + "30"
            : theme.backgroundSecondary,
          borderColor: isSelected ? emotion.color : "transparent",
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: emotion.color }]} />
      <ThemedText
        type="caption"
        style={{
          color: isSelected ? emotion.color : theme.textSecondary,
        }}
      >
        {emotion.label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export function EmotionPicker({ selected, onSelect }: EmotionPickerProps) {
  const handleToggle = (emotionId: string) => {
    if (selected.includes(emotionId)) {
      onSelect(selected.filter((e) => e !== emotionId));
    } else {
      onSelect([...selected, emotionId]);
    }
  };

  return (
    <View style={styles.container}>
      {EMOTION_OPTIONS.map((emotion) => (
        <EmotionChip
          key={emotion.id}
          emotion={emotion}
          isSelected={selected.includes(emotion.id)}
          onToggle={() => handleToggle(emotion.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
