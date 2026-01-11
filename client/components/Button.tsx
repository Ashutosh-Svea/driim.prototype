import React, { ReactNode } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Colors } from "@/constants/theme";

interface ButtonProps {
  onPress?: () => void;
  title?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  title,
  children,
  style,
  disabled = false,
  variant = "primary",
  size = "medium",
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.97, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, springConfig);
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getHeight = () => {
    switch (size) {
      case "small":
        return 36;
      case "large":
        return 56;
      default:
        return Spacing.buttonHeight;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return theme.primary;
      case "outline":
        return theme.primary;
      case "ghost":
        return theme.text;
      default:
        return "#FFFFFF";
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case "secondary":
        return theme.primary + "20";
      case "outline":
        return "transparent";
      case "ghost":
        return "transparent";
      default:
        return theme.primary;
    }
  };

  const content = (
    <ThemedText
      type="body"
      style={[
        styles.buttonText,
        { color: getTextColor() },
        size === "small" && { fontSize: 14 },
      ]}
    >
      {title || children}
    </ThemedText>
  );

  if (variant === "primary") {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          { height: getHeight(), opacity: disabled ? 0.5 : 1 },
          style,
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[Colors.dark.cardGradientStart, Colors.dark.cardGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        styles.buttonInner,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
          borderColor: variant === "outline" ? theme.primary : "transparent",
          borderWidth: variant === "outline" ? 1.5 : 0,
          opacity: disabled ? 0.5 : 1,
        },
        style,
        animatedStyle,
      ]}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  buttonInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
  },
});
