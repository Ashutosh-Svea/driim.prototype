import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DreamCard } from "@/components/DreamCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Dream, DreamFilter, EMOTION_OPTIONS } from "@/types/dream";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "lucidity", label: "Lucidity" },
  { id: "rating", label: "Rating" },
] as const;

export default function SearchScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { searchDreams, dreams } = useDreams();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [nightmareOnly, setNightmareOnly] = useState(false);
  const [recurringOnly, setRecurringOnly] = useState(false);
  const [sortBy, setSortBy] = useState<DreamFilter["sortBy"]>("newest");

  const results = useMemo(() => {
    const filter: DreamFilter = {
      query: query.trim() || undefined,
      emotions: selectedEmotions.length > 0 ? selectedEmotions : undefined,
      nightmareOnly: nightmareOnly || undefined,
      recurringOnly: recurringOnly || undefined,
      sortBy,
    };
    return searchDreams(filter);
  }, [query, selectedEmotions, nightmareOnly, recurringOnly, sortBy, searchDreams, dreams]);

  const handleDreamPress = useCallback(
    (dream: Dream) => {
      navigation.navigate("DreamDetail", { dreamId: dream.id });
    },
    [navigation]
  );

  const toggleEmotion = (emotionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEmotions((prev) =>
      prev.includes(emotionId)
        ? prev.filter((e) => e !== emotionId)
        : [...prev, emotionId]
    );
  };

  const clearFilters = () => {
    setSelectedEmotions([]);
    setNightmareOnly(false);
    setRecurringOnly(false);
    setSortBy("newest");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const hasActiveFilters =
    selectedEmotions.length > 0 || nightmareOnly || recurringOnly;

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

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            paddingTop: headerHeight + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search dreams..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            testID="input-search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x" size={20} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          onPress={() => {
            setShowFilters(!showFilters);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.filterButton,
            {
              backgroundColor: hasActiveFilters
                ? theme.primary + "20"
                : theme.backgroundSecondary,
            },
          ]}
        >
          <Feather
            name="sliders"
            size={20}
            color={hasActiveFilters ? theme.primary : theme.textSecondary}
          />
        </Pressable>
      </View>

      {showFilters ? (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[styles.filtersPanel, { backgroundColor: theme.backgroundDefault }]}
        >
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <ThemedText type="body" style={styles.filterLabel}>
                Sort by
              </ThemedText>
            </View>
            <View style={styles.sortOptions}>
              {SORT_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    setSortBy(option.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={[
                    styles.sortChip,
                    {
                      backgroundColor:
                        sortBy === option.id
                          ? theme.primary + "20"
                          : theme.backgroundSecondary,
                      borderColor:
                        sortBy === option.id ? theme.primary : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    type="caption"
                    style={{
                      color:
                        sortBy === option.id ? theme.primary : theme.textSecondary,
                    }}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <ThemedText type="body" style={styles.filterLabel}>
              Emotions
            </ThemedText>
            <View style={styles.emotionOptions}>
              {EMOTION_OPTIONS.map((emotion) => (
                <Pressable
                  key={emotion.id}
                  onPress={() => toggleEmotion(emotion.id)}
                  style={[
                    styles.emotionChip,
                    {
                      backgroundColor: selectedEmotions.includes(emotion.id)
                        ? emotion.color + "30"
                        : theme.backgroundSecondary,
                      borderColor: selectedEmotions.includes(emotion.id)
                        ? emotion.color
                        : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[styles.emotionDot, { backgroundColor: emotion.color }]}
                  />
                  <ThemedText
                    type="caption"
                    style={{
                      color: selectedEmotions.includes(emotion.id)
                        ? emotion.color
                        : theme.textSecondary,
                    }}
                  >
                    {emotion.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterRow}>
              <Pressable
                onPress={() => {
                  setNightmareOnly(!nightmareOnly);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: nightmareOnly
                      ? theme.error + "20"
                      : theme.backgroundSecondary,
                    borderColor: nightmareOnly ? theme.error : "transparent",
                  },
                ]}
              >
                <Feather
                  name="cloud-lightning"
                  size={16}
                  color={nightmareOnly ? theme.error : theme.textSecondary}
                />
                <ThemedText
                  type="caption"
                  style={{
                    color: nightmareOnly ? theme.error : theme.textSecondary,
                  }}
                >
                  Nightmares
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setRecurringOnly(!recurringOnly);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: recurringOnly
                      ? theme.primary + "20"
                      : theme.backgroundSecondary,
                    borderColor: recurringOnly ? theme.primary : "transparent",
                  },
                ]}
              >
                <Feather
                  name="repeat"
                  size={16}
                  color={recurringOnly ? theme.primary : theme.textSecondary}
                />
                <ThemedText
                  type="caption"
                  style={{
                    color: recurringOnly ? theme.primary : theme.textSecondary,
                  }}
                >
                  Recurring
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {hasActiveFilters ? (
            <Pressable onPress={clearFilters} style={styles.clearButton}>
              <ThemedText type="caption" style={{ color: theme.primary }}>
                Clear all filters
              </ThemedText>
            </Pressable>
          ) : null}
        </Animated.View>
      ) : null}

      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            image={require("../../assets/images/empty-search.png")}
            title="No dreams found"
            description={
              query.trim() || hasActiveFilters
                ? "Try adjusting your search or filters"
                : "Start recording dreams to search through them"
            }
          />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderDream}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <ThemedText
              type="caption"
              style={[styles.resultCount, { color: theme.textSecondary }]}
            >
              {results.length} dream{results.length !== 1 ? "s" : ""} found
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    height: 48,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  filtersPanel: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterLabel: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  sortOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  sortChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  emotionOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  emotionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  toggleChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  clearButton: {
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: Spacing["3xl"],
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  resultCount: {
    marginBottom: Spacing.md,
  },
});
