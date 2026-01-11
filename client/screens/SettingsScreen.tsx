import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Share,
  Platform,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive,
}: SettingsRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { borderBottomColor: theme.border }]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: destructive
              ? theme.error + "20"
              : theme.primary + "20",
          },
        ]}
      >
        <Feather
          name={icon}
          size={18}
          color={destructive ? theme.error : theme.primary}
        />
      </View>
      <ThemedText
        type="body"
        style={[styles.rowLabel, destructive && { color: theme.error }]}
      >
        {label}
      </ThemedText>
      {value ? (
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          {value}
        </ThemedText>
      ) : null}
      {onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <ThemedText
        type="caption"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        {title}
      </ThemedText>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { dreams, loadSampleData, clearAllData } = useDreams();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [isExporting, setIsExporting] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleExportJSON = async () => {
    if (dreams.length === 0) {
      showAlert("No Data", "There are no dreams to export.");
      return;
    }

    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        dreams: dreams,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `driim-backup-${new Date().toISOString().split("T")[0]}.json`;
      const docDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || "";
      const filePath = `${docDir}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, jsonString);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/json",
          dialogTitle: "Export Dreams",
        });
      } else {
        showAlert("Success", "Dreams exported successfully!");
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Export error:", error);
      showAlert("Error", "Failed to export dreams. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportMarkdown = async () => {
    if (dreams.length === 0) {
      showAlert("No Data", "There are no dreams to export.");
      return;
    }

    setIsExporting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      let markdown = "# Dream Journal\n\n";
      markdown += `Exported: ${new Date().toLocaleDateString()}\n\n`;
      markdown += "---\n\n";

      dreams.forEach((dream) => {
        const date = new Date(dream.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        markdown += `## ${dream.title}\n\n`;
        markdown += `**Date:** ${date}\n\n`;
        markdown += `**Lucidity:** ${dream.lucidityLevel}/5 | **Clarity:** ${dream.clarityLevel}/5\n\n`;

        if (dream.emotions.length > 0) {
          markdown += `**Emotions:** ${dream.emotions.join(", ")}\n\n`;
        }

        if (dream.tags.length > 0) {
          markdown += `**Tags:** ${dream.tags.join(", ")}\n\n`;
        }

        markdown += `${dream.content}\n\n`;
        markdown += "---\n\n";
      });

      const fileName = `driim-journal-${new Date().toISOString().split("T")[0]}.md`;
      const docDir = FileSystem.documentDirectory || FileSystem.cacheDirectory || "";
      const filePath = `${docDir}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, markdown);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: "text/markdown",
          dialogTitle: "Export Dreams",
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Export error:", error);
      showAlert("Error", "Failed to export dreams. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadSampleData = async () => {
    const confirmMessage = "This will add sample dreams to help you explore the app. Your existing dreams will not be affected. Continue?";
    
    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) {
        await loadSampleData();
        window.alert("Sample dreams have been loaded!");
      }
    } else {
      Alert.alert(
        "Load Sample Dreams",
        confirmMessage,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Load Samples",
            onPress: async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await loadSampleData();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Success", "Sample dreams have been loaded!");
            },
          },
        ]
      );
    }
  };

  const handleClearData = async () => {
    if (dreams.length === 0) {
      if (Platform.OS === "web") {
        window.alert("There are no dreams to clear.");
      } else {
        Alert.alert("No Data", "There are no dreams to clear.");
      }
      return;
    }

    const confirmMessage = `Are you sure you want to delete all ${dreams.length} dreams? This action cannot be undone.`;

    if (Platform.OS === "web") {
      if (window.confirm(confirmMessage)) {
        await clearAllData();
        window.alert("All dreams have been deleted.");
      }
    } else {
      Alert.alert(
        "Clear All Data",
        confirmMessage,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete All",
            style: "destructive",
            onPress: async () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              await clearAllData();
              Alert.alert("Cleared", "All dreams have been deleted.");
            },
          },
        ]
      );
    }
  };

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
        <View style={styles.profileSection}>
          <Image
            source={require("../../assets/images/default-avatar.png")}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <ThemedText type="h4">Dream Journal</ThemedText>
            <ThemedText
              type="caption"
              style={{ color: theme.textSecondary }}
            >
              {dreams.length} dream{dreams.length !== 1 ? "s" : ""} recorded
            </ThemedText>
          </View>
        </View>

        <SettingsSection title="DATA">
          <SettingsRow
            icon="download"
            label="Export as JSON"
            value={isExporting ? "Exporting..." : undefined}
            onPress={handleExportJSON}
          />
          <SettingsRow
            icon="file-text"
            label="Export as Markdown"
            onPress={handleExportMarkdown}
          />
          <SettingsRow
            icon="database"
            label="Load Sample Dreams"
            onPress={handleLoadSampleData}
          />
        </SettingsSection>

        <SettingsSection title="DANGER ZONE">
          <SettingsRow
            icon="trash-2"
            label="Clear All Dreams"
            onPress={handleClearData}
            destructive
          />
        </SettingsSection>

        <SettingsSection title="ABOUT">
          <SettingsRow icon="info" label="Version" value="1.0.0" />
          <SettingsRow icon="moon" label="App" value="Driim" />
        </SettingsSection>

        <View style={styles.footer}>
          <ThemedText
            type="caption"
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Driim - Your Dream Journal
          </ThemedText>
          <ThemedText
            type="caption"
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Record, reflect, and understand your dreams
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  footerText: {
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
});
