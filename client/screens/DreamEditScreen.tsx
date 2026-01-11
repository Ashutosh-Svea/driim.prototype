import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { EmotionPicker } from "@/components/EmotionPicker";
import { LevelSlider } from "@/components/LevelSlider";
import { TagInput } from "@/components/TagInput";
import { useTheme } from "@/hooks/useTheme";
import { useDreams } from "@/contexts/DreamContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { DreamInput, TEMPLATE_OPTIONS } from "@/types/dream";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "DreamEdit">;
type RouteType = RouteProp<RootStackParamList, "DreamEdit">;

const LUCIDITY_LABELS = [
  "Not Lucid",
  "Barely Aware",
  "Slightly Lucid",
  "Moderately Lucid",
  "Very Lucid",
  "Fully Lucid",
];

const CLARITY_LABELS = [
  "Very Foggy",
  "Foggy",
  "Somewhat Clear",
  "Clear",
  "Very Clear",
  "Crystal Clear",
];

export default function DreamEditScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const insets = useSafeAreaInsets();
  const { getDream, addDream, updateDream } = useDreams();

  const dreamId = route.params?.dreamId;
  const existingDream = dreamId ? getDream(dreamId) : undefined;
  const isEditing = !!existingDream;

  const [title, setTitle] = useState(existingDream?.title || "");
  const [content, setContent] = useState(existingDream?.content || "");
  const [lucidityLevel, setLucidityLevel] = useState(
    existingDream?.lucidityLevel ?? 0
  );
  const [clarityLevel, setClarityLevel] = useState(
    existingDream?.clarityLevel ?? 3
  );
  const [emotions, setEmotions] = useState<string[]>(
    existingDream?.emotions || []
  );
  const [tags, setTags] = useState<string[]>(existingDream?.tags || []);
  const [dreamSigns, setDreamSigns] = useState<string[]>(
    existingDream?.dreamSigns || []
  );
  const [people, setPeople] = useState<string[]>(existingDream?.people || []);
  const [places, setPlaces] = useState<string[]>(existingDream?.places || []);
  const [rating, setRating] = useState(existingDream?.rating ?? 3);
  const [isNightmare, setIsNightmare] = useState(
    existingDream?.isNightmare ?? false
  );
  const [isRecurring, setIsRecurring] = useState(
    existingDream?.isRecurring ?? false
  );
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const canSave = title.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || isSaving) return;

    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const dreamInput: DreamInput = {
      title: title.trim(),
      content: content.trim(),
      lucidityLevel,
      clarityLevel,
      emotions,
      tags,
      dreamSigns,
      people,
      places,
      rating,
      isNightmare,
      isRecurring,
    };

    try {
      if (isEditing && dreamId) {
        await updateDream(dreamId, dreamInput);
      } else {
        await addDream(dreamInput);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (Platform.OS === "web") {
        window.alert("Failed to save dream. Please try again.");
      } else {
        Alert.alert("Error", "Failed to save dream. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (Platform.OS === "web") {
        if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
          navigation.goBack();
        }
      } else {
        Alert.alert(
          "Discard Changes?",
          "You have unsaved changes. Are you sure you want to discard them?",
          [
            { text: "Keep Editing", style: "cancel" },
            {
              text: "Discard",
              style: "destructive",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } else {
      navigation.goBack();
    }
  };

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (templateId) {
      case "short":
        setContent("");
        break;
      case "detailed":
        if (!content) {
          setContent(
            "Setting:\n\nWhat happened:\n\nHow I felt:\n\nNotable details:\n"
          );
        }
        break;
      case "lucid":
        if (!content) {
          setContent(
            "Reality check that triggered lucidity:\n\nLevel of control:\n\nWhat I attempted:\n\nHow it ended:\n"
          );
        }
        break;
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isEditing ? "Edit Dream" : "New Dream",
      headerLeft: () => (
        <HeaderButton onPress={handleCancel}>
          <ThemedText style={{ color: theme.primary }}>Cancel</ThemedText>
        </HeaderButton>
      ),
      headerRight: () => (
        <HeaderButton onPress={handleSave} disabled={!canSave || isSaving}>
          <ThemedText
            style={{
              color: canSave ? theme.primary : theme.textSecondary,
              fontWeight: "600",
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </ThemedText>
        </HeaderButton>
      ),
    });
  }, [navigation, canSave, isSaving, isEditing, theme]);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing["3xl"] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.templateContainer}>
          {TEMPLATE_OPTIONS.map((template) => (
            <Pressable
              key={template.id}
              onPress={() => applyTemplate(template.id)}
              style={[
                styles.templateChip,
                {
                  backgroundColor:
                    selectedTemplate === template.id
                      ? theme.primary + "20"
                      : theme.backgroundSecondary,
                  borderColor:
                    selectedTemplate === template.id
                      ? theme.primary
                      : "transparent",
                },
              ]}
            >
              <ThemedText
                type="caption"
                style={{
                  color:
                    selectedTemplate === template.id
                      ? theme.primary
                      : theme.textSecondary,
                }}
              >
                {template.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Dream title..."
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.titleInput,
              { color: theme.text, borderColor: theme.border },
            ]}
            autoFocus={!isEditing}
            testID="input-title"
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Describe your dream..."
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.contentInput,
              {
                color: theme.text,
                backgroundColor: theme.backgroundSecondary,
              },
            ]}
            multiline
            textAlignVertical="top"
            testID="input-content"
          />
        </View>

        <LevelSlider
          label="Lucidity Level"
          value={lucidityLevel}
          onChange={setLucidityLevel}
          labels={LUCIDITY_LABELS}
        />

        <LevelSlider
          label="Clarity Level"
          value={clarityLevel}
          onChange={setClarityLevel}
          labels={CLARITY_LABELS}
        />

        <View style={styles.inputGroup}>
          <ThemedText type="body" style={styles.label}>
            Emotions
          </ThemedText>
          <EmotionPicker selected={emotions} onSelect={setEmotions} />
        </View>

        <TagInput label="Tags" tags={tags} onTagsChange={setTags} />

        <TagInput
          label="Dream Signs"
          tags={dreamSigns}
          onTagsChange={setDreamSigns}
          placeholder="Add dream sign..."
        />

        <TagInput
          label="People"
          tags={people}
          onTagsChange={setPeople}
          placeholder="Add person..."
        />

        <TagInput
          label="Places"
          tags={places}
          onTagsChange={setPlaces}
          placeholder="Add place..."
        />

        <LevelSlider
          label="Rating"
          value={rating}
          onChange={setRating}
          maxValue={5}
        />

        <View style={styles.switchRow}>
          <ThemedText type="body">Nightmare</ThemedText>
          <Switch
            value={isNightmare}
            onValueChange={(val) => {
              setIsNightmare(val);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: theme.border, true: theme.error + "80" }}
            thumbColor={isNightmare ? theme.error : theme.backgroundTertiary}
          />
        </View>

        <View style={styles.switchRow}>
          <ThemedText type="body">Recurring Dream</ThemedText>
          <Switch
            value={isRecurring}
            onValueChange={(val) => {
              setIsRecurring(val);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            trackColor={{ false: theme.border, true: theme.primary + "80" }}
            thumbColor={isRecurring ? theme.primary : theme.backgroundTertiary}
          />
        </View>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  templateContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  templateChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  contentInput: {
    minHeight: 150,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    lineHeight: 24,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
});
