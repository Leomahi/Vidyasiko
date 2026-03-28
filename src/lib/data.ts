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
  // ===================== MATH (20 questions) =====================
  // Easy
  { id: "m1", question: "What is 7 × 8?", options: ["54", "56", "58", "64"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m2", question: "What is the value of π (pi) approximately?", options: ["3.14", "2.71", "1.41", "1.73"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m3", question: "What is 25% of 200?", options: ["25", "50", "75", "100"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m4", question: "What is the area formula for a rectangle?", options: ["l + b", "l × b", "2(l+b)", "l²"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m5", question: "What is the perimeter of a square with side 5?", options: ["10", "15", "20", "25"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
  { id: "m6", question: "What is 15² (15 squared)?", options: ["200", "215", "225", "250"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
  // Medium
  { id: "m7", question: "What is the square root of 144?", options: ["10", "11", "12", "14"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m8", question: "What is 2⁵ equal to?", options: ["16", "32", "64", "128"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m9", question: "If x + 5 = 12, what is x?", options: ["5", "6", "7", "8"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m10", question: "The quadratic formula is x = (-b ± √(b²-4ac)) / ?", options: ["a", "2a", "4a", "2b"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m11", question: "What is the formula for the area of a circle?", options: ["2πr", "πr²", "πd", "2πr²"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m12", question: "What is the slope formula given two points?", options: ["(y₂-y₁)/(x₂-x₁)", "(x₂-x₁)/(y₂-y₁)", "y₂×x₁", "x₂+y₁"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
  { id: "m13", question: "In Euclid's algorithm, GCD(a,0) = ?", options: ["0", "1", "a", "undefined"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
  // Hard
  { id: "m14", question: "What is the derivative of x³?", options: ["x²", "2x²", "3x²", "3x"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m15", question: "What is log₂(64)?", options: ["4", "5", "6", "8"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m16", question: "What is the sum of interior angles of a hexagon?", options: ["540°", "620°", "720°", "900°"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m17", question: "What is the Big-O of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m18", question: "What is ∫ 2x dx?", options: ["x²", "x² + C", "2x² + C", "x + C"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m19", question: "The Fibonacci sequence: each term equals the sum of the previous ___?", options: ["1 term", "2 terms", "3 terms", "4 terms"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
  { id: "m20", question: "What is the distance formula between two points?", options: ["√((x₂-x₁)²+(y₂-y₁)²)", "(x₂-x₁)+(y₂-y₁)", "√(x²+y²)", "|x₂-x₁|"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },

  // ===================== SCIENCE (20 questions) =====================
  // Easy - Plants & Animals
  { id: "s1", question: "What is the process by which plants make food using sunlight?", options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s2", question: "What is the scientific name of the domestic cat?", options: ["Canis lupus", "Felis catus", "Panthera leo", "Equus caballus"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s3", question: "Which part of a plant absorbs water from the soil?", options: ["Leaf", "Stem", "Root", "Flower"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s4", question: "What is the scientific name of the domestic dog?", options: ["Felis catus", "Canis lupus familiaris", "Equus asinus", "Bos taurus"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s5", question: "Which organ in animals is responsible for pumping blood?", options: ["Lungs", "Brain", "Heart", "Liver"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
  { id: "s6", question: "What gas do plants release during photosynthesis?", options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
  // Medium - Plant & Animal Functions
  { id: "s7", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s8", question: "What is the scientific name of the mango tree?", options: ["Mangifera indica", "Azadirachta indica", "Ficus religiosa", "Tectona grandis"], correctAnswer: 0, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s9", question: "Which plant tissue transports water from roots to leaves?", options: ["Phloem", "Xylem", "Cambium", "Epidermis"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s10", question: "What is the scientific name of the tiger?", options: ["Panthera pardus", "Panthera leo", "Panthera tigris", "Felis catus"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s11", question: "Which hormone in plants is responsible for growth?", options: ["Insulin", "Auxin", "Adrenaline", "Thyroxine"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s12", question: "What is the function of the kidneys in animals?", options: ["Digestion", "Respiration", "Filtration of blood", "Pumping blood"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
  { id: "s13", question: "What is the scientific name of the neem tree?", options: ["Mangifera indica", "Azadirachta indica", "Ficus benghalensis", "Dalbergia sissoo"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
  // Hard - Scientific Names & Advanced Functions
  { id: "s14", question: "What is the scientific name of the Indian peacock?", options: ["Pavo cristatus", "Corvus splendens", "Psittacula krameri", "Columba livia"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s15", question: "Which process in plants converts CO₂ into glucose?", options: ["Calvin Cycle", "Krebs Cycle", "Glycolysis", "Electron Transport"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s16", question: "What is the scientific name of the lotus (India's national flower)?", options: ["Rosa indica", "Nelumbo nucifera", "Jasminum officinale", "Hibiscus rosa-sinensis"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s17", question: "Which organ produces bile for fat digestion in animals?", options: ["Stomach", "Pancreas", "Liver", "Small intestine"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s18", question: "What is the scientific name of the banyan tree?", options: ["Ficus religiosa", "Ficus benghalensis", "Mangifera indica", "Azadirachta indica"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s19", question: "Stomata in plants are primarily responsible for?", options: ["Absorption", "Gas exchange", "Photosynthesis", "Transport"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
  { id: "s20", question: "What is the scientific name of humans?", options: ["Homo erectus", "Homo habilis", "Homo sapiens", "Homo neanderthalensis"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },

  // ===================== ENGLISH (9 questions - unchanged) =====================
  { id: "e1", question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
  { id: "e2", question: "Which is a synonym for 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
  { id: "e3", question: "What type of word is 'quickly'?", options: ["Noun", "Verb", "Adjective", "Adverb"], correctAnswer: 3, xpReward: 5, subject: "english", difficulty: "easy" },
  { id: "e4", question: "What is a metaphor?", options: ["A comparison using 'like'", "A direct comparison", "An exaggeration", "A question"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
  { id: "e5", question: "'She sells sea shells' is an example of?", options: ["Metaphor", "Simile", "Alliteration", "Irony"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
  { id: "e6", question: "What is the past tense of 'swim'?", options: ["Swimmed", "Swam", "Swum", "Swimming"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
  { id: "e7", question: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Austen", "Brontë"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
  { id: "e8", question: "What is an oxymoron?", options: ["A repeated sound", "Contradictory terms together", "A comparison", "A question as a statement"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
  { id: "e9", question: "Identify the correct sentence:", options: ["Their going home.", "They're going home.", "There going home.", "Theyre going home."], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

  // ===================== COMPUTER SCIENCE (20 questions) =====================
  // Easy - HTML
  { id: "c1", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c2", question: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correctAnswer: 2, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c3", question: "Which HTML tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c4", question: "What does the <img> tag require to display an image?", options: ["href attribute", "src attribute", "link attribute", "url attribute"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c5", question: "Which tag is used to create an unordered list in HTML?", options: ["<ol>", "<li>", "<ul>", "<list>"], correctAnswer: 2, xpReward: 5, subject: "cs", difficulty: "easy" },
  { id: "c6", question: "What is the correct HTML tag for a line break?", options: ["<break>", "<lb>", "<br>", "<newline>"], correctAnswer: 2, xpReward: 5, subject: "cs", difficulty: "easy" },
  // Medium - CSS
  { id: "c7", question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c8", question: "Which CSS property changes the text color?", options: ["font-color", "text-color", "color", "foreground"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c9", question: "Which CSS property is used to change the background color?", options: ["bgcolor", "background-color", "color-background", "bg-color"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c10", question: "What does 'display: flex' do in CSS?", options: ["Hides the element", "Makes a flexbox container", "Floats the element", "Makes text bold"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c11", question: "Which CSS selector targets elements with class 'btn'?", options: ["#btn", ".btn", "btn", "*btn"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c12", question: "What is the CSS box model order from inside out?", options: ["Margin, Border, Padding, Content", "Content, Padding, Border, Margin", "Content, Border, Padding, Margin", "Padding, Content, Border, Margin"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  { id: "c13", question: "Which CSS unit is relative to the font-size of the element?", options: ["px", "em", "cm", "pt"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
  // Hard - JavaScript
  { id: "c14", question: "Which keyword declares a block-scoped variable in JavaScript?", options: ["var", "let", "define", "dim"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c15", question: "What does 'typeof null' return in JavaScript?", options: ["null", "undefined", "object", "boolean"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c16", question: "Which method converts a JSON string to a JS object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.toObject()", "JSON.convert()"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c17", question: "What does '===' check in JavaScript?", options: ["Value only", "Type only", "Value and type", "Reference"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c18", question: "What is a closure in JavaScript?", options: ["A loop structure", "A function with access to outer scope", "A CSS feature", "An HTML element"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c19", question: "Which array method returns a new array without modifying the original?", options: ["push()", "splice()", "map()", "pop()"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
  { id: "c20", question: "What does 'async/await' handle in JavaScript?", options: ["Styling", "Promises / asynchronous code", "HTML parsing", "Memory management"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
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
