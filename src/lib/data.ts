export interface Subject {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  icon: string;
  color: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
  subject: string;
}

export interface StudentProfile {
  name: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  rank: number;
}

export interface LeaderboardEntry {
  name: string;
  xp: number;
  level: number;
  avatar: string;
}

export const subjects: Subject[] = [
  { id: "math", name: "Mathematics", nameHi: "गणित", nameTa: "கணிதம்", icon: "📐", color: "bg-primary", progress: 65, totalLessons: 24, completedLessons: 16 },
  { id: "science", name: "Science", nameHi: "विज्ञान", nameTa: "அறிவியல்", icon: "🔬", color: "bg-secondary", progress: 42, totalLessons: 20, completedLessons: 8 },
  { id: "english", name: "English", nameHi: "अंग्रेज़ी", nameTa: "ஆங்கிலம்", icon: "📖", color: "bg-accent", progress: 80, totalLessons: 18, completedLessons: 14 },
  { id: "cs", name: "Computer Science", nameHi: "कंप्यूटर विज्ञान", nameTa: "கணினி அறிவியல்", icon: "💻", color: "bg-level", progress: 30, totalLessons: 22, completedLessons: 7 },
];

export const quizQuestions: QuizQuestion[] = [
  { id: "q1", question: "What is the value of π (pi) approximately?", options: ["3.14", "2.71", "1.41", "1.73"], correctAnswer: 0, xpReward: 10, subject: "math" },
  { id: "q2", question: "What is the chemical symbol for water?", options: ["CO2", "H2O", "O2", "NaCl"], correctAnswer: 1, xpReward: 10, subject: "science" },
  { id: "q3", question: "What is the square root of 144?", options: ["10", "11", "12", "14"], correctAnswer: 2, xpReward: 15, subject: "math" },
  { id: "q4", question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correctAnswer: 2, xpReward: 10, subject: "science" },
  { id: "q5", question: "What is 2³ equal to?", options: ["6", "8", "9", "16"], correctAnswer: 1, xpReward: 10, subject: "math" },
];

export const studentProfile: StudentProfile = {
  name: "Arjun",
  xp: 1250,
  level: 7,
  streak: 12,
  badges: ["🏆 First Quiz", "⚡ 5-Day Streak", "🎯 Perfect Score", "📚 Bookworm", "🔥 10-Day Streak"],
  rank: 3,
};

export const leaderboard: LeaderboardEntry[] = [
  { name: "Priya", xp: 1580, level: 8, avatar: "👧" },
  { name: "Rahul", xp: 1420, level: 8, avatar: "👦" },
  { name: "Arjun", xp: 1250, level: 7, avatar: "🧑" },
  { name: "Meera", xp: 1100, level: 6, avatar: "👧" },
  { name: "Vikram", xp: 980, level: 6, avatar: "👦" },
];

export type Language = "en" | "hi" | "ta";

export const translations: Record<string, Record<Language, string>> = {
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", ta: "டாஷ்போர்டு" },
  subjects: { en: "Subjects", hi: "विषय", ta: "பாடங்கள்" },
  leaderboard: { en: "Leaderboard", hi: "लीडरबोर्ड", ta: "தரவரிசை" },
  quiz: { en: "Start Quiz", hi: "क्विज़ शुरू करें", ta: "வினாடி வினா" },
  xp: { en: "XP Points", hi: "एक्सपी अंक", ta: "XP புள்ளிகள்" },
  streak: { en: "Day Streak", hi: "दिन की लकीर", ta: "நாள் தொடர்" },
  level: { en: "Level", hi: "स्तर", ta: "நிலை" },
  offline: { en: "Offline Ready", hi: "ऑफलाइन तैयार", ta: "ஆஃப்லைன் தயார்" },
  teacher: { en: "Teacher View", hi: "शिक्षक दृश्य", ta: "ஆசிரியர் காட்சி" },
  badges: { en: "Badges", hi: "बैज", ta: "பதக்கங்கள்" },
  progress: { en: "Progress", hi: "प्रगति", ta: "முன்னேற்றம்" },
  lessons: { en: "lessons completed", hi: "पाठ पूरे हुए", ta: "பாடங்கள் நிறைவு" },
  rank: { en: "Rank", hi: "रैंक", ta: "தரம்" },
  correct: { en: "Correct! 🎉", hi: "सही! 🎉", ta: "சரி! 🎉" },
  wrong: { en: "Try again! 💪", hi: "फिर कोशिश करो! 💪", ta: "மீண்டும் முயற்சி! 💪" },
  next: { en: "Next Question", hi: "अगला सवाल", ta: "அடுத்த கேள்வி" },
  analytics: { en: "Analytics", hi: "विश्लेषण", ta: "பகுப்பாய்வு" },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
