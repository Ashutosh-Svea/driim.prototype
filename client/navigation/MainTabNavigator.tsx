import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import JournalScreen from "@/screens/JournalScreen";
import SearchScreen from "@/screens/SearchScreen";
import InsightsScreen from "@/screens/InsightsScreen";
import CalendarScreen from "@/screens/CalendarScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";

export type MainTabParamList = {
  JournalTab: undefined;
  SearchTab: undefined;
  InsightsTab: undefined;
  CalendarTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="JournalTab"
      screenOptions={{
        headerTitleAlign: "center",
        headerTransparent: true,
        headerBlurEffect: isDark ? "dark" : "light",
        headerTintColor: theme.text,
        headerStyle: {
          backgroundColor: Platform.select({
            ios: undefined,
            android: theme.backgroundRoot,
            web: theme.backgroundRoot,
          }),
        },
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
      }}
    >
      <Tab.Screen
        name="JournalTab"
        component={JournalScreen}
        options={{
          title: "Journal",
          headerTitle: () => <HeaderTitle title="Driim" showIcon />,
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: "Search",
          headerTitle: "Search Dreams",
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InsightsTab"
        component={InsightsScreen}
        options={{
          title: "Insights",
          headerTitle: "Insights",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bar-chart-2" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          title: "Calendar",
          headerTitle: "Calendar",
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerTitle: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
