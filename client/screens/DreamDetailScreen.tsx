import React, { useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { EMOTION_OPTIONS, AIReflection } from "@/types/dream";
import { getAIReflection } from "@/services/aiService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "DreamDetail">;
type RouteType = RouteProp<RootStackParamList, "DreamDetail">;

export default function DreamDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { getDream, deleteDream } = useDreams();

  const dreamId = route.params.dreamId;
  const dream = getDream(dreamId);

  const [reflection, setReflection] = useState<AIReflection | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getLucidityLabel = (level: number) => {
    const labels = [
      "Not Lucid",
      "Barely Aware",
      "Slightly Lucid",
      "Moderately Lucid",
      "Very Lucid",
      "Fully Lucid",
    ];
    return labels[Math.min(level, 5)];
  };

  const handleEdit = () => {
    navigation.navigate("DreamEdit", { dreamId });
  };

  const handleDelete = async () => {
    const confirmMessage = "Are you sure you want to delete this dream? This action cannot be undone.";
    
    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) {
        await deleteDream(dreamId);
        navigation.goBack();
      }
    } else {
      Alert.alert(
        "Delete Dream",
        confirmMessage,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await deleteDream(dreamId);
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  const handleReflect = async () => {
    if (!dream) return;
    
    setIsLoadingReflection(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const result = await getAIReflection(dream);
      setReflection(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      if (Platform.OS === "web") {
        window.alert("Failed to get reflection. Please try again.");
      } else {
        Alert.alert("Error", "Failed to get reflection. Please try again.");
      }
    } finally {
      setIsLoadingReflection(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: dream?.title || "Dream",
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: Spacing.sm }}>
          <HeaderButton onPress={handleEdit}>
            <Feather name="edit-2" size={20} color={theme.primary} />
          </HeaderButton>
          <HeaderButton onPress={handleDelete}>
            <Feather name="trash-2" size={20} color={theme.error} />
          </HeaderButton>
        </View>
      ),
    });
  }, [navigation, dream, theme]);

  if (!dream) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText type="h4">Dream not found</ThemedText>
      </ThemedView>
    );
  }

  const emotionData = dream.emotions.map((e) =>
    EMOTION_OPTIONS.find((opt) => opt.id === e)
  ).filter(Boolean);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateRow}>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {formatDate(dream.date)}
          </ThemedText>
          {dream.isNightmare ? (
            <View style={[styles.badge, { backgroundColor: theme.error + "20" }]}>
              <Feather name="cloud-lightning" size={14} color={theme.error} />
              <ThemedText type="caption" style={{ color: theme.error }}>
                Nightmare
              </ThemedText>
            </View>
          ) : null}
          {dream.isRecurring ? (
            <View style={[styles.badge, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="repeat" size={14} color={theme.primary} />
              <ThemedText type="caption" style={{ color: theme.primary }}>
                Recurring
              </ThemedText>
            </View>
          ) : null}
        </View>

        <ThemedText type="h2" style={styles.title}>
          {dream.title}
        </ThemedText>

        <View style={styles.metersContainer}>
          <View style={styles.meter}>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Lucidity
            </ThemedText>
            <View style={styles.meterBar}>
              <View
                style={[
                  styles.meterFill,
                  {
                    width: `${(dream.lucidityLevel / 5) * 100}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <ThemedText type="caption">
              {getLucidityLabel(dream.lucidityLevel)}
            </ThemedText>
          </View>
          <View style={styles.meter}>
            <ThemedText type="caption" style={{ color: theme.textSecondary }}>
              Clarity
            </ThemedText>
            <View style={styles.meterBar}>
              <View
                style={[
                  styles.meterFill,
                  {
                    width: `${(dream.clarityLevel / 5) * 100}%`,
                    backgroundColor: theme.accent,
                  },
                ]}
              />
            </View>
            <ThemedText type="caption">{dream.clarityLevel}/5</ThemedText>
          </View>
        </View>

        <View style={[styles.contentCard, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="body" style={styles.dreamContent}>
            {dream.content}
          </ThemedText>
        </View>

        {emotionData.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="body" style={styles.sectionTitle}>
              Emotions
            </ThemedText>
            <View style={styles.tagsRow}>
              {emotionData.map((emotion) =>
                emotion ? (
                  <View
                    key={emotion.id}
                    style={[styles.tag, { backgroundColor: emotion.color + "30" }]}
                  >
                    <View
                      style={[styles.emotionDot, { backgroundColor: emotion.color }]}
                    />
                    <ThemedText type="caption" style={{ color: emotion.color }}>
                      {emotion.label}
                    </ThemedText>
                  </View>
                ) : null
              )}
            </View>
          </View>
        ) : null}

        {dream.tags.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="body" style={styles.sectionTitle}>
              Tags
            </ThemedText>
            <View style={styles.tagsRow}>
              {dream.tags.map((tag) => (
                <View
                  key={tag}
                  style={[styles.tag, { backgroundColor: theme.backgroundSecondary }]}
                >
                  <ThemedText type="caption">{tag}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {dream.dreamSigns.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="body" style={styles.sectionTitle}>
              Dream Signs
            </ThemedText>
            <View style={styles.tagsRow}>
              {dream.dreamSigns.map((sign) => (
                <View
                  key={sign}
                  style={[styles.tag, { backgroundColor: theme.primary + "20" }]}
                >
                  <ThemedText type="caption" style={{ color: theme.primary }}>
                    {sign}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {dream.people.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="body" style={styles.sectionTitle}>
              People
            </ThemedText>
            <View style={styles.tagsRow}>
              {dream.people.map((person) => (
                <View
                  key={person}
                  style={[styles.tag, { backgroundColor: theme.backgroundSecondary }]}
                >
                  <Feather
                    name="user"
                    size={12}
                    color={theme.textSecondary}
                    style={{ marginRight: 4 }}
                  />
                  <ThemedText type="caption">{person}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {dream.places.length > 0 ? (
          <View style={styles.section}>
            <ThemedText type="body" style={styles.sectionTitle}>
              Places
            </ThemedText>
            <View style={styles.tagsRow}>
              {dream.places.map((place) => (
                <View
                  key={place}
                  style={[styles.tag, { backgroundColor: theme.backgroundSecondary }]}
                >
                  <Feather
                    name="map-pin"
                    size={12}
                    color={theme.textSecondary}
                    style={{ marginRight: 4 }}
                  />
                  <ThemedText type="caption">{place}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.reflectSection}>
          <Button
            title={isLoadingReflection ? "Reflecting..." : "Reflect on this Dream"}
            onPress={handleReflect}
            variant="secondary"
            disabled={isLoadingReflection}
          />
        </View>

        {isLoadingReflection ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : null}

        {reflection ? (
          <View
            style={[
              styles.reflectionCard,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <ThemedText type="h4" style={styles.reflectionTitle}>
              AI Reflection
            </ThemedText>

            <View style={styles.reflectionSection}>
              <ThemedText type="body" style={styles.reflectionLabel}>
                Summary
              </ThemedText>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                {reflection.summary}
              </ThemedText>
            </View>

            <View style={styles.reflectionSection}>
              <ThemedText type="body" style={styles.reflectionLabel}>
                Possible Themes
              </ThemedText>
              <View style={styles.tagsRow}>
                {reflection.possibleThemes.map((theme_item) => (
                  <View
                    key={theme_item}
                    style={[
                      styles.tag,
                      { backgroundColor: theme.primary + "20" },
                    ]}
                  >
                    <ThemedText type="caption" style={{ color: theme.primary }}>
                      {theme_item}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.reflectionSection}>
              <ThemedText type="body" style={styles.reflectionLabel}>
                Questions for Reflection
              </ThemedText>
              {reflection.questionsForReflection.map((question, i) => (
                <ThemedText
                  key={i}
                  type="body"
                  style={[styles.question, { color: theme.textSecondary }]}
                >
                  {i + 1}. {question}
                </ThemedText>
              ))}
            </View>

            {reflection.lucidityTrainingTips.length > 0 ? (
              <View style={styles.reflectionSection}>
                <ThemedText type="body" style={styles.reflectionLabel}>
                  Lucidity Training Tips
                </ThemedText>
                {reflection.lucidityTrainingTips.map((tip, i) => (
                  <ThemedText
                    key={i}
                    type="body"
                    style={[styles.question, { color: theme.textSecondary }]}
                  >
                    {tip}
                  </ThemedText>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    gap: 4,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  metersContainer: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  meter: {
    flex: 1,
  },
  meterBar: {
    height: 6,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 3,
    marginVertical: Spacing.xs,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: 3,
  },
  contentCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  dreamContent: {
    lineHeight: 26,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  emotionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  reflectSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  reflectionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  reflectionTitle: {
    marginBottom: Spacing.lg,
  },
  reflectionSection: {
    marginBottom: Spacing.lg,
  },
  reflectionLabel: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  question: {
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
});
