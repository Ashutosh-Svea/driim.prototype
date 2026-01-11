import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, Shadows, Colors } from "@/constants/theme";

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  bottom?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FAB({ onPress, icon = "plus", bottom = 100 }: FABProps) {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.fab,
        { bottom },
        Shadows.fab,
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[Colors.dark.cardGradientStart, Colors.dark.cardGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Feather name={icon} size={28} color="#FFFFFF" />
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
