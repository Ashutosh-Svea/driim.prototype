import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Dream,
  DreamInput,
  DreamFilter,
  DreamInsights,
  CalendarDay,
} from "@/types/dream";

const DREAMS_STORAGE_KEY = "@driim_dreams";

interface DreamContextType {
  dreams: Dream[];
  isLoading: boolean;
  error: string | null;
  addDream: (input: DreamInput) => Promise<Dream>;
  updateDream: (id: string, input: DreamInput) => Promise<Dream | null>;
  deleteDream: (id: string) => Promise<boolean>;
  getDream: (id: string) => Dream | undefined;
  searchDreams: (filter: DreamFilter) => Dream[];
  getInsights: () => DreamInsights;
  getCalendarDays: (year: number, month: number) => CalendarDay[];
  loadSampleData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  refreshDreams: () => Promise<void>;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export function DreamProvider({ children }: { children: ReactNode }) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDreams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(DREAMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDreams(parsed.sort((a: Dream, b: Dream) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
    } catch (err) {
      setError("Failed to load dreams");
      console.error("Failed to load dreams:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDreams();
  }, [loadDreams]);

  const saveDreams = async (newDreams: Dream[]) => {
    try {
      await AsyncStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(newDreams));
    } catch (err) {
      console.error("Failed to save dreams:", err);
      throw err;
    }
  };

  const addDream = async (input: DreamInput): Promise<Dream> => {
    const now = new Date().toISOString();
    const newDream: Dream = {
      id: uuidv4(),
      title: input.title,
      content: input.content,
      date: input.date || now,
      sleepStart: input.sleepStart,
      wakeTime: input.wakeTime,
      lucidityLevel: input.lucidityLevel ?? 0,
      clarityLevel: input.clarityLevel ?? 3,
      emotions: input.emotions || [],
      tags: input.tags || [],
      dreamSigns: input.dreamSigns || [],
      people: input.people || [],
      places: input.places || [],
      themes: input.themes || [],
      rating: input.rating ?? 3,
      isNightmare: input.isNightmare ?? false,
      isRecurring: input.isRecurring ?? false,
      isPrivate: input.isPrivate ?? false,
      createdAt: now,
      updatedAt: now,
    };

    const newDreams = [newDream, ...dreams];
    await saveDreams(newDreams);
    setDreams(newDreams);
    return newDream;
  };

  const updateDream = async (id: string, input: DreamInput): Promise<Dream | null> => {
    const index = dreams.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const updatedDream: Dream = {
      ...dreams[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const newDreams = [...dreams];
    newDreams[index] = updatedDream;
    await saveDreams(newDreams);
    setDreams(newDreams);
    return updatedDream;
  };

  const deleteDream = async (id: string): Promise<boolean> => {
    const newDreams = dreams.filter((d) => d.id !== id);
    if (newDreams.length === dreams.length) return false;

    await saveDreams(newDreams);
    setDreams(newDreams);
    return true;
  };

  const getDream = (id: string): Dream | undefined => {
    return dreams.find((d) => d.id === id);
  };

  const searchDreams = (filter: DreamFilter): Dream[] => {
    let result = [...dreams];

    if (filter.query) {
      const q = filter.query.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filter.dateFrom) {
      result = result.filter((d) => d.date >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      result = result.filter((d) => d.date <= filter.dateTo!);
    }

    if (filter.minLucidity !== undefined) {
      result = result.filter((d) => d.lucidityLevel >= filter.minLucidity!);
    }

    if (filter.maxLucidity !== undefined) {
      result = result.filter((d) => d.lucidityLevel <= filter.maxLucidity!);
    }

    if (filter.emotions && filter.emotions.length > 0) {
      result = result.filter((d) =>
        filter.emotions!.some((e) => d.emotions.includes(e))
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      result = result.filter((d) =>
        filter.tags!.some((t) => d.tags.includes(t))
      );
    }

    if (filter.nightmareOnly) {
      result = result.filter((d) => d.isNightmare);
    }

    if (filter.recurringOnly) {
      result = result.filter((d) => d.isRecurring);
    }

    switch (filter.sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "lucidity":
        result.sort((a, b) => b.lucidityLevel - a.lucidityLevel);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return result;
  };

  const getInsights = (): DreamInsights => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dreamsThisWeek = dreams.filter(
      (d) => new Date(d.date) >= oneWeekAgo
    ).length;
    const dreamsThisMonth = dreams.filter(
      (d) => new Date(d.date) >= oneMonthAgo
    ).length;

    const avgLucidity =
      dreams.length > 0
        ? dreams.reduce((sum, d) => sum + d.lucidityLevel, 0) / dreams.length
        : 0;
    const avgClarity =
      dreams.length > 0
        ? dreams.reduce((sum, d) => sum + d.clarityLevel, 0) / dreams.length
        : 0;

    const emotionCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    const signCounts: Record<string, number> = {};

    dreams.forEach((d) => {
      d.emotions.forEach((e) => {
        emotionCounts[e] = (emotionCounts[e] || 0) + 1;
      });
      d.tags.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
      d.dreamSigns.forEach((s) => {
        signCounts[s] = (signCounts[s] || 0) + 1;
      });
    });

    const topEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topDreamSigns = Object.entries(signCounts)
      .map(([sign, count]) => ({ sign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const sortedByDate = [...dreams].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    const dateSet = new Set(
      dreams.map((d) => new Date(d.date).toDateString())
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);

    while (dateSet.has(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const allDates = Array.from(dateSet).sort();
    tempStreak = 0;
    prevDate = null;

    allDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.round(
          (date.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000)
        );
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = date;
    });
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    const lucidityTrend: { date: string; value: number }[] = [];
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    last7Days.forEach((date) => {
      const dayDreams = dreams.filter((d) => d.date.startsWith(date));
      const avg =
        dayDreams.length > 0
          ? dayDreams.reduce((sum, d) => sum + d.lucidityLevel, 0) /
            dayDreams.length
          : 0;
      lucidityTrend.push({ date, value: avg });
    });

    const weeklyDreamCounts: { week: string; count: number }[] = [];
    const last4Weeks = [...Array(4)].map((_, i) => {
      const start = new Date();
      start.setDate(start.getDate() - (3 - i) * 7 - start.getDay());
      return start;
    });

    last4Weeks.forEach((weekStart, i) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      const count = dreams.filter((d) => {
        const date = new Date(d.date);
        return date >= weekStart && date < weekEnd;
      }).length;
      weeklyDreamCounts.push({ week: `Week ${i + 1}`, count });
    });

    return {
      totalDreams: dreams.length,
      currentStreak,
      longestStreak,
      dreamsThisWeek,
      dreamsThisMonth,
      averageLucidity: avgLucidity,
      averageClarity: avgClarity,
      topEmotions,
      topTags,
      topDreamSigns,
      lucidityTrend,
      weeklyDreamCounts,
    };
  };

  const getCalendarDays = (year: number, month: number): CalendarDay[] => {
    const result: CalendarDay[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayDreams = dreams.filter((d) => d.date.startsWith(date));
      const avgLucidity =
        dayDreams.length > 0
          ? dayDreams.reduce((sum, d) => sum + d.lucidityLevel, 0) /
            dayDreams.length
          : 0;

      result.push({
        date,
        dreamCount: dayDreams.length,
        avgLucidity,
      });
    }

    return result;
  };

  const loadSampleData = async () => {
    const sampleDreams: Dream[] = [
      {
        id: uuidv4(),
        title: "Flying Over Mountains",
        content:
          "I was soaring high above snow-capped mountains, feeling the wind rush past me. The air was crisp and clear, and I could see for miles in every direction. I realized I was dreaming and tried to maintain awareness, but the excitement woke me up.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lucidityLevel: 4,
        clarityLevel: 5,
        emotions: ["awe", "joy"],
        tags: ["flying", "mountains", "nature"],
        dreamSigns: ["flying ability"],
        people: [],
        places: ["mountains"],
        themes: ["freedom", "adventure"],
        rating: 5,
        isNightmare: false,
        isRecurring: false,
        isPrivate: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "The Endless Library",
        content:
          "Found myself in an enormous library with books stretching into infinity. Each book contained stories of lives never lived. When I opened one, I became that person briefly.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lucidityLevel: 2,
        clarityLevel: 4,
        emotions: ["awe", "confusion"],
        tags: ["library", "books", "mystery"],
        dreamSigns: ["impossible architecture"],
        people: [],
        places: ["library"],
        themes: ["knowledge", "identity"],
        rating: 4,
        isNightmare: false,
        isRecurring: false,
        isPrivate: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Chased Through Dark Forest",
        content:
          "Something was following me through a dark forest. I couldn't see what it was, but I knew I had to keep running. The trees seemed to reach out and grab at me.",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lucidityLevel: 1,
        clarityLevel: 3,
        emotions: ["fear"],
        tags: ["chase", "forest", "dark"],
        dreamSigns: ["being chased"],
        people: [],
        places: ["forest"],
        themes: ["escape", "fear"],
        rating: 2,
        isNightmare: true,
        isRecurring: true,
        isPrivate: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Reunion with Old Friend",
        content:
          "Met my childhood friend Sarah at a coffee shop. We talked for hours about old memories. She looked exactly as I remembered her from high school.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lucidityLevel: 0,
        clarityLevel: 4,
        emotions: ["joy", "peace"],
        tags: ["friendship", "nostalgia"],
        dreamSigns: [],
        people: ["Sarah"],
        places: ["coffee shop"],
        themes: ["connection", "memory"],
        rating: 4,
        isNightmare: false,
        isRecurring: false,
        isPrivate: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        title: "Underwater City",
        content:
          "Discovered a beautiful city beneath the ocean. I could breathe underwater and swam through crystal streets. The buildings were made of coral and glass.",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lucidityLevel: 3,
        clarityLevel: 5,
        emotions: ["awe", "peace"],
        tags: ["underwater", "city", "exploration"],
        dreamSigns: ["breathing underwater"],
        people: [],
        places: ["ocean", "city"],
        themes: ["discovery", "wonder"],
        rating: 5,
        isNightmare: false,
        isRecurring: false,
        isPrivate: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await saveDreams(sampleDreams);
    setDreams(sampleDreams);
  };

  const clearAllData = async () => {
    await AsyncStorage.removeItem(DREAMS_STORAGE_KEY);
    setDreams([]);
  };

  const refreshDreams = async () => {
    await loadDreams();
  };

  return (
    <DreamContext.Provider
      value={{
        dreams,
        isLoading,
        error,
        addDream,
        updateDream,
        deleteDream,
        getDream,
        searchDreams,
        getInsights,
        getCalendarDays,
        loadSampleData,
        clearAllData,
        refreshDreams,
      }}
    >
      {children}
    </DreamContext.Provider>
  );
}

export function useDreams() {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error("useDreams must be used within a DreamProvider");
  }
  return context;
}
