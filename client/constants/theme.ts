import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#2D2640",
    textSecondary: "#6B6380",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B6380",
    tabIconSelected: "#4A3B8C",
    link: "#4A3B8C",
    backgroundRoot: "#F5F3FF",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#EBE8F7",
    backgroundTertiary: "#DDD8EE",
    primary: "#4A3B8C",
    primaryLight: "#7B68C4",
    accent: "#FFA94D",
    success: "#6BCF7F",
    warning: "#FFB84D",
    error: "#FF6B6B",
    border: "#E0DCF0",
    cardGradientStart: "#4A3B8C",
    cardGradientEnd: "#7B68C4",
  },
  dark: {
    text: "#F5F3FF",
    textSecondary: "#A69FBD",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A69FBD",
    tabIconSelected: "#7B68C4",
    link: "#7B68C4",
    backgroundRoot: "#0F0E1A",
    backgroundDefault: "#1A1825",
    backgroundSecondary: "#252233",
    backgroundTertiary: "#302D40",
    primary: "#7B68C4",
    primaryLight: "#9B8CD4",
    accent: "#FFA94D",
    success: "#6BCF7F",
    warning: "#FFB84D",
    error: "#FF6B6B",
    border: "#3A3650",
    cardGradientStart: "#4A3B8C",
    cardGradientEnd: "#7B68C4",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    fontWeight: "700" as const,
    fontFamily: "Nunito_700Bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600" as const,
    fontFamily: "Nunito_600SemiBold",
  },
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    fontFamily: "Nunito_700Bold",
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
    fontFamily: "Nunito_700Bold",
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    fontFamily: "Nunito_600SemiBold",
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    fontFamily: "Nunito_600SemiBold",
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    fontFamily: "Nunito_400Regular",
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
    fontFamily: "Nunito_400Regular",
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Nunito_600SemiBold",
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
    fontFamily: "Nunito_400Regular",
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
    fontFamily: "Nunito_400Regular",
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fab: {
    shadowColor: "#4A3B8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "Nunito_400Regular",
    semiBold: "Nunito_600SemiBold",
    bold: "Nunito_700Bold",
    mono: "ui-monospace",
  },
  default: {
    sans: "Nunito_400Regular",
    semiBold: "Nunito_600SemiBold",
    bold: "Nunito_700Bold",
    mono: "monospace",
  },
  web: {
    sans: "Nunito, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    semiBold: "Nunito, system-ui, sans-serif",
    bold: "Nunito, system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Emotions = [
  { id: "joy", label: "Joy", color: "#FFD93D" },
  { id: "fear", label: "Fear", color: "#8B5CF6" },
  { id: "awe", label: "Awe", color: "#60A5FA" },
  { id: "grief", label: "Grief", color: "#6B7280" },
  { id: "peace", label: "Peace", color: "#34D399" },
  { id: "desire", label: "Desire", color: "#F472B6" },
  { id: "anger", label: "Anger", color: "#EF4444" },
  { id: "confusion", label: "Confusion", color: "#A78BFA" },
];
