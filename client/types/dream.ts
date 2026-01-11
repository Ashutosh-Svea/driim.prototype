export interface Dream {
  id: string;
  title: string;
  content: string;
  date: string;
  sleepStart?: string;
  wakeTime?: string;
  lucidityLevel: number;
  clarityLevel: number;
  emotions: string[];
  tags: string[];
  dreamSigns: string[];
  people: string[];
  places: string[];
  themes: string[];
  rating: number;
  isNightmare: boolean;
  isRecurring: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DreamInput {
  title: string;
  content: string;
  date?: string;
  sleepStart?: string;
  wakeTime?: string;
  lucidityLevel?: number;
  clarityLevel?: number;
  emotions?: string[];
  tags?: string[];
  dreamSigns?: string[];
  people?: string[];
  places?: string[];
  themes?: string[];
  rating?: number;
  isNightmare?: boolean;
  isRecurring?: boolean;
  isPrivate?: boolean;
}

export interface DreamFilter {
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  minLucidity?: number;
  maxLucidity?: number;
  emotions?: string[];
  tags?: string[];
  nightmareOnly?: boolean;
  recurringOnly?: boolean;
  sortBy?: "newest" | "oldest" | "lucidity" | "rating";
}

export interface DreamInsights {
  totalDreams: number;
  currentStreak: number;
  longestStreak: number;
  dreamsThisWeek: number;
  dreamsThisMonth: number;
  averageLucidity: number;
  averageClarity: number;
  topEmotions: { emotion: string; count: number }[];
  topTags: { tag: string; count: number }[];
  topDreamSigns: { sign: string; count: number }[];
  lucidityTrend: { date: string; value: number }[];
  weeklyDreamCounts: { week: string; count: number }[];
}

export interface CalendarDay {
  date: string;
  dreamCount: number;
  avgLucidity: number;
}

export interface AIReflection {
  summary: string;
  possibleThemes: string[];
  questionsForReflection: string[];
  dreamSignsDetected: string[];
  lucidityTrainingTips: string[];
}

export type DreamSyncChangeType = "upsert" | "delete";

export interface DreamSyncChange {
  id: string;
  type: DreamSyncChangeType;
  updatedAt: string;
  dream?: Dream;
}

export interface DreamSyncPayload {
  deviceId: string;
  lastSyncedAt?: string | null;
  changes: DreamSyncChange[];
}

export const EMOTION_OPTIONS = [
  { id: "joy", label: "Joy", color: "#FFD93D" },
  { id: "fear", label: "Fear", color: "#8B5CF6" },
  { id: "awe", label: "Awe", color: "#60A5FA" },
  { id: "grief", label: "Grief", color: "#6B7280" },
  { id: "peace", label: "Peace", color: "#34D399" },
  { id: "desire", label: "Desire", color: "#F472B6" },
  { id: "anger", label: "Anger", color: "#EF4444" },
  { id: "confusion", label: "Confusion", color: "#A78BFA" },
];

export const TEMPLATE_OPTIONS = [
  { id: "short", label: "Short", description: "Quick capture" },
  { id: "detailed", label: "Detailed", description: "Full journal entry" },
  { id: "lucid", label: "Lucid Practice", description: "For lucid dreamers" },
];
