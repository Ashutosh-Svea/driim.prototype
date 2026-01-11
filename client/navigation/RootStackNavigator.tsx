import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import DreamDetailScreen from "@/screens/DreamDetailScreen";
import DreamEditScreen from "@/screens/DreamEditScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  DreamDetail: { dreamId: string };
  DreamEdit: { dreamId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DreamDetail"
        component={DreamDetailScreen}
        options={{
          headerTitle: "Dream",
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="DreamEdit"
        component={DreamEditScreen}
        options={{
          headerTitle: "New Dream",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
