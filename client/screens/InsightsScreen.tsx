import React, { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing, BorderRadius, Shadows, Colors } from "@/constants/theme";
import { EMOTION_OPTIONS } from "@/types/dream";

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  gradient?: boolean;
  delay?: number;
}) {
  const { theme } = useTheme();

  if (gradient) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).duration(400)}
        style={[styles.statCard, Shadows.card]}
      >
        <LinearGradient
          colors={[Colors.dark.cardGradientStart, Colors.dark.cardGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <View style={styles.statIcon}>
            <Feather name={icon} size={24} color="#FFFFFF" />
          </View>
          <ThemedText type="display" style={styles.statValueWhite}>
            {value}
          </ThemedText>
          <ThemedText type="body" style={styles.statTitleWhite}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText type="caption" style={styles.statSubtitleWhite}>
              {subtitle}
            </ThemedText>
          ) : null}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[
        styles.statCard,
        styles.statCardRegular,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: theme.primary + "20" }]}>
        <Feather name={icon} size={20} color={theme.primary} />
      </View>
      <ThemedText type="h2" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="body" style={{ color: theme.textSecondary }}>
        {title}
      </ThemedText>
    </Animated.View>
  );
}

function BarChart({
  data,
  title,
  delay = 0,
}: {
  data: { label: string; value: number }[];
  title: string;
  delay?: number;
}) {
  const { theme } = useTheme();
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[
        styles.chartCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
      ]}
    >
      <ThemedText type="h4" style={styles.chartTitle}>
        {title}
      </ThemedText>
      <View style={styles.barChart}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <ThemedText type="caption" style={styles.barLabel}>
              {item.label}
            </ThemedText>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function TopItems({
  title,
  items,
  type,
  delay = 0,
}: {
  title: string;
  items: { label: string; count: number; color?: string }[];
  type: "emotion" | "tag";
  delay?: number;
}) {
  const { theme } = useTheme();

  if (items.length === 0) return null;

  const maxCount = Math.max(...items.map((i) => i.count), 1);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[
        styles.chartCard,
        { backgroundColor: theme.backgroundDefault },
        Shadows.card,
      ]}
    >
      <ThemedText type="h4" style={styles.chartTitle}>
        {title}
      </ThemedText>
      {items.map((item, index) => (
        <View key={item.label} style={styles.topItemRow}>
          <View style={styles.topItemLabel}>
            {type === "emotion" && item.color ? (
              <View
                style={[styles.emotionDot, { backgroundColor: item.color }]}
              />
            ) : null}
            <ThemedText type="body">{item.label}</ThemedText>
          </View>
          <View style={styles.topItemBar}>
            <View
              style={[
                styles.topItemFill,
                {
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: item.color || theme.primary,
                },
              ]}
            />
          </View>
          <ThemedText
            type="caption"
            style={[styles.topItemCount, { color: theme.textSecondary }]}
          >
            {item.count}
          </ThemedText>
        </View>
      ))}
    </Animated.View>
  );
}

export default function InsightsScreen() {
  const { theme } = useTheme();
  const { dreams, getInsights } = useDreams();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const insights = useMemo(() => getInsights(), [dreams, getInsights]);

  if (dreams.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.emptyContainer, { paddingTop: headerHeight }]}>
          <EmptyState
            image={require("../../assets/images/empty-journal.png")}
            title="No insights yet"
            description="Start recording dreams to unlock patterns and analytics"
          />
        </View>
      </ThemedView>
    );
  }

  const weeklyData = insights.weeklyDreamCounts.map((w) => ({
    label: w.week.replace("Week ", "W"),
    value: w.count,
  }));

  const emotionItems = insights.topEmotions.map((e) => {
    const emotionData = EMOTION_OPTIONS.find((opt) => opt.id === e.emotion);
    return {
      label: emotionData?.label || e.emotion,
      count: e.count,
      color: emotionData?.color,
    };
  });

  const tagItems = insights.topTags.map((t) => ({
    label: t.tag,
    count: t.count,
  }));

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <StatCard
          title="Day Streak"
          value={insights.currentStreak}
          subtitle={`Longest: ${insights.longestStreak} days`}
          icon="zap"
          gradient
          delay={0}
        />

        <View style={styles.statsRow}>
          <StatCard
            title="Total Dreams"
            value={insights.totalDreams}
            icon="book"
            delay={100}
          />
          <StatCard
            title="This Week"
            value={insights.dreamsThisWeek}
            icon="calendar"
            delay={150}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Avg Lucidity"
            value={insights.averageLucidity.toFixed(1)}
            icon="sun"
            delay={200}
          />
          <StatCard
            title="This Month"
            value={insights.dreamsThisMonth}
            icon="trending-up"
            delay={250}
          />
        </View>

        <BarChart data={weeklyData} title="Dreams per Week" delay={300} />

        <TopItems
          title="Top Emotions"
          items={emotionItems}
          type="emotion"
          delay={400}
        />

        <TopItems
          title="Top Tags"
          items={tagItems}
          type="tag"
          delay={500}
        />

        {insights.topDreamSigns.length > 0 ? (
          <TopItems
            title="Dream Signs"
            items={insights.topDreamSigns.map((s) => ({
              label: s.sign,
              count: s.count,
            }))}
            type="tag"
            delay={600}
          />
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  statCardRegular: {
    padding: Spacing.lg,
  },
  gradientCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  statValue: {
    marginBottom: Spacing.xs,
  },
  statValueWhite: {
    color: "#FFFFFF",
    marginBottom: Spacing.xs,
  },
  statTitleWhite: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  statSubtitleWhite: {
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: Spacing.xs,
  },
  chartCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  chartTitle: {
    marginBottom: Spacing.lg,
  },
  barChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    width: "60%",
    height: 100,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    marginTop: Spacing.sm,
  },
  topItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  topItemLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    gap: Spacing.sm,
  },
  emotionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  topItemBar: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    borderRadius: 4,
    marginHorizontal: Spacing.md,
    overflow: "hidden",
  },
  topItemFill: {
    height: "100%",
    borderRadius: 4,
  },
  topItemCount: {
    width: 30,
    textAlign: "right",
  },
});
