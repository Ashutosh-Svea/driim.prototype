import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DreamCard } from "@/components/DreamCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { Dream } from "@/types/dream";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { dreams, getCalendarDays } = useDreams();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(
    () => getCalendarDays(year, month),
    [year, month, getCalendarDays, dreams]
  );

  const dreamsByDate = useMemo(() => {
    const map: Record<string, Dream[]> = {};
    dreams.forEach((dream) => {
      const dateKey = dream.date.split("T")[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(dream);
    });
    return map;
  }, [dreams]);

  const selectedDreams = useMemo(() => {
    if (!selectedDate) return [];
    return dreamsByDate[selectedDate] || [];
  }, [selectedDate, dreamsByDate]);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarGrid = useMemo(() => {
    const grid: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(day);
    }
    while (grid.length % 7 !== 0) {
      grid.push(null);
    }
    return grid;
  }, [firstDayOfMonth, daysInMonth]);

  const handlePrevMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayPress = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDreams = dreamsByDate[dateStr];
    if (dayDreams && dayDreams.length > 0) {
      setSelectedDate(dateStr);
      setShowDayModal(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleDreamPress = useCallback(
    (dream: Dream) => {
      setShowDayModal(false);
      setTimeout(() => {
        navigation.navigate("DreamDetail", { dreamId: dream.id });
      }, 300);
    },
    [navigation]
  );

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarDays.find((d) => d.date === dateStr);
  };

  const getLucidityColor = (avgLucidity: number) => {
    if (avgLucidity >= 4) return theme.primary;
    if (avgLucidity >= 2) return theme.primaryLight;
    return theme.accent;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

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
          styles.calendarContainer,
          { paddingTop: headerHeight + Spacing.lg },
        ]}
      >
        <View style={styles.monthNav}>
          <Pressable onPress={handlePrevMonth} style={styles.navButton}>
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>
          <ThemedText type="h3">
            {MONTHS[month]} {year}
          </ThemedText>
          <Pressable onPress={handleNextMonth} style={styles.navButton}>
            <Feather name="chevron-right" size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((day) => (
            <View key={day} style={styles.weekdayCell}>
              <ThemedText
                type="caption"
                style={{ color: theme.textSecondary }}
              >
                {day}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarGrid.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const dayData = getDayData(day);
            const hasDreams = dayData && dayData.dreamCount > 0;
            const today = isToday(day);

            return (
              <Pressable
                key={day}
                onPress={() => handleDayPress(day)}
                style={[
                  styles.dayCell,
                  today && {
                    backgroundColor: theme.primary + "20",
                    borderRadius: BorderRadius.sm,
                  },
                ]}
              >
                <ThemedText
                  type="body"
                  style={[
                    styles.dayText,
                    today && { color: theme.primary, fontWeight: "700" },
                  ]}
                >
                  {day}
                </ThemedText>
                {hasDreams ? (
                  <View style={styles.dotsRow}>
                    {[...Array(Math.min(dayData.dreamCount, 3))].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dreamDot,
                          {
                            backgroundColor: getLucidityColor(
                              dayData.avgLucidity
                            ),
                          },
                        ]}
                      />
                    ))}
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {dreams.length === 0 ? (
          <View style={styles.emptyHint}>
            <EmptyState
              image={require("../../assets/images/empty-calendar.png")}
              title="No dreams recorded"
              description="Days with dreams will show dots on the calendar"
            />
          </View>
        ) : null}
      </View>

      <Modal
        visible={showDayModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDayModal(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="h4">
              {selectedDate
                ? new Date(selectedDate + "T12:00:00").toLocaleDateString(
                    "en-US",
                    { weekday: "long", month: "long", day: "numeric" }
                  )
                : "Dreams"}
            </ThemedText>
            <Pressable
              onPress={() => setShowDayModal(false)}
              style={[
                styles.closeButton,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="x" size={20} color={theme.text} />
            </Pressable>
          </View>

          <FlatList
            data={selectedDreams}
            renderItem={renderDream}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.modalList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <ThemedText
                type="body"
                style={[styles.noDataText, { color: theme.textSecondary }]}
              >
                No dreams on this day
              </ThemedText>
            }
          />
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  navButton: {
    padding: Spacing.sm,
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
  },
  dayText: {
    marginBottom: 2,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 2,
  },
  dreamDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emptyHint: {
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modalList: {
    padding: Spacing.lg,
    paddingBottom: Spacing["3xl"],
  },
  noDataText: {
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
