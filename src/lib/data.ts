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

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
  subject: string;
  difficulty: Difficulty;
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
  // Math - Easy
  { id: "m1", question: "What is 7 × 8?", options: ["54", "56", "58", "64"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m2", question: "What is the value of π (pi) approximately?", options: ["3.14", "2.71", "1.41", "1.73"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m3", question: "What is 25% of 200?", options: ["25", "50", "75", "100"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
  // Math - Medium
  { id: "m4", question: "What is the square root of 144?", options: ["10", "11", "12", "14"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m5", question: "What is 2⁵ equal to?", options: ["16", "32", "64", "128"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m6", question: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
  // Math - Hard
  { id: "m7", question: "What is the derivative of x³?", options: ["x²", "2x²", "3x²", "3x"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m8", question: "What is log₂(64)?", options: ["4", "5", "6", "8"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m9", question: "What is the sum of interior angles of a hexagon?", options: ["540°", "620°", "720°", "900°"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },

  // Science - Easy
  { id: "s1", question: "What is the chemical symbol for water?", options: ["CO2", "H2O", "O2", "NaCl"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s2", question: "Which planet is closest to the Sun?", options: ["Venus", "Mars", "Mercury", "Earth"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s3", question: "How many bones are in the adult human body?", options: ["186", "206", "226", "256"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
  // Science - Medium
  { id: "s4", question: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s5", question: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s6", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
  // Science - Hard
  { id: "s7", question: "What is the atomic number of Gold (Au)?", options: ["47", "72", "79", "82"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s8", question: "What is the speed of light in m/s (approx)?", options: ["3×10⁶", "3×10⁸", "3×10¹⁰", "3×10¹²"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s9", question: "What is the pH of pure water at 25°C?", options: ["6", "7", "8", "9"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

  // English - Easy
  { id: "e1", question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
  { id: "e2", question: "Which is a synonym for 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
  { id: "e3", question: "What type of word is 'quickly'?", options: ["Noun", "Verb", "Adjective", "Adverb"], correctAnswer: 3, xpReward: 5, subject: "english", difficulty: "easy" },
  // English - Medium
  { id: "e4", question: "What is a metaphor?", options: ["A comparison using 'like'", "A direct comparison", "An exaggeration", "A question"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
  { id: "e5", question: "'She sells sea shells' is an example of?", options: ["Metaphor", "Simile", "Alliteration", "Irony"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
  { id: "e6", question: "What is the past tense of 'swim'?", options: ["Swimmed", "Swam", "Swum", "Swimming"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
  // English - Hard
  { id: "e7", question: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Austen", "Brontë"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
  { id: "e8", question: "What is an oxymoron?", options: ["A repeated sound", "Contradictory terms together", "A comparison", "A question as a statement"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
  { id: "e9", question: "Identify the correct sentence:", options: ["Their going home.", "They're going home.", "There going home.", "Theyre going home."], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

  // Computer Science - Easy
  { id: "c1", question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correctAnswer: 0, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c2", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c3", question: "Which of these is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correctAnswer: 2, xpReward: 5, subject: "cs", difficulty: "easy" },
  // Computer Science - Medium
  { id: "c4", question: "What is 2³ in binary?", options: ["100", "110", "1000", "1010"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c5", question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c6", question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  // Computer Science - Hard
  { id: "c7", question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c8", question: "What is a primary key in a database?", options: ["Any column", "A unique identifier", "A foreign reference", "An index"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c9", question: "What protocol does HTTPS use for encryption?", options: ["SSH", "FTP", "TLS/SSL", "SMTP"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
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
