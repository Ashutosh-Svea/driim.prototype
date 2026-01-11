import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Dream, EMOTION_OPTIONS } from "@/types/dream";

interface DreamCardProps {
  dream: Dream;
  onPress: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DreamCard({ dream, onPress, index = 0 }: DreamCardProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getLucidityColor = (level: number) => {
    const colors = [
      theme.textSecondary,
      "#A78BFA",
      "#8B5CF6",
      "#7C3AED",
      "#6D28D9",
      "#5B21B6",
    ];
    return colors[Math.min(level, 5)];
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const emotionColors = dream.emotions
    .slice(0, 3)
    .map((e) => EMOTION_OPTIONS.find((opt) => opt.id === e)?.color || theme.primary);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={FadeInDown.delay(index * 50).duration(300)}
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.border,
        },
        Shadows.card,
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {formatDate(dream.date)}
          </ThemedText>
          {dream.isNightmare ? (
            <View style={[styles.badge, { backgroundColor: theme.error + "20" }]}>
              <Feather name="cloud-lightning" size={12} color={theme.error} />
            </View>
          ) : null}
          {dream.isRecurring ? (
            <View style={[styles.badge, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="repeat" size={12} color={theme.primary} />
            </View>
          ) : null}
        </View>
        <View style={styles.lucidityContainer}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.lucidityDot,
                {
                  backgroundColor:
                    i < dream.lucidityLevel
                      ? getLucidityColor(dream.lucidityLevel)
                      : theme.border,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <ThemedText type="h4" numberOfLines={1} style={styles.title}>
        {dream.title}
      </ThemedText>

      <ThemedText
        type="body"
        numberOfLines={2}
        style={[styles.content, { color: theme.textSecondary }]}
      >
        {dream.content}
      </ThemedText>

      {emotionColors.length > 0 || dream.tags.length > 0 ? (
        <View style={styles.footer}>
          {emotionColors.length > 0 ? (
            <View style={styles.emotionDots}>
              {emotionColors.map((color, i) => (
                <View
                  key={i}
                  style={[styles.emotionDot, { backgroundColor: color }]}
                />
              ))}
            </View>
          ) : null}
          {dream.tags.length > 0 ? (
            <View style={styles.tagsContainer}>
              {dream.tags.slice(0, 2).map((tag) => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: theme.backgroundSecondary }]}
                >
                  <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                    {tag}
                  </ThemedText>
                </View>
              ))}
              {dream.tags.length > 2 ? (
                <ThemedText type="caption" style={{ color: theme.textSecondary }}>
                  +{dream.tags.length - 2}
                </ThemedText>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  badge: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  lucidityContainer: {
    flexDirection: "row",
    gap: 3,
  },
  lucidityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  content: {
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  emotionDots: {
    flexDirection: "row",
    gap: 4,
  },
  emotionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
});
