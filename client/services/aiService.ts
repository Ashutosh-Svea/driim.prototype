import { Dream, AIReflection } from "@/types/dream";

const THEME_KEYWORDS: Record<string, string[]> = {
  "transformation": ["change", "morph", "transform", "become", "shift"],
  "pursuit": ["chase", "run", "escape", "follow", "hunt"],
  "connection": ["friend", "family", "love", "meet", "together"],
  "exploration": ["discover", "find", "explore", "search", "journey"],
  "power": ["fly", "control", "strength", "ability", "force"],
  "anxiety": ["fear", "worry", "stress", "panic", "nervous"],
  "freedom": ["free", "release", "open", "vast", "unlimited"],
  "mystery": ["unknown", "secret", "hidden", "strange", "curious"],
  "growth": ["learn", "grow", "develop", "improve", "progress"],
  "loss": ["lose", "lost", "gone", "missing", "disappear"],
};

const REFLECTION_QUESTIONS = [
  "What emotions did this dream evoke, and do they mirror anything in your waking life?",
  "Were there any symbols or recurring elements that stand out to you?",
  "How did you feel when you woke up from this dream?",
  "Is there a decision or situation in your life this dream might relate to?",
  "What would you tell the dream version of yourself if you could?",
  "Did any part of this dream feel particularly meaningful or significant?",
  "What aspects of this dream would you like to explore further?",
  "Were there any unresolved situations in the dream?",
  "How does this dream connect to your recent experiences?",
  "What lesson or insight might this dream be offering you?",
];

const LUCIDITY_TIPS = [
  "Practice reality checks throughout the day - look at your hands, check the time twice",
  "Keep a consistent dream journal to improve dream recall",
  "Before sleep, set an intention: 'I will recognize when I am dreaming'",
  "Look for dream signs - recurring elements that appear in your dreams",
  "Try the MILD technique: visualize becoming lucid in a recent dream",
  "Wake up 5 hours after sleep, stay awake briefly, then return to sleep with lucidity intention",
  "Question reality throughout the day: 'Am I dreaming right now?'",
  "Meditate before sleep to increase awareness",
  "Avoid screens before bed to improve dream quality",
  "Practice visualization and imagination exercises",
];

function extractThemes(content: string): string[] {
  const contentLower = content.toLowerCase();
  const themes: string[] = [];

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((keyword) => contentLower.includes(keyword))) {
      themes.push(theme);
    }
  }

  return themes.slice(0, 4);
}

function generateSummary(dream: Dream): string {
  const emotions = dream.emotions.join(", ") || "mixed emotions";
  const lucidityDesc = dream.lucidityLevel >= 3 ? "lucid" : "non-lucid";
  const setting = dream.places.length > 0 ? dream.places[0] : "an undefined space";

  const summaries = [
    `This ${lucidityDesc} dream took place in ${setting} and featured themes of ${emotions}. ${dream.content.length > 100 ? "The detailed narrative suggests deep subconscious processing." : ""}`,
    `A ${dream.clarityLevel >= 3 ? "vivid" : "hazy"} dream experience involving ${emotions}. The dream's imagery may reflect current life situations or inner desires.`,
    `This dream appears to process ${emotions} through symbolic imagery. ${dream.isRecurring ? "Its recurring nature suggests an unresolved theme in your life." : ""}`,
  ];

  return summaries[Math.floor(Math.random() * summaries.length)];
}

function selectRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export async function getAIReflection(dream: Dream): Promise<AIReflection> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const themes = extractThemes(dream.content);
  const additionalThemes = dream.themes.filter((t) => !themes.includes(t));
  const allThemes = [...themes, ...additionalThemes].slice(0, 5);

  const questions = selectRandomItems(REFLECTION_QUESTIONS, 5);

  const tips = dream.lucidityLevel < 3 
    ? selectRandomItems(LUCIDITY_TIPS, 3) 
    : [];

  const contentWords = dream.content.toLowerCase().split(/\s+/);
  const potentialSigns = contentWords
    .filter((word) => word.length > 5)
    .filter((_, i, arr) => arr.indexOf(arr[i]) === i)
    .slice(0, 3);

  const dreamSignsDetected = [
    ...dream.dreamSigns,
    ...potentialSigns.filter((s) => !dream.dreamSigns.includes(s)),
  ].slice(0, 5);

  return {
    summary: generateSummary(dream),
    possibleThemes: allThemes.length > 0 ? allThemes : ["self-reflection", "subconscious processing"],
    questionsForReflection: questions,
    dreamSignsDetected,
    lucidityTrainingTips: tips,
  };
}
