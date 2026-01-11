import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { ThemedView } from "@/components/ThemedView";
import { DreamCard } from "@/components/DreamCard";
import { FAB } from "@/components/FAB";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Dream } from "@/types/dream";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function JournalScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { dreams, isLoading, refreshDreams } = useDreams();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const handleDreamPress = useCallback(
    (dream: Dream) => {
      navigation.navigate("DreamDetail", { dreamId: dream.id });
    },
    [navigation]
  );

  const handleAddDream = useCallback(() => {
    navigation.navigate("DreamEdit", {});
  }, [navigation]);

  const renderDream = useCallback(
    ({ item, index }: { item: Dream; index: number }) => (
      <DreamCard
        dream={item}
        onPress={() => handleDreamPress(item)}
        index={index}
      />
    ),
    [handleDreamPress]
  );

  const keyExtractor = useCallback((item: Dream) => item.id, []);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {dreams.length === 0 ? (
        <View style={[styles.emptyContainer, { paddingTop: headerHeight }]}>
          <EmptyState
            image={require("../../assets/images/empty-journal.png")}
            title="Your dreams await"
            description="Start recording your dreams to unlock insights and patterns"
            actionLabel="Record First Dream"
            onAction={handleAddDream}
          />
        </View>
      ) : (
        <FlatList
          data={dreams}
          renderItem={renderDream}
          keyExtractor={keyExtractor}
          contentContainerStyle={[
            styles.list,
            {
              paddingTop: headerHeight + Spacing.lg,
              paddingBottom: tabBarHeight + 100,
            },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refreshDreams}
              tintColor={theme.primary}
            />
          }
        />
      )}
      <FAB onPress={handleAddDream} icon="plus" bottom={tabBarHeight + Spacing.xl} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
});
