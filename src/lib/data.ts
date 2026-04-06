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

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
}

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

export interface ScrambleWord {
  word: string;
  hint: string;
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

export type Grade = 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface GradeContent {
  subjects: Subject[];
  quizQuestions: QuizQuestion[];
  flashcards: Flashcard[];
  matchPairs: MatchPair[];
  scrambleWords: ScrambleWord[];
}

// ========================= GRADE 6 =========================
const grade6: GradeContent = {
  subjects: [
    { id: "math", name: "Basic Mathematics", nameHi: "बुनियादी गणित", nameTa: "அடிப்படை கணிதம்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "science", name: "General Science", nameHi: "सामान्य विज्ञान", nameTa: "பொது அறிவியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "english", name: "English Grammar", nameHi: "अंग्रेज़ी व्याकरण", nameTa: "ஆங்கில இலக்கணம்", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 18, completedLessons: 0 },
    { id: "cs", name: "Computer Basics", nameHi: "कंप्यूटर बुनियादी", nameTa: "கணினி அடிப்படை", icon: "💻", color: "bg-level", progress: 0, totalLessons: 18, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH - Grade 6
    { id: "g6m1", question: "What is 12 + 28?", options: ["38", "40", "42", "36"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g6m2", question: "What is 9 × 7?", options: ["56", "63", "72", "54"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g6m3", question: "What is the place value of 5 in 350?", options: ["5", "50", "500", "5000"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g6m4", question: "Which is the smallest prime number?", options: ["0", "1", "2", "3"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g6m5", question: "What is ½ of 48?", options: ["20", "22", "24", "26"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g6m6", question: "What is the perimeter of a rectangle with length 5 and width 3?", options: ["8", "15", "16", "30"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m7", question: "What is the LCM of 4 and 6?", options: ["6", "8", "12", "24"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m8", question: "Convert 0.25 to a fraction:", options: ["1/2", "1/3", "1/4", "1/5"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m9", question: "What is the HCF of 12 and 18?", options: ["2", "3", "6", "9"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m10", question: "What is 15% of 200?", options: ["15", "20", "25", "30"], correctAnswer: 3, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m11", question: "What is the sum of angles in a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m12", question: "What is -5 + 8?", options: ["3", "-3", "13", "-13"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m13", question: "A ratio of 3:5 means for every 3 there are how many of the other?", options: ["3", "5", "8", "15"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m14", question: "What is the area of a rectangle with length 8cm and width 5cm?", options: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g6m15", question: "If x + 7 = 15, what is x?", options: ["6", "7", "8", "9"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g6m16", question: "What is 3/4 + 1/4?", options: ["1/2", "1", "4/4", "Both B and C"], correctAnswer: 3, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g6m17", question: "The number of faces in a cube is:", options: ["4", "6", "8", "12"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g6m18", question: "What is the median of 3, 7, 9, 11, 15?", options: ["7", "9", "11", "10"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g6m19", question: "What is (-3) × (-4)?", options: ["-12", "-7", "7", "12"], correctAnswer: 3, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g6m20", question: "A train travels 120 km in 2 hours. What is its speed?", options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE - Grade 6
    { id: "g6s1", question: "What do plants need for photosynthesis?", options: ["Water only", "Sunlight only", "Sunlight, water, and CO₂", "Soil only"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g6s2", question: "Which part of a plant makes food?", options: ["Root", "Stem", "Leaf", "Flower"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g6s3", question: "What is the basic unit of all living things?", options: ["Atom", "Cell", "Tissue", "Organ"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g6s4", question: "Which material is magnetic?", options: ["Wood", "Plastic", "Iron", "Glass"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g6s5", question: "Water boils at what temperature?", options: ["50°C", "75°C", "100°C", "150°C"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g6s6", question: "Which of these is a herbivore?", options: ["Lion", "Cow", "Eagle", "Shark"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g6s7", question: "What type of change is burning paper?", options: ["Physical", "Chemical", "Temporary", "Reversible"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s8", question: "What is the function of roots in a plant?", options: ["Photosynthesis", "Absorb water & minerals", "Make flowers", "Release oxygen"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s9", question: "Which organ pumps blood in our body?", options: ["Brain", "Liver", "Heart", "Lungs"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s10", question: "What is the chemical formula of water?", options: ["CO₂", "H₂O", "NaCl", "O₂"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s11", question: "Which gas do we breathe out?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s12", question: "Wool comes from which animal?", options: ["Cow", "Sheep", "Horse", "Dog"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s13", question: "Which is a conductor of electricity?", options: ["Rubber", "Wood", "Copper", "Plastic"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s14", question: "What are the three states of matter?", options: ["Hot, cold, warm", "Solid, liquid, gas", "Hard, soft, medium", "Light, dark, grey"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g6s15", question: "What is the process of water turning into vapor called?", options: ["Condensation", "Evaporation", "Precipitation", "Freezing"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g6s16", question: "Which planet is closest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g6s17", question: "What is the main component of air?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g6s18", question: "Which vitamin is produced by sunlight on skin?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], correctAnswer: 3, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g6s19", question: "How many bones does an adult human body have?", options: ["106", "206", "306", "406"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g6s20", question: "What type of lens is used in a magnifying glass?", options: ["Concave", "Convex", "Flat", "Cylindrical"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH - Grade 6
    { id: "g6e1", question: "What is a noun?", options: ["An action word", "A describing word", "A naming word", "A joining word"], correctAnswer: 2, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e2", question: "What is the plural of 'child'?", options: ["Childs", "Children", "Childes", "Childern"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e3", question: "Which is a synonym for 'happy'?", options: ["Sad", "Joyful", "Angry", "Tired"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e4", question: "What type of word is 'quickly'?", options: ["Noun", "Verb", "Adjective", "Adverb"], correctAnswer: 3, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e5", question: "Which sentence is correct?", options: ["He don't know.", "He doesn't know.", "He not know.", "He do not knows."], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e6", question: "What is the opposite of 'big'?", options: ["Large", "Huge", "Small", "Tall"], correctAnswer: 2, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e7", question: "Which is the correct spelling?", options: ["Beautful", "Beautiful", "Beutiful", "Beatiful"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g6e8", question: "What is a verb?", options: ["A naming word", "An action word", "A describing word", "A place"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e9", question: "Which is a common noun?", options: ["India", "Ganga", "city", "Taj Mahal"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e10", question: "What is the past tense of 'go'?", options: ["Goed", "Gone", "Went", "Going"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e11", question: "Which punctuation ends a question?", options: ["Period (.)", "Comma (,)", "Question mark (?)", "Exclamation (!)"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e12", question: "'He, she, it, they' are examples of?", options: ["Nouns", "Pronouns", "Adjectives", "Verbs"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e13", question: "What is the opposite of 'generous'?", options: ["Kind", "Selfish", "Brave", "Gentle"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e14", question: "An adjective describes a ___.", options: ["Verb", "Noun", "Adverb", "Preposition"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g6e15", question: "What is a simile?", options: ["A direct comparison", "A comparison using 'like' or 'as'", "An exaggeration", "Giving human traits to objects"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g6e16", question: "Which sentence has correct subject-verb agreement?", options: ["The dogs runs fast.", "The dog run fast.", "The dogs run fast.", "The dog are running."], correctAnswer: 2, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g6e17", question: "What is a compound word?", options: ["A word with a prefix", "Two words joined together", "A word with a suffix", "A plural word"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g6e18", question: "Which is a conjunction?", options: ["Quickly", "Beautiful", "And", "Jump"], correctAnswer: 2, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g6e19", question: "What is the prefix in 'unhappy'?", options: ["un", "hap", "happy", "py"], correctAnswer: 0, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g6e20", question: "'The wind whispered' is an example of?", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correctAnswer: 2, xpReward: 20, subject: "english", difficulty: "hard" },

    // COMPUTER SCIENCE - Grade 6
    { id: "g6c1", question: "What is a computer?", options: ["A TV", "An electronic machine that processes data", "A calculator only", "A phone"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g6c2", question: "Which is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correctAnswer: 2, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g6c3", question: "What does CPU stand for?", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correctAnswer: 0, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g6c4", question: "Which is an output device?", options: ["Mouse", "Keyboard", "Scanner", "Monitor"], correctAnswer: 3, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g6c5", question: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Run Application Memory", "Read All Memory"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g6c6", question: "Which stores data permanently?", options: ["RAM", "Hard Disk", "Monitor", "Keyboard"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g6c7", question: "What is software?", options: ["Physical parts of computer", "Instructions that run on a computer", "A type of cable", "A printer"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c8", question: "Which is an operating system?", options: ["MS Word", "Google Chrome", "Windows", "Photoshop"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c9", question: "What is the brain of the computer?", options: ["Monitor", "CPU", "Keyboard", "RAM"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c10", question: "What is the full form of USB?", options: ["Universal Serial Bus", "United System Bus", "Ultra Speed Buffer", "Universal System Buffer"], correctAnswer: 0, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c11", question: "Which key is used to delete text to the left of cursor?", options: ["Delete", "Backspace", "Enter", "Tab"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c12", question: "Internet stands for?", options: ["Internal Network", "Interconnected Network", "Interactive Network", "International Network"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c13", question: "What is a file?", options: ["A physical folder", "A collection of data stored on a computer", "A type of wire", "A program only"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g6c14", question: "What is the shortcut to copy text?", options: ["Ctrl+V", "Ctrl+X", "Ctrl+C", "Ctrl+Z"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g6c15", question: "What does URL stand for?", options: ["Universal Resource Locator", "Uniform Resource Locator", "United Resource Link", "Universal Reference Locator"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g6c16", question: "Which language does a computer understand directly?", options: ["English", "Python", "Machine language (binary)", "Hindi"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g6c17", question: "What is a virus in computing?", options: ["A biological virus", "A harmful software program", "A useful program", "A type of hardware"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g6c18", question: "What is binary code made of?", options: ["Letters A-Z", "Numbers 0-9", "Only 0 and 1", "Symbols"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g6c19", question: "What is a folder used for?", options: ["To run programs", "To organize files", "To connect to internet", "To print documents"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g6c20", question: "What is an email?", options: ["Electronic mail", "Emergency mail", "Extended mail", "Extra mail"], correctAnswer: 0, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g6f1", front: "What is a fraction?", back: "A part of a whole, written as numerator/denominator (e.g., 3/4).", subject: "math" },
    { id: "g6f2", front: "What is photosynthesis?", back: "The process by which plants make food using sunlight, water, and CO₂.", subject: "science" },
    { id: "g6f3", front: "What is a noun?", back: "A word that names a person, place, thing, or idea.", subject: "english" },
    { id: "g6f4", front: "What is an input device?", back: "A device used to enter data into a computer (e.g., keyboard, mouse).", subject: "cs" },
    { id: "g6f5", front: "What is a prime number?", back: "A number greater than 1 that has only two factors: 1 and itself.", subject: "math" },
    { id: "g6f6", front: "What are the three states of matter?", back: "Solid, liquid, and gas.", subject: "science" },
    { id: "g6f7", front: "What is a pronoun?", back: "A word used in place of a noun (e.g., he, she, it, they).", subject: "english" },
    { id: "g6f8", front: "What is RAM?", back: "Random Access Memory — temporary memory the computer uses while running programs.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g6p1", term: "Noun", definition: "Naming word" },
    { id: "g6p2", term: "Verb", definition: "Action word" },
    { id: "g6p3", term: "CPU", definition: "Brain of computer" },
    { id: "g6p4", term: "Leaf", definition: "Makes food for plant" },
    { id: "g6p5", term: "H₂O", definition: "Water" },
    { id: "g6p6", term: "Triangle", definition: "3-sided shape" },
  ],
  scrambleWords: [
    { word: "FRACTION", hint: "A part of a whole number", subject: "math" },
    { word: "KEYBOARD", hint: "Computer input device with keys", subject: "cs" },
    { word: "PRONOUN", hint: "Replaces a noun in a sentence", subject: "english" },
    { word: "OXYGEN", hint: "Gas we breathe in", subject: "science" },
    { word: "DECIMAL", hint: "Number with a dot", subject: "math" },
    { word: "MONITOR", hint: "Computer screen", subject: "cs" },
    { word: "PLURAL", hint: "More than one", subject: "english" },
    { word: "MAGNET", hint: "Attracts iron objects", subject: "science" },
  ],
};

// ========================= GRADE 7 =========================
const grade7: GradeContent = {
  subjects: [
    { id: "math", name: "Pre-Algebra", nameHi: "पूर्व-बीजगणित", nameTa: "முன்-இயற்கணிதம்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "science", name: "Life Science", nameHi: "जीव विज्ञान", nameTa: "உயிர் அறிவியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "english", name: "English Language", nameHi: "अंग्रेज़ी भाषा", nameTa: "ஆங்கில மொழி", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 18, completedLessons: 0 },
    { id: "cs", name: "Digital Literacy", nameHi: "डिजिटल साक्षरता", nameTa: "டிஜிட்டல் கல்வி", icon: "💻", color: "bg-level", progress: 0, totalLessons: 18, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH - Grade 7
    { id: "g7m1", question: "What is the value of 2³?", options: ["6", "8", "9", "12"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g7m2", question: "What is -3 + (-5)?", options: ["-8", "8", "-2", "2"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g7m3", question: "What is 3/5 as a percentage?", options: ["30%", "50%", "60%", "75%"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g7m4", question: "What is the area formula for a triangle?", options: ["l × b", "½ × b × h", "π r²", "s²"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g7m5", question: "Simplify: 4x + 3x", options: ["7x", "12x", "7x²", "x⁷"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g7m6", question: "What is the value of |−7|?", options: ["-7", "0", "7", "14"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m7", question: "If 2x = 14, what is x?", options: ["5", "6", "7", "8"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m8", question: "What is the circumference formula of a circle?", options: ["πr²", "2πr", "πd²", "r²"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m9", question: "What type of angle is 90°?", options: ["Acute", "Right", "Obtuse", "Straight"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m10", question: "What is the ratio 15:25 in simplest form?", options: ["1:2", "3:5", "5:3", "15:25"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m11", question: "Convert 3/8 to a decimal:", options: ["0.35", "0.375", "0.38", "0.4"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m12", question: "What is 5² + 3²?", options: ["25", "34", "64", "16"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m13", question: "What is the mode of: 2, 3, 3, 5, 7?", options: ["2", "3", "5", "4"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g7m14", question: "What is the volume of a cube with side 3 cm?", options: ["9 cm³", "18 cm³", "27 cm³", "81 cm³"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g7m15", question: "Solve: 3(x + 2) = 21", options: ["3", "5", "7", "9"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g7m16", question: "What is √49?", options: ["5", "6", "7", "8"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g7m17", question: "If a triangle has sides 3, 4, 5, is it a right triangle?", options: ["Yes", "No", "Maybe", "Not enough info"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g7m18", question: "What is the probability of getting heads in a fair coin toss?", options: ["1/4", "1/3", "1/2", "1"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g7m19", question: "What is the supplement of a 70° angle?", options: ["20°", "90°", "110°", "290°"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g7m20", question: "Simplify: (2x)(3x)", options: ["5x", "6x", "5x²", "6x²"], correctAnswer: 3, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE - Grade 7
    { id: "g7s1", question: "What is the smallest unit of an element?", options: ["Molecule", "Cell", "Atom", "Ion"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g7s2", question: "What is the main organ of the circulatory system?", options: ["Lungs", "Brain", "Heart", "Stomach"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g7s3", question: "What type of animal is a frog?", options: ["Reptile", "Mammal", "Amphibian", "Fish"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g7s4", question: "What causes day and night?", options: ["Moon's rotation", "Earth's rotation", "Sun's movement", "Earth's revolution"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g7s5", question: "Which gas is most abundant in Earth's atmosphere?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g7s6", question: "What is the function of white blood cells?", options: ["Carry oxygen", "Fight infections", "Clot blood", "Digest food"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s7", question: "What is the process of cell division called?", options: ["Osmosis", "Mitosis", "Photosynthesis", "Diffusion"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s8", question: "Which layer of the Earth is the thickest?", options: ["Crust", "Mantle", "Outer core", "Inner core"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s9", question: "What is speed measured in?", options: ["kg", "m/s", "Joules", "Watts"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s10", question: "Which organ filters blood and removes waste?", options: ["Heart", "Liver", "Kidney", "Lungs"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s11", question: "What is the pH of pure water?", options: ["0", "5", "7", "14"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s12", question: "What is an ecosystem?", options: ["A single organism", "A community of living things and their environment", "Only plants", "Only animals"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s13", question: "What is Newton's first law about?", options: ["Gravity", "Inertia", "Action-reaction", "Energy"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g7s14", question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g7s15", question: "Which tissue transports water in plants?", options: ["Phloem", "Xylem", "Cambium", "Epidermis"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g7s16", question: "What is the chemical symbol for Iron?", options: ["Ir", "In", "Fe", "I"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g7s17", question: "What is the SI unit of force?", options: ["Joule", "Watt", "Newton", "Pascal"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g7s18", question: "What is the difference between a mixture and compound?", options: ["No difference", "Mixtures can be separated physically", "Compounds can be separated physically", "Mixtures have fixed ratios"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g7s19", question: "What type of rock is formed from lava?", options: ["Sedimentary", "Metamorphic", "Igneous", "Mineral"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g7s20", question: "What is the function of the large intestine?", options: ["Digest proteins", "Absorb water", "Produce bile", "Pump blood"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH - Grade 7
    { id: "g7e1", question: "What is an antonym?", options: ["Same meaning word", "Opposite meaning word", "Similar sound word", "Plural word"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g7e2", question: "Which is a proper noun?", options: ["city", "dog", "London", "river"], correctAnswer: 2, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g7e3", question: "What is the past tense of 'run'?", options: ["Runned", "Ran", "Running", "Runs"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g7e4", question: "Which is a preposition?", options: ["And", "But", "Under", "Quickly"], correctAnswer: 2, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g7e5", question: "What does the prefix 'un-' mean?", options: ["Again", "Not", "Before", "After"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g7e6", question: "What is an adjective?", options: ["A word that names", "A word that describes a noun", "A word that joins", "A word that replaces"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e7", question: "Which is the correct form: 'She ___ to school daily'?", options: ["go", "goes", "going", "gone"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e8", question: "'As brave as a lion' is an example of?", options: ["Metaphor", "Simile", "Personification", "Hyperbole"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e9", question: "What is the superlative form of 'good'?", options: ["Gooder", "Better", "Best", "Most good"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e10", question: "What is a paragraph?", options: ["A single sentence", "A group of related sentences", "A title", "A punctuation mark"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e11", question: "Which tense: 'She will sing tomorrow'?", options: ["Past", "Present", "Future", "Past perfect"], correctAnswer: 2, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e12", question: "What is a synonym for 'beautiful'?", options: ["Ugly", "Pretty", "Dark", "Sad"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e13", question: "What is a homophone?", options: ["Same spelling, different meaning", "Same sound, different spelling", "Same meaning, different sound", "Opposite meaning"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g7e14", question: "'She sells sea shells' is an example of?", options: ["Metaphor", "Simile", "Alliteration", "Irony"], correctAnswer: 2, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g7e15", question: "What is a metaphor?", options: ["Comparison using 'like'", "A direct comparison", "An exaggeration", "A question"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g7e16", question: "Identify the correct sentence:", options: ["Their going home.", "They're going home.", "There going home.", "Theyre going home."], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g7e17", question: "What type of sentence is: 'What a beautiful day!'?", options: ["Declarative", "Interrogative", "Exclamatory", "Imperative"], correctAnswer: 2, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g7e18", question: "What is the active voice of: 'The cake was eaten by her'?", options: ["Her ate the cake", "She ate the cake", "The cake ate her", "She was eating cake"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g7e19", question: "What is an autobiography?", options: ["A story about animals", "A story of one's own life", "A fictional story", "A poem"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g7e20", question: "What does 'irony' mean in literature?", options: ["A funny joke", "The opposite of what is expected", "A sad ending", "A long story"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

    // CS - Grade 7
    { id: "g7c1", question: "What is the internet?", options: ["A single computer", "A global network of computers", "A software program", "A type of cable"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g7c2", question: "What does WWW stand for?", options: ["Wide Web World", "World Wide Web", "Web World Wide", "World Web Wide"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g7c3", question: "Which is a web browser?", options: ["Windows", "Google Chrome", "MS Word", "Paint"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g7c4", question: "What is a search engine?", options: ["A car part", "A tool to find information online", "A type of computer", "An email service"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g7c5", question: "What does 'download' mean?", options: ["Upload a file", "Transfer data from internet to your device", "Delete a file", "Print a document"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g7c6", question: "What is a spreadsheet used for?", options: ["Drawing pictures", "Organizing data in rows and columns", "Writing essays", "Playing games"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c7", question: "What is a presentation software?", options: ["MS Excel", "MS PowerPoint", "MS Word", "MS Paint"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c8", question: "What is cyberbullying?", options: ["A computer game", "Using technology to harass someone", "A software bug", "A type of virus"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c9", question: "What does 'password protection' mean?", options: ["Removing passwords", "Securing access with a secret code", "Sharing passwords", "Deleting accounts"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c10", question: "What is cloud storage?", options: ["Storing files in the sky", "Storing data on remote servers accessed via internet", "A type of USB drive", "Storing files locally only"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c11", question: "What is an algorithm?", options: ["A type of computer", "A step-by-step set of instructions", "A programming language", "A hardware component"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c12", question: "What is a flowchart?", options: ["A type of chart for water", "A visual representation of a process", "A music chart", "A bar graph"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c13", question: "Which file extension is for images?", options: [".doc", ".txt", ".jpg", ".exe"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g7c14", question: "What is HTML used for?", options: ["Making games", "Creating web pages", "Editing photos", "Writing essays"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g7c15", question: "What does the <p> tag in HTML represent?", options: ["Picture", "Paragraph", "Page", "Program"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g7c16", question: "What is a pixel?", options: ["A type of software", "The smallest unit of a digital image", "A programming language", "A computer part"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g7c17", question: "What is a network?", options: ["A single computer", "Connected computers sharing resources", "A type of software", "An input device"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g7c18", question: "What does 'debugging' mean?", options: ["Adding bugs", "Finding and fixing errors in code", "Deleting programs", "Installing software"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g7c19", question: "What is an IP address?", options: ["A home address", "A unique number identifying a device on a network", "An email address", "A website name"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g7c20", question: "What is the difference between hardware and software?", options: ["No difference", "Hardware is physical, software is programs", "Hardware is programs, software is physical", "Both are physical"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g7f1", front: "What is an integer?", back: "A whole number that can be positive, negative, or zero.", subject: "math" },
    { id: "g7f2", front: "What is mitosis?", back: "The process of cell division where one cell divides into two identical cells.", subject: "science" },
    { id: "g7f3", front: "What is alliteration?", back: "Repetition of the same initial sound in consecutive words (e.g., 'She sells sea shells').", subject: "english" },
    { id: "g7f4", front: "What is an algorithm?", back: "A step-by-step set of instructions to solve a problem or complete a task.", subject: "cs" },
    { id: "g7f5", front: "What is the circumference?", back: "The distance around a circle, calculated as 2πr.", subject: "math" },
    { id: "g7f6", front: "What is an ecosystem?", back: "A community of living organisms interacting with their environment.", subject: "science" },
    { id: "g7f7", front: "What is a homophone?", back: "Words that sound the same but have different meanings (e.g., their/there/they're).", subject: "english" },
    { id: "g7f8", front: "What is HTML?", back: "HyperText Markup Language — used to create the structure of web pages.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g7p1", term: "Mitosis", definition: "Cell division" },
    { id: "g7p2", term: "Simile", definition: "Comparison using like/as" },
    { id: "g7p3", term: "Integer", definition: "Whole number" },
    { id: "g7p4", term: "HTML", definition: "Web page language" },
    { id: "g7p5", term: "Nitrogen", definition: "Most abundant gas in air" },
    { id: "g7p6", term: "Pronoun", definition: "Replaces a noun" },
  ],
  scrambleWords: [
    { word: "INTEGER", hint: "A positive or negative whole number", subject: "math" },
    { word: "BROWSER", hint: "Software to access the internet", subject: "cs" },
    { word: "ADJECTIVE", hint: "A word that describes a noun", subject: "english" },
    { word: "NUCLEUS", hint: "Control center of the cell", subject: "science" },
    { word: "POLYGON", hint: "A closed shape with many sides", subject: "math" },
    { word: "NETWORK", hint: "Connected computers", subject: "cs" },
    { word: "METAPHOR", hint: "A direct comparison without like/as", subject: "english" },
    { word: "ELEMENT", hint: "A pure substance made of one type of atom", subject: "science" },
  ],
};

// ========================= GRADE 8 =========================
const grade8: GradeContent = {
  subjects: [
    { id: "math", name: "Algebra & Geometry", nameHi: "बीजगणित और ज्यामिति", nameTa: "இயற்கணிதம் & வடிவியல்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 22, completedLessons: 0 },
    { id: "science", name: "Physics & Chemistry", nameHi: "भौतिकी और रसायन", nameTa: "இயற்பியல் & வேதியியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 22, completedLessons: 0 },
    { id: "english", name: "English Literature", nameHi: "अंग्रेज़ी साहित्य", nameTa: "ஆங்கில இலக்கியம்", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "cs", name: "Introduction to Coding", nameHi: "कोडिंग का परिचय", nameTa: "குறியீட்டு அறிமுகம்", icon: "💻", color: "bg-level", progress: 0, totalLessons: 20, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH
    { id: "g8m1", question: "What is (a+b)²?", options: ["a²+b²", "a²+2ab+b²", "a²-2ab+b²", "2a²+2b²"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g8m2", question: "What is the square root of 169?", options: ["11", "12", "13", "14"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g8m3", question: "How many degrees in a straight angle?", options: ["90°", "120°", "180°", "360°"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g8m4", question: "What is 20% of 150?", options: ["20", "25", "30", "35"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g8m5", question: "What is the value of π approximately?", options: ["3.14", "2.71", "1.41", "1.73"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g8m6", question: "Solve: 3x - 7 = 14", options: ["5", "6", "7", "8"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m7", question: "What is the area of a circle with radius 7? (use π=22/7)", options: ["44 cm²", "88 cm²", "154 cm²", "308 cm²"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m8", question: "What is the cube of 5?", options: ["15", "25", "75", "125"], correctAnswer: 3, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m9", question: "The angles of a quadrilateral sum to?", options: ["180°", "270°", "360°", "540°"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m10", question: "What is the slope of a horizontal line?", options: ["0", "1", "Undefined", "∞"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m11", question: "Factorize: x² - 9", options: ["(x-3)(x-3)", "(x+3)(x-3)", "(x+9)(x-1)", "(x-1)(x+9)"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m12", question: "What is the exterior angle of a regular hexagon?", options: ["30°", "45°", "60°", "90°"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m13", question: "If the mean of 5 numbers is 20, what is their sum?", options: ["25", "50", "75", "100"], correctAnswer: 3, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g8m14", question: "What is (a-b)²?", options: ["a²-b²", "a²-2ab+b²", "a²+2ab+b²", "a²-ab+b²"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g8m15", question: "Solve: x² = 64", options: ["x = 8", "x = ±8", "x = 32", "x = ±32"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g8m16", question: "What is the Pythagorean theorem?", options: ["a+b=c", "a²+b²=c²", "a×b=c", "a²-b²=c²"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g8m17", question: "The surface area of a cube with side 4 cm is?", options: ["16 cm²", "48 cm²", "64 cm²", "96 cm²"], correctAnswer: 3, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g8m18", question: "What is the compound interest formula?", options: ["P×R×T/100", "P(1+R/100)ⁿ", "P+R+T", "P×R×n"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g8m19", question: "If a:b = 2:3 and b:c = 3:4, what is a:b:c?", options: ["2:3:4", "2:3:3", "4:6:8", "2:6:4"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g8m20", question: "What is the volume of a cylinder with r=7, h=10? (π=22/7)", options: ["440 cm³", "1540 cm³", "2200 cm³", "3080 cm³"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE
    { id: "g8s1", question: "What is an atom made of?", options: ["Cells", "Protons, neutrons, electrons", "Molecules only", "Elements only"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g8s2", question: "What is the unit of electric current?", options: ["Volt", "Watt", "Ampere", "Ohm"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g8s3", question: "Which force keeps us on the ground?", options: ["Friction", "Gravity", "Magnetism", "Tension"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g8s4", question: "What is the chemical formula of carbon dioxide?", options: ["CO", "CO₂", "C₂O", "C₂O₂"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g8s5", question: "Sound travels fastest through?", options: ["Air", "Water", "Vacuum", "Solid"], correctAnswer: 3, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g8s6", question: "What is Newton's second law? (F = ?)", options: ["m/a", "m × a", "m + a", "m - a"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s7", question: "What is an acid's pH range?", options: ["0-7", "7 only", "7-14", "14 only"], correctAnswer: 0, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s8", question: "What is the chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s9", question: "What type of mirror is used in car rear-view mirrors?", options: ["Concave", "Convex", "Flat", "Magnifying"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s10", question: "What is friction?", options: ["A type of energy", "Force opposing motion", "A chemical reaction", "A sound wave"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s11", question: "Rusting of iron is which type of change?", options: ["Physical", "Chemical", "Temporary", "Nuclear"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s12", question: "What is the unit of pressure?", options: ["Newton", "Pascal", "Joule", "Watt"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s13", question: "Which organelle is responsible for photosynthesis?", options: ["Mitochondria", "Ribosome", "Chloroplast", "Nucleus"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g8s14", question: "What is Ohm's law?", options: ["V = IR", "V = I/R", "V = I+R", "V = I-R"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g8s15", question: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g8s16", question: "What is an exothermic reaction?", options: ["Absorbs heat", "Releases heat", "No heat change", "Only in cold"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g8s17", question: "What is the speed of light approximately?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g8s18", question: "What are catalysts?", options: ["Slow down reactions", "Speed up reactions without being consumed", "React with all chemicals", "Only work in heat"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g8s19", question: "What is the law of conservation of energy?", options: ["Energy can be created", "Energy can be destroyed", "Energy cannot be created or destroyed", "Energy is unlimited"], correctAnswer: 2, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g8s20", question: "What is the valency of Oxygen?", options: ["1", "2", "3", "4"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH
    { id: "g8e1", question: "What is a narrative essay?", options: ["Opinion essay", "A story-telling essay", "A factual report", "A poem"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g8e2", question: "What is the past tense of 'swim'?", options: ["Swimmed", "Swam", "Swum", "Swimming"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g8e3", question: "What is a synonym for 'commence'?", options: ["End", "Begin", "Pause", "Continue"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g8e4", question: "Which is a collective noun?", options: ["Dog", "Flock", "Running", "Beautiful"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g8e5", question: "What is the correct spelling?", options: ["Recieve", "Receive", "Receve", "Receeve"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g8e6", question: "What is an oxymoron?", options: ["A repeated sound", "Contradictory terms together", "A comparison", "A question"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e7", question: "Who wrote 'Romeo and Juliet'?", options: ["Dickens", "Shakespeare", "Austen", "Brontë"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e8", question: "What is a clause?", options: ["A single word", "A group of words with a subject and verb", "A punctuation mark", "A type of poem"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e9", question: "What is the difference between 'its' and 'it's'?", options: ["No difference", "'its' is possessive, 'it's' is contraction", "'it's' is possessive", "Both are contractions"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e10", question: "What is a stanza in poetry?", options: ["A single word", "A group of lines", "The title", "The last line"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e11", question: "What is direct speech?", options: ["Reporting what someone said", "Quoting exact words spoken", "Writing a summary", "Using past tense"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e12", question: "What is a theme in literature?", options: ["The setting", "The central message or idea", "The characters", "The plot"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e13", question: "What does 'onomatopoeia' mean?", options: ["A type of poem", "Words that imitate sounds", "A figure of speech", "A type of essay"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g8e14", question: "Who wrote 'Pride and Prejudice'?", options: ["Emily Brontë", "Jane Austen", "Virginia Woolf", "Mary Shelley"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g8e15", question: "What is a soliloquy?", options: ["A type of song", "Speaking one's thoughts aloud when alone", "A group discussion", "A poem structure"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g8e16", question: "What is the difference between 'affect' and 'effect'?", options: ["No difference", "Affect is verb, effect is noun", "Effect is verb, affect is noun", "Both are nouns"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g8e17", question: "What is a protagonist?", options: ["The villain", "The main character", "A side character", "The narrator"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g8e18", question: "What literary device is 'The wind whispered through the trees'?", options: ["Simile", "Alliteration", "Personification", "Hyperbole"], correctAnswer: 2, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g8e19", question: "What is satire?", options: ["A love story", "Using humor to criticize", "A type of poem", "A historical document"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g8e20", question: "Which is an example of irony?", options: ["A fire station burns down", "A dog barks loudly", "The sun rises east", "Rain falls in monsoon"], correctAnswer: 0, xpReward: 20, subject: "english", difficulty: "hard" },

    // CS
    { id: "g8c1", question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correctAnswer: 0, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g8c2", question: "Which HTML tag creates a heading?", options: ["<p>", "<h1>", "<div>", "<span>"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g8c3", question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Sheets"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g8c4", question: "Which HTML tag creates a link?", options: ["<link>", "<a>", "<href>", "<url>"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g8c5", question: "What is a variable in programming?", options: ["A fixed value", "A named container for data", "A function", "A loop"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g8c6", question: "What is a loop in programming?", options: ["A one-time action", "Repeating code multiple times", "A comment", "An error"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c7", question: "Which CSS property changes text color?", options: ["font-color", "text-color", "color", "foreground"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c8", question: "What is a function in programming?", options: ["A mathematical equation", "A reusable block of code", "A type of variable", "A data type"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c9", question: "What is 'display: flex' in CSS?", options: ["Hides element", "Creates a flexible layout container", "Makes text bold", "Adds a border"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c10", question: "What is a conditional statement?", options: ["A loop", "An if/else decision", "A variable", "A function call"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c11", question: "What is an array?", options: ["A single value", "A collection of values", "A function", "A loop"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c12", question: "What does '==' mean in programming?", options: ["Assignment", "Equality check", "Not equal", "Greater than"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c13", question: "Which is a valid Python variable name?", options: ["2name", "my-name", "my_name", "my name"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g8c14", question: "What is the output of: print(2 + 3 * 4)?", options: ["20", "14", "24", "12"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g8c15", question: "What does 'len()' do in Python?", options: ["Deletes items", "Returns the length/count", "Sorts items", "Adds items"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g8c16", question: "What is a Boolean?", options: ["A number type", "True or False value", "A string type", "An array type"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g8c17", question: "What does 'while True' create?", options: ["An error", "An infinite loop", "A function", "A variable"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g8c18", question: "What is a comment in code?", options: ["Executable code", "Text ignored by the computer for documentation", "A variable name", "A function"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g8c19", question: "What is indentation used for in Python?", options: ["Decoration", "Defining code blocks", "Adding comments", "Creating variables"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g8c20", question: "What is the output of: print('Hello' + ' ' + 'World')?", options: ["HelloWorld", "Hello World", "Error", "Hello+World"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g8f1", front: "What is (a+b)²?", back: "a² + 2ab + b² — a fundamental algebraic identity.", subject: "math" },
    { id: "g8f2", front: "What is Ohm's Law?", back: "V = IR — Voltage equals Current times Resistance.", subject: "science" },
    { id: "g8f3", front: "What is personification?", back: "Giving human qualities to non-human things (e.g., 'The wind whispered').", subject: "english" },
    { id: "g8f4", front: "What is a variable in programming?", back: "A named container that stores a value which can change during execution.", subject: "cs" },
    { id: "g8f5", front: "What is the Pythagorean Theorem?", back: "a² + b² = c², where c is the hypotenuse of a right triangle.", subject: "math" },
    { id: "g8f6", front: "What is Newton's 2nd Law?", back: "F = ma — Force equals mass times acceleration.", subject: "science" },
    { id: "g8f7", front: "What is an oxymoron?", back: "A figure of speech with contradictory terms (e.g., 'deafening silence').", subject: "english" },
    { id: "g8f8", front: "What is a loop?", back: "A programming construct that repeats a block of code multiple times.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g8p1", term: "V = IR", definition: "Ohm's Law" },
    { id: "g8p2", term: "(a+b)²", definition: "a²+2ab+b²" },
    { id: "g8p3", term: "CSS", definition: "Styles web pages" },
    { id: "g8p4", term: "Protagonist", definition: "Main character" },
    { id: "g8p5", term: "Au", definition: "Gold" },
    { id: "g8p6", term: "Boolean", definition: "True or False" },
  ],
  scrambleWords: [
    { word: "EQUATION", hint: "A mathematical statement with equals sign", subject: "math" },
    { word: "ELECTRON", hint: "Negatively charged particle", subject: "science" },
    { word: "METAPHOR", hint: "A direct comparison without like/as", subject: "english" },
    { word: "FUNCTION", hint: "Reusable block of code", subject: "cs" },
    { word: "CYLINDER", hint: "3D shape with circular base", subject: "math" },
    { word: "CATALYST", hint: "Speeds up chemical reactions", subject: "science" },
    { word: "SOLILOQUY", hint: "Talking to oneself in a play", subject: "english" },
    { word: "VARIABLE", hint: "Named container for data", subject: "cs" },
  ],
};

// ========================= GRADE 9 =========================
const grade9: GradeContent = {
  subjects: [
    { id: "math", name: "Advanced Algebra", nameHi: "उन्नत बीजगणित", nameTa: "மேம்பட்ட இயற்கணிதம்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 24, completedLessons: 0 },
    { id: "science", name: "Biology & Physics", nameHi: "जीवविज्ञान और भौतिकी", nameTa: "உயிரியல் & இயற்பியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 24, completedLessons: 0 },
    { id: "english", name: "English Composition", nameHi: "अंग्रेज़ी रचना", nameTa: "ஆங்கில இலக்கியம்", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "cs", name: "Python Programming", nameHi: "पायथन प्रोग्रामिंग", nameTa: "பைத்தான் நிரலாக்கம்", icon: "💻", color: "bg-level", progress: 0, totalLessons: 22, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH
    { id: "g9m1", question: "What is the quadratic formula?", options: ["x = -b/2a", "x = (-b ± √(b²-4ac))/2a", "x = b²-4ac", "x = a+b+c"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g9m2", question: "What are rational numbers?", options: ["Only integers", "Numbers expressible as p/q where q≠0", "Only decimals", "Only fractions"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g9m3", question: "What is √2 approximately?", options: ["1.41", "1.73", "2.23", "2.45"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g9m4", question: "What is the degree of the polynomial 3x³ + 2x - 1?", options: ["1", "2", "3", "4"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g9m5", question: "What is the formula for distance between two points?", options: ["x₂-x₁", "|y₂-y₁|", "√((x₂-x₁)²+(y₂-y₁)²)", "(x₂+y₂)-(x₁+y₁)"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g9m6", question: "Factorize: x² - 5x + 6", options: ["(x-2)(x-3)", "(x+2)(x+3)", "(x-1)(x-6)", "(x+1)(x-6)"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m7", question: "What is the sum of interior angles of a pentagon?", options: ["360°", "450°", "540°", "720°"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m8", question: "If sin θ = opposite/hypotenuse, what is cos θ?", options: ["opposite/adjacent", "adjacent/hypotenuse", "hypotenuse/adjacent", "opposite/hypotenuse"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m9", question: "What is the midpoint formula?", options: ["(x₁+x₂, y₁+y₂)", "((x₁+x₂)/2, (y₁+y₂)/2)", "(x₂-x₁, y₂-y₁)", "(x₁×x₂, y₁×y₂)"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m10", question: "What is the value of sin 30°?", options: ["0", "1/2", "√3/2", "1"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m11", question: "What is the area of an equilateral triangle with side a?", options: ["a²/2", "(√3/4)a²", "a²", "3a/2"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m12", question: "What is the HCF of 24 and 36?", options: ["6", "8", "12", "18"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m13", question: "Lines with equal slopes are?", options: ["Perpendicular", "Parallel", "Intersecting", "Coincident"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g9m14", question: "Solve: 2x² - 8 = 0", options: ["x = ±2", "x = ±4", "x = 2", "x = 4"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g9m15", question: "What is the surface area of a sphere with radius r?", options: ["2πr²", "4πr²", "πr²", "4/3πr³"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g9m16", question: "What is tan 45°?", options: ["0", "1/2", "1", "√3"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g9m17", question: "If 2ˣ = 32, what is x?", options: ["3", "4", "5", "6"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g9m18", question: "What is the volume of a sphere? (formula)", options: ["4πr²", "4/3πr³", "2πr³", "πr³"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g9m19", question: "What is the discriminant of ax²+bx+c?", options: ["b²+4ac", "b²-4ac", "4ac-b²", "a²-4bc"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g9m20", question: "In a GP, if a=2, r=3, what is the 4th term?", options: ["18", "27", "54", "81"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE
    { id: "g9s1", question: "What is the basic structural unit of the kidney?", options: ["Neuron", "Nephron", "Alveoli", "Villi"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g9s2", question: "What is acceleration?", options: ["Speed", "Rate of change of velocity", "Distance covered", "Force applied"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g9s3", question: "What carries genetic information?", options: ["Protein", "RNA only", "DNA", "Lipids"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g9s4", question: "What is the SI unit of work?", options: ["Newton", "Pascal", "Joule", "Watt"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g9s5", question: "Which blood vessels carry blood away from the heart?", options: ["Veins", "Capillaries", "Arteries", "Lymph nodes"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g9s6", question: "What is the law of conservation of mass?", options: ["Mass increases in reactions", "Mass decreases", "Mass is neither created nor destroyed", "Mass converts to energy"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s7", question: "What is the universal gravitational constant symbol?", options: ["g", "G", "F", "M"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s8", question: "What is the function of hemoglobin?", options: ["Fight infections", "Transport oxygen", "Digest food", "Filter waste"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s9", question: "What is kinetic energy formula?", options: ["mgh", "½mv²", "Fd", "mc²"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s10", question: "What are isotopes?", options: ["Same element, different neutrons", "Different elements, same mass", "Same element, different electrons", "Different elements, same protons"], correctAnswer: 0, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s11", question: "What is the function of stomata?", options: ["Absorption", "Gas exchange & transpiration", "Photosynthesis only", "Water transport"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s12", question: "What is potential energy formula?", options: ["½mv²", "mgh", "Fd", "mc²"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s13", question: "How many chromosomes do humans have?", options: ["23", "44", "46", "48"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g9s14", question: "What is the Archimedes' principle about?", options: ["Gravity", "Buoyancy", "Magnetism", "Electricity"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g9s15", question: "What is the molecular formula of glucose?", options: ["C₆H₁₂O₆", "C₂H₅OH", "CH₄", "CO₂"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g9s16", question: "What is the difference between mass and weight?", options: ["No difference", "Mass is amount of matter, weight is gravitational force", "Weight is amount of matter", "Mass changes with location"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g9s17", question: "What is the Calvin Cycle?", options: ["Light reaction", "Dark reaction of photosynthesis", "Cell division", "Protein synthesis"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g9s18", question: "What is the formula for gravitational force?", options: ["F=ma", "F=G(m₁m₂)/r²", "F=kq₁q₂/r²", "F=mv²/r"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g9s19", question: "What is the difference between mitosis and meiosis?", options: ["No difference", "Mitosis = 2 identical cells, Meiosis = 4 different cells", "Mitosis = 4 cells", "Meiosis = 2 identical cells"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g9s20", question: "What is work-energy theorem?", options: ["Work = Force", "Work done = Change in kinetic energy", "Energy = Mass", "Work = Power × Time"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH
    { id: "g9e1", question: "What is a thesis statement?", options: ["The first sentence", "The main argument of an essay", "A question", "The conclusion"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g9e2", question: "What is the difference between 'who' and 'whom'?", options: ["No difference", "Who = subject, whom = object", "Whom = subject", "Both are objects"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g9e3", question: "What is a haiku?", options: ["A long poem", "A 5-7-5 syllable poem", "A 4-line poem", "A free verse poem"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g9e4", question: "What is the plural of 'analysis'?", options: ["Analysises", "Analyses", "Analysi", "Analysis's"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g9e5", question: "What is an antagonist?", options: ["The hero", "The villain/opponent", "A narrator", "A minor character"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g9e6", question: "What is foreshadowing?", options: ["Looking back at events", "Hints about future events", "Describing the setting", "Character development"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e7", question: "What is a sonnet?", options: ["A 10-line poem", "A 14-line poem", "A 20-line poem", "A haiku"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e8", question: "What is the difference between 'whose' and 'who's'?", options: ["No difference", "Whose = possessive, who's = contraction", "Who's = possessive", "Both are possessive"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e9", question: "What is a rhetorical question?", options: ["A question needing an answer", "A question not meant to be answered", "A math question", "A science question"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e10", question: "What is an analogy?", options: ["A type of poem", "A comparison showing similarity", "An exaggeration", "A contradiction"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e11", question: "What is the purpose of a topic sentence?", options: ["To end a paragraph", "To introduce the main idea", "To give examples", "To conclude an essay"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e12", question: "What is euphemism?", options: ["A harsh expression", "A mild or indirect expression", "An exaggeration", "A sound word"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e13", question: "Who wrote 'The Merchant of Venice'?", options: ["Dickens", "Shakespeare", "Wordsworth", "Keats"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g9e14", question: "What is dramatic irony?", options: ["When the audience knows something the character doesn't", "A funny situation", "A sad ending", "An unexpected twist"], correctAnswer: 0, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g9e15", question: "What is a bildungsroman?", options: ["A horror novel", "A coming-of-age novel", "A mystery novel", "A romance novel"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g9e16", question: "What is the subjunctive mood?", options: ["Stating facts", "Expressing wishes, demands, or hypotheticals", "Asking questions", "Giving commands"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g9e17", question: "What is a paradox?", options: ["A simple statement", "A seemingly contradictory statement that reveals truth", "A question", "A comparison"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g9e18", question: "Who wrote 'To Kill a Mockingbird'?", options: ["Mark Twain", "Harper Lee", "F. Scott Fitzgerald", "Ernest Hemingway"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g9e19", question: "What is stream of consciousness?", options: ["A river", "A narrative technique showing inner thoughts", "A poem type", "A dialogue style"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g9e20", question: "What is the difference between connotation and denotation?", options: ["No difference", "Denotation = literal, connotation = implied/emotional", "Connotation = literal", "Both are literal"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

    // CS
    { id: "g9c1", question: "What is Python?", options: ["A snake", "A programming language", "A web browser", "An operating system"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g9c2", question: "How do you print in Python?", options: ["echo()", "console.log()", "print()", "printf()"], correctAnswer: 2, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g9c3", question: "What is a string in Python?", options: ["A number", "Text enclosed in quotes", "A Boolean", "An operator"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g9c4", question: "Which operator is used for exponents in Python?", options: ["^", "**", "//", "%%"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g9c5", question: "What does 'input()' do in Python?", options: ["Displays output", "Takes user input", "Creates a file", "Deletes data"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g9c6", question: "What is a list in Python?", options: ["A single value", "An ordered mutable collection", "A function", "A loop"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c7", question: "What does 'for i in range(5)' produce?", options: ["1,2,3,4,5", "0,1,2,3,4", "0,1,2,3,4,5", "1,2,3,4"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c8", question: "What is a dictionary in Python?", options: ["A list of words", "Key-value pairs", "A string type", "A number type"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c9", question: "What is the output of: 10 // 3?", options: ["3.33", "3", "4", "1"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c10", question: "What is a tuple?", options: ["A mutable list", "An immutable ordered collection", "A dictionary", "A set"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c11", question: "How do you define a function in Python?", options: ["function()", "func()", "def()", "def function_name():"], correctAnswer: 3, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c12", question: "What does 'append()' do to a list?", options: ["Removes item", "Adds item to the end", "Sorts the list", "Reverses the list"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c13", question: "What is 'elif' in Python?", options: ["Else if", "End loop", "Exit", "Error"], correctAnswer: 0, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g9c14", question: "What is recursion?", options: ["A loop type", "A function calling itself", "A variable type", "An error"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g9c15", question: "What is a class in OOP?", options: ["A school class", "A blueprint for creating objects", "A function", "A variable"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g9c16", question: "What does 'try/except' handle?", options: ["Loops", "Errors/exceptions", "Functions", "Variables"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g9c17", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g9c18", question: "What is a module in Python?", options: ["A hardware part", "A file containing Python code", "A data type", "A loop"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g9c19", question: "What is 'self' in Python classes?", options: ["A keyword", "Reference to the current instance", "A data type", "A module"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g9c20", question: "What is the difference between '==' and 'is'?", options: ["No difference", "'==' checks value, 'is' checks identity", "'is' checks value", "Both check identity"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g9f1", front: "What is the quadratic formula?", back: "x = (-b ± √(b²-4ac)) / 2a, used to solve ax²+bx+c=0.", subject: "math" },
    { id: "g9f2", front: "What is kinetic energy?", back: "Energy of motion: KE = ½mv².", subject: "science" },
    { id: "g9f3", front: "What is foreshadowing?", back: "A literary technique where hints are given about future events in a story.", subject: "english" },
    { id: "g9f4", front: "What is recursion?", back: "A programming technique where a function calls itself to solve smaller subproblems.", subject: "cs" },
    { id: "g9f5", front: "What are trigonometric ratios?", back: "sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj.", subject: "math" },
    { id: "g9f6", front: "What is DNA?", back: "Deoxyribonucleic acid — carries genetic information in living organisms.", subject: "science" },
    { id: "g9f7", front: "What is a sonnet?", back: "A 14-line poem with a specific rhyme scheme, often about love.", subject: "english" },
    { id: "g9f8", front: "What is a Python dictionary?", back: "A collection of key-value pairs: {'name': 'John', 'age': 15}.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g9p1", term: "KE = ½mv²", definition: "Kinetic energy" },
    { id: "g9p2", term: "Sonnet", definition: "14-line poem" },
    { id: "g9p3", term: "sin θ", definition: "Opposite/Hypotenuse" },
    { id: "g9p4", term: "def", definition: "Python function keyword" },
    { id: "g9p5", term: "DNA", definition: "Genetic blueprint" },
    { id: "g9p6", term: "Paradox", definition: "Contradictory truth" },
  ],
  scrambleWords: [
    { word: "QUADRATIC", hint: "Type of equation with x²", subject: "math" },
    { word: "CHROMOSOME", hint: "Carries genetic information", subject: "science" },
    { word: "FORESHADOW", hint: "Hint at future events in a story", subject: "english" },
    { word: "RECURSION", hint: "Function calling itself", subject: "cs" },
    { word: "POLYNOMIAL", hint: "Expression with multiple terms", subject: "math" },
    { word: "NEPHRON", hint: "Functional unit of kidney", subject: "science" },
    { word: "EUPHEMISM", hint: "Mild expression for something harsh", subject: "english" },
    { word: "ALGORITHM", hint: "Step-by-step problem solving", subject: "cs" },
  ],
};

// ========================= GRADE 10 =========================
const grade10: GradeContent = {
  subjects: [
    { id: "math", name: "Trigonometry & Calculus Intro", nameHi: "त्रिकोणमिति और कलन", nameTa: "முக்கோணவியல் & நுண்கணிதம்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 24, completedLessons: 0 },
    { id: "science", name: "Chemistry & Biology", nameHi: "रसायन और जीवविज्ञान", nameTa: "வேதியியல் & உயிரியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 24, completedLessons: 0 },
    { id: "english", name: "Advanced English", nameHi: "उन्नत अंग्रेज़ी", nameTa: "மேம்பட்ட ஆங்கிலம்", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "cs", name: "JavaScript & Web Dev", nameHi: "जावास्क्रिप्ट और वेब", nameTa: "ஜாவாஸ்கிரிப்ட் & வலை", icon: "💻", color: "bg-level", progress: 0, totalLessons: 22, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH
    { id: "g10m1", question: "What is sin²θ + cos²θ?", options: ["0", "1", "2", "sin2θ"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g10m2", question: "What is the derivative of a constant?", options: ["1", "0", "The constant", "x"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g10m3", question: "What is log₁₀(100)?", options: ["1", "2", "10", "100"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g10m4", question: "What is the slope-intercept form of a line?", options: ["ax+by=c", "y=mx+b", "y-y₁=m(x-x₁)", "x/a+y/b=1"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g10m5", question: "What is cos 60°?", options: ["0", "1/2", "√3/2", "1"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g10m6", question: "What is the derivative of x³?", options: ["x²", "2x²", "3x²", "3x"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m7", question: "What is tan θ in terms of sin and cos?", options: ["sin/cos", "cos/sin", "sin×cos", "sin+cos"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m8", question: "What is the sum of an AP: a, a+d, a+2d... (n terms)?", options: ["n/2[2a+(n-1)d]", "a×rⁿ", "n(n+1)/2", "a+nd"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m9", question: "What is the value of sec 0°?", options: ["0", "1", "∞", "Undefined"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m10", question: "What is the nth term of an AP?", options: ["a+nd", "a+(n-1)d", "a×rⁿ", "a×r^(n-1)"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m11", question: "What is the derivative of sin x?", options: ["-sin x", "cos x", "-cos x", "tan x"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m12", question: "What is log₂(64)?", options: ["4", "5", "6", "8"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m13", question: "If the roots of x²+bx+c=0 are equal, discriminant is?", options: ["> 0", "< 0", "= 0", "= 1"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g10m14", question: "What is ∫ 2x dx?", options: ["x²", "x² + C", "2x² + C", "x + C"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g10m15", question: "What is the sum of interior angles of a hexagon?", options: ["540°", "620°", "720°", "900°"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g10m16", question: "What is the formula for the sum of a GP?", options: ["a(1-rⁿ)/(1-r)", "n/2[2a+(n-1)d]", "a+rⁿ", "na"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g10m17", question: "What is the derivative of eˣ?", options: ["xeˣ⁻¹", "eˣ", "eˣ⁺¹", "ln(x)"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g10m18", question: "What is the range of sin x?", options: ["[-∞, ∞]", "[0, 1]", "[-1, 1]", "[0, ∞]"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g10m19", question: "What is the section formula for internal division?", options: ["((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))", "(x₁+x₂, y₁+y₂)", "(x₁-x₂, y₁-y₂)", "(mx₁+nx₂, my₁+ny₂)"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g10m20", question: "What is the area of a triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃)?", options: ["½|x₁(y₂-y₃)+x₂(y₃-y₁)+x₃(y₁-y₂)|", "½(b×h)", "s(s-a)(s-b)(s-c)", "All of these"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE
    { id: "g10s1", question: "What is the periodic table organized by?", options: ["Alphabetical order", "Atomic number", "Weight", "Color"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g10s2", question: "What is a chemical bond?", options: ["A physical connection", "An attractive force between atoms", "A type of molecule", "A chemical reaction"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g10s3", question: "What is heredity?", options: ["A disease", "Passing traits from parents to offspring", "A type of cell", "A mutation"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g10s4", question: "What is a chemical equation?", options: ["A math equation", "Symbolic representation of a chemical reaction", "A physics formula", "A biology diagram"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g10s5", question: "What is the lens formula?", options: ["1/f = 1/v - 1/u", "f = v + u", "f = vu", "1/f = v/u"], correctAnswer: 0, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g10s6", question: "What is an ionic bond?", options: ["Sharing electrons", "Transfer of electrons", "Nuclear bond", "Magnetic bond"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s7", question: "What is the functional unit of heredity?", options: ["Cell", "Gene", "Chromosome", "DNA"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s8", question: "What is a covalent bond?", options: ["Transfer of electrons", "Sharing of electrons", "Loss of protons", "Gain of neutrons"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s9", question: "What is the mirror formula?", options: ["1/f = 1/v + 1/u", "f = v - u", "f = v × u", "v = f + u"], correctAnswer: 0, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s10", question: "What is the pH of a neutral solution?", options: ["0", "5", "7", "14"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s11", question: "What is a dominant trait?", options: ["A hidden trait", "A trait that appears in heterozygous condition", "A recessive trait", "A mutated trait"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s12", question: "What is Snell's law about?", options: ["Gravity", "Refraction of light", "Reflection", "Diffraction"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s13", question: "What is a redox reaction?", options: ["Only reduction", "Only oxidation", "Both reduction and oxidation", "Neither"], correctAnswer: 2, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g10s14", question: "What is the Mendeleev periodic law based on?", options: ["Atomic number", "Atomic mass", "Electron configuration", "Valency only"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g10s15", question: "What is the genotypic ratio of a monohybrid cross?", options: ["1:2:1", "3:1", "9:3:3:1", "1:1"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g10s16", question: "What is electromagnetic induction?", options: ["Static electricity", "Generating current by changing magnetic field", "Charging batteries", "Creating magnets"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g10s17", question: "What is the IUPAC name of CH₃COOH?", options: ["Methanoic acid", "Ethanoic acid", "Propanoic acid", "Butanoic acid"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g10s18", question: "What is total internal reflection?", options: ["Light going through glass", "Light reflecting back when angle > critical angle", "Light absorption", "Light diffraction"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g10s19", question: "What is the power of a lens with focal length 20 cm?", options: ["2D", "5D", "20D", "0.5D"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g10s20", question: "What is speciation?", options: ["Extinction", "Formation of new species", "Mutation", "Adaptation only"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH
    { id: "g10e1", question: "What is an allegory?", options: ["A short story", "A story with hidden meaning", "A poem", "A play"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g10e2", question: "What is the difference between 'farther' and 'further'?", options: ["No difference", "Farther = physical distance, further = metaphorical", "Further = distance", "Both mean physical"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g10e3", question: "What is a memoir?", options: ["A fiction novel", "A personal account of experiences", "A poem collection", "A biography of others"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g10e4", question: "What is passive voice?", options: ["Subject does the action", "Subject receives the action", "No subject", "Only questions"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g10e5", question: "What is a bibliography?", options: ["The first chapter", "A list of sources used", "An index", "A glossary"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g10e6", question: "What is a motif in literature?", options: ["The main plot", "A recurring element or idea", "The setting", "The climax"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e7", question: "What is an epigraph?", options: ["The ending", "A quote at the beginning of a work", "A chapter title", "A footnote"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e8", question: "What is the difference between 'imply' and 'infer'?", options: ["No difference", "Imply = suggest, infer = conclude", "Infer = suggest", "Both mean conclude"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e9", question: "What is a dangling modifier?", options: ["A long sentence", "A modifier without a clear subject", "A type of verb", "A conjunction"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e10", question: "Who wrote 'The Great Gatsby'?", options: ["Hemingway", "F. Scott Fitzgerald", "Steinbeck", "Faulkner"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e11", question: "What is verisimilitude?", options: ["Fiction", "The appearance of being true or real", "Fantasy", "Exaggeration"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e12", question: "What is a red herring in literature?", options: ["A type of fish", "A misleading clue", "The main plot", "A character type"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e13", question: "What is a semicolon used for?", options: ["Ending a sentence", "Joining related independent clauses", "Starting a list", "Indicating possession"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g10e14", question: "What is magical realism?", options: ["Pure fantasy", "Realistic setting with magical elements", "Science fiction", "Horror"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g10e15", question: "Who wrote '1984'?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g10e16", question: "What is juxtaposition?", options: ["Repetition", "Placing contrasting elements side by side", "A type of poem", "A dialogue style"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g10e17", question: "What is an unreliable narrator?", options: ["A narrator who speaks truth", "A narrator whose credibility is compromised", "The author", "A minor character"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g10e18", question: "What is a tragic flaw (hamartia)?", options: ["A plot hole", "A character weakness leading to downfall", "A happy ending", "A side plot"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g10e19", question: "What is metonymy?", options: ["A comparison", "Substituting a related word for the thing meant", "An exaggeration", "A contradiction"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g10e20", question: "What is the difference between tone and mood?", options: ["No difference", "Tone = author's attitude, mood = reader's feeling", "Mood = author's attitude", "Both are the same"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

    // CS
    { id: "g10c1", question: "What is JavaScript primarily used for?", options: ["Database management", "Making web pages interactive", "Operating systems", "Hardware control"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g10c2", question: "How do you declare a variable in JS with block scope?", options: ["var", "let", "define", "dim"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g10c3", question: "What is the DOM?", options: ["A database", "Document Object Model", "A CSS framework", "A server"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g10c4", question: "What does console.log() do?", options: ["Creates a variable", "Outputs to the console", "Styles a page", "Creates a loop"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g10c5", question: "Which symbol is used for comments in JavaScript?", options: ["#", "//", "<!--", "**"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g10c6", question: "What is an event listener?", options: ["A sound recorder", "Code that responds to user actions", "A variable type", "A CSS property"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c7", question: "What does '===' check in JavaScript?", options: ["Value only", "Type only", "Value and type", "Reference"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c8", question: "What is JSON?", options: ["A programming language", "JavaScript Object Notation", "A database", "A framework"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c9", question: "What does 'typeof null' return?", options: ["null", "undefined", "object", "boolean"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c10", question: "What is an arrow function in JS?", options: ["A regular function", "A concise function syntax using =>", "A loop", "A class"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c11", question: "What does Array.map() do?", options: ["Filters items", "Creates a new array by transforming each element", "Sorts items", "Finds an item"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c12", question: "What is localStorage?", options: ["Server storage", "Browser storage that persists", "RAM", "A database"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c13", question: "What is responsive design?", options: ["Fast loading", "Design that adapts to different screen sizes", "Colorful design", "3D design"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g10c14", question: "What is a closure in JavaScript?", options: ["A loop", "A function with access to outer scope", "A CSS feature", "An HTML element"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g10c15", question: "What is async/await used for?", options: ["Styling", "Handling asynchronous operations", "Creating HTML", "Database queries"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g10c16", question: "What is a Promise in JavaScript?", options: ["A variable", "An object representing eventual completion/failure", "A loop", "A function"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g10c17", question: "What is the spread operator (...)?", options: ["A math operator", "Expands elements of an iterable", "A comparison", "A loop construct"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g10c18", question: "What is destructuring in JS?", options: ["Deleting objects", "Extracting values from arrays/objects", "Creating loops", "Error handling"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g10c19", question: "What is the fetch API used for?", options: ["Styling pages", "Making HTTP requests", "Creating animations", "Managing state"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g10c20", question: "What is the event loop in JavaScript?", options: ["A for loop", "Mechanism handling async callbacks", "A CSS animation", "A DOM method"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g10f1", front: "What is the derivative of sin x?", back: "cos x", subject: "math" },
    { id: "g10f2", front: "What is an ionic bond?", back: "A bond formed by the transfer of electrons between atoms.", subject: "science" },
    { id: "g10f3", front: "What is an allegory?", back: "A narrative where characters/events represent abstract ideas or moral qualities.", subject: "english" },
    { id: "g10f4", front: "What is a closure in JavaScript?", back: "A function that has access to variables from its outer (enclosing) function's scope.", subject: "cs" },
    { id: "g10f5", front: "What is ∫ xⁿ dx?", back: "xⁿ⁺¹/(n+1) + C, where n ≠ -1.", subject: "math" },
    { id: "g10f6", front: "What is Mendel's Law of Segregation?", back: "During gamete formation, allele pairs separate so each gamete carries only one allele.", subject: "science" },
    { id: "g10f7", front: "What is dramatic irony?", back: "When the audience knows something that the characters do not.", subject: "english" },
    { id: "g10f8", front: "What is the DOM?", back: "Document Object Model — a tree-like representation of HTML that JavaScript can manipulate.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g10p1", term: "d/dx(sin x)", definition: "cos x" },
    { id: "g10p2", term: "Ionic bond", definition: "Electron transfer" },
    { id: "g10p3", term: "Closure", definition: "Function + outer scope" },
    { id: "g10p4", term: "Allegory", definition: "Hidden meaning story" },
    { id: "g10p5", term: "pH 7", definition: "Neutral solution" },
    { id: "g10p6", term: "===", definition: "Strict equality (JS)" },
  ],
  scrambleWords: [
    { word: "DERIVATIVE", hint: "Rate of change of a function", subject: "math" },
    { word: "HEREDITY", hint: "Passing traits from parent to offspring", subject: "science" },
    { word: "ALLEGORY", hint: "Story with a hidden meaning", subject: "english" },
    { word: "JAVASCRIPT", hint: "Language for interactive web pages", subject: "cs" },
    { word: "LOGARITHM", hint: "Inverse of exponentiation", subject: "math" },
    { word: "ELECTRODE", hint: "Conductor used in electrolysis", subject: "science" },
    { word: "JUXTAPOSE", hint: "Place side by side for comparison", subject: "english" },
    { word: "CALLBACK", hint: "Function passed as argument to another", subject: "cs" },
  ],
};

// ========================= GRADE 11 =========================
const grade11: GradeContent = {
  subjects: [
    { id: "math", name: "Calculus & Statistics", nameHi: "कलन और सांख्यिकी", nameTa: "நுண்கணிதம் & புள்ளியியல்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 26, completedLessons: 0 },
    { id: "science", name: "Advanced Physics", nameHi: "उन्नत भौतिकी", nameTa: "மேம்பட்ட இயற்பியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 26, completedLessons: 0 },
    { id: "english", name: "Literature & Rhetoric", nameHi: "साहित्य और वाक्पटुता", nameTa: "இலக்கியம் & சொல்லாற்றல்", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 20, completedLessons: 0 },
    { id: "cs", name: "Data Structures", nameHi: "डेटा संरचनाएँ", nameTa: "தரவு கட்டமைப்புகள்", icon: "💻", color: "bg-level", progress: 0, totalLessons: 24, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH
    { id: "g11m1", question: "What is the limit of sin(x)/x as x→0?", options: ["0", "1", "∞", "Undefined"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g11m2", question: "What is d/dx(eˣ)?", options: ["xeˣ⁻¹", "eˣ", "eˣ⁺¹", "1/eˣ"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g11m3", question: "What is the mean of a standard normal distribution?", options: ["-1", "0", "1", "0.5"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g11m4", question: "What is nCr (combinations)?", options: ["n!/(r!(n-r)!)", "n!/r!", "n!/(n-r)!", "n×r"], correctAnswer: 0, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g11m5", question: "What is d/dx(ln x)?", options: ["ln x", "1/x", "x", "eˣ"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g11m6", question: "What is ∫ eˣ dx?", options: ["eˣ + C", "xeˣ + C", "eˣ/x + C", "ln(eˣ) + C"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m7", question: "What is the chain rule?", options: ["d/dx[f(g(x))] = f'(g(x))·g'(x)", "f'(x)+g'(x)", "f(x)·g(x)", "f'(x)/g'(x)"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m8", question: "What is the variance formula?", options: ["Σ(xᵢ-μ)/n", "Σ(xᵢ-μ)²/n", "Σxᵢ/n", "√(Σ(xᵢ-μ)²/n)"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m9", question: "What is d/dx(tan x)?", options: ["sin x", "cos x", "sec²x", "-csc²x"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m10", question: "What is the product rule?", options: ["f'g + fg'", "f'g'", "f'/g'", "(fg)'"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m11", question: "What is nPr (permutations)?", options: ["n!/(n-r)!", "n!/r!", "n!/(r!(n-r)!)", "nʳ"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m12", question: "What is ∫ 1/x dx?", options: ["x + C", "ln|x| + C", "1/x² + C", "eˣ + C"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m13", question: "What is Bayes' theorem about?", options: ["Integration", "Conditional probability", "Derivatives", "Statistics only"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g11m14", question: "What is ∫₀^π sin x dx?", options: ["0", "1", "2", "π"], correctAnswer: 2, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g11m15", question: "What is L'Hôpital's rule used for?", options: ["Integration", "Evaluating 0/0 or ∞/∞ limits", "Differentiation", "Probability"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g11m16", question: "What is the Taylor series expansion of eˣ?", options: ["Σ xⁿ/n!", "Σ xⁿ", "Σ n·xⁿ", "Σ xⁿ/n"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g11m17", question: "What is the derivative of arctan(x)?", options: ["1/(1+x²)", "1/√(1-x²)", "sec²x", "-1/(1+x²)"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g11m18", question: "If X ~ N(μ,σ²), what is P(μ-σ < X < μ+σ)?", options: ["50%", "68%", "95%", "99%"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g11m19", question: "What is integration by parts formula?", options: ["∫u dv = uv - ∫v du", "∫uv dx = u∫v", "∫u dv = u + v", "∫u dv = uv + ∫v du"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g11m20", question: "What is the moment generating function?", options: ["E[X]", "E[eᵗˣ]", "Var(X)", "E[X²]"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE
    { id: "g11s1", question: "What is the unit of electric charge?", options: ["Ampere", "Volt", "Coulomb", "Ohm"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g11s2", question: "What is Coulomb's law about?", options: ["Magnetism", "Electric force between charges", "Gravity", "Light"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g11s3", question: "What is the unit of capacitance?", options: ["Henry", "Farad", "Tesla", "Weber"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g11s4", question: "What is simple harmonic motion?", options: ["Linear motion", "Oscillatory motion with restoring force", "Circular motion", "Random motion"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g11s5", question: "What is the first law of thermodynamics?", options: ["Energy conservation", "Entropy always increases", "Absolute zero is unattainable", "Heat flows cold to hot"], correctAnswer: 0, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g11s6", question: "What is the electric field formula?", options: ["F/q", "V/I", "q/F", "IR"], correctAnswer: 0, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s7", question: "What is the time period of a simple pendulum?", options: ["2π√(l/g)", "2π√(g/l)", "π√(l/g)", "2πlg"], correctAnswer: 0, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s8", question: "What is Kirchhoff's junction rule?", options: ["V = IR", "Sum of currents at a junction = 0", "P = IV", "F = qE"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s9", question: "What is the magnetic force on a current-carrying conductor?", options: ["F = qE", "F = BIl", "F = ma", "F = kx"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s10", question: "What is Doppler effect?", options: ["Color change", "Change in frequency due to relative motion", "Sound amplification", "Light bending"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s11", question: "What is Young's double slit experiment about?", options: ["Gravity", "Interference of light", "Electric current", "Heat transfer"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s12", question: "What is the unit of magnetic flux?", options: ["Tesla", "Weber", "Henry", "Gauss"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s13", question: "What is entropy?", options: ["Energy", "Measure of disorder", "Temperature", "Pressure"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g11s14", question: "What is the de Broglie wavelength formula?", options: ["λ = h/mv", "λ = hf", "λ = c/f", "λ = E/h"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g11s15", question: "What is the photoelectric effect?", options: ["Light reflection", "Emission of electrons by light", "Light diffraction", "Heat generation"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g11s16", question: "What is the Heisenberg uncertainty principle?", options: ["Position and momentum can both be precisely known", "Cannot simultaneously know exact position and momentum", "Energy is always conserved", "Speed of light is constant"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g11s17", question: "What is the formula for capacitors in series?", options: ["C = C₁+C₂", "1/C = 1/C₁+1/C₂", "C = C₁×C₂", "C = C₁/C₂"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g11s18", question: "What is Faraday's law of electromagnetic induction?", options: ["F = qvB", "EMF = -dΦ/dt", "V = IR", "F = ma"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g11s19", question: "What is the work function in photoelectric effect?", options: ["Energy of the photon", "Minimum energy to eject electron", "Kinetic energy of electron", "Threshold wavelength"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g11s20", question: "What is the Carnot efficiency formula?", options: ["1 - T_cold/T_hot", "T_hot/T_cold", "T_cold - T_hot", "1 - T_hot/T_cold"], correctAnswer: 0, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH
    { id: "g11e1", question: "What is a soliloquy?", options: ["A group speech", "A character speaking thoughts aloud alone", "A dialogue", "A poem"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g11e2", question: "What is a dystopian novel?", options: ["A perfect world", "A fictional oppressive society", "A historical novel", "A comedy"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g11e3", question: "What is rhetoric?", options: ["A type of poem", "The art of persuasive speaking/writing", "A grammar rule", "A novel type"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g11e4", question: "What is pathos?", options: ["Logic appeal", "Emotional appeal", "Credibility appeal", "A character type"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g11e5", question: "What is ethos?", options: ["Emotional appeal", "Logical appeal", "Credibility/ethical appeal", "A poem type"], correctAnswer: 2, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g11e6", question: "What is logos?", options: ["Emotional appeal", "Logical/reasoning appeal", "Credibility appeal", "A brand name"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e7", question: "What is an epistolary novel?", options: ["A mystery novel", "A novel told through letters/documents", "A short story", "A play"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e8", question: "Who wrote 'Hamlet'?", options: ["Marlowe", "Shakespeare", "Jonson", "Spenser"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e9", question: "What is a foil character?", options: ["The hero", "A character that contrasts another to highlight traits", "The villain", "A narrator"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e10", question: "What is synecdoche?", options: ["A part representing the whole", "An exaggeration", "A comparison", "A sound word"], correctAnswer: 0, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e11", question: "What is the difference between elegy and eulogy?", options: ["No difference", "Elegy = mourning poem, eulogy = praise speech", "Eulogy = poem", "Elegy = praise speech"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e12", question: "What is a caesura in poetry?", options: ["End rhyme", "A pause within a line", "A stanza break", "A footnote"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e13", question: "What is enjambment?", options: ["End-stopped line", "A sentence continuing to the next line without pause", "A rhyme scheme", "A stanza"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g11e14", question: "What is a Kafkaesque narrative?", options: ["A love story", "Absurd, nightmarish, bureaucratic themes", "A comedy", "Historical fiction"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g11e15", question: "Who wrote 'The Canterbury Tales'?", options: ["Shakespeare", "Chaucer", "Milton", "Donne"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g11e16", question: "What is existentialism in literature?", options: ["Focus on nature", "Focus on individual existence and freedom", "Focus on history", "Focus on romance"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g11e17", question: "What is a palimpsest?", options: ["A type of poem", "A manuscript written over erased text", "A novel type", "A dramatic form"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g11e18", question: "What is anagnorisis?", options: ["A tragic flaw", "A moment of critical recognition", "A plot twist", "The climax"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g11e19", question: "Who wrote 'Paradise Lost'?", options: ["Shakespeare", "Milton", "Wordsworth", "Keats"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g11e20", question: "What is a chiasmus?", options: ["A type of rhyme", "Reversal of structure in successive phrases (AB-BA)", "A metaphor type", "A narrative technique"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

    // CS
    { id: "g11c1", question: "What is a data structure?", options: ["A database", "A way to organize and store data", "A programming language", "A framework"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g11c2", question: "What is a stack?", options: ["FIFO structure", "LIFO structure", "Random access", "A tree"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g11c3", question: "What is a queue?", options: ["LIFO structure", "FIFO structure", "Random access", "A graph"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g11c4", question: "What is Big-O notation?", options: ["A programming language", "A measure of algorithm efficiency", "A data type", "A design pattern"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g11c5", question: "What is a linked list?", options: ["An array", "Nodes connected by pointers", "A stack", "A queue"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g11c6", question: "What is the time complexity of accessing an array element?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c7", question: "What is a binary tree?", options: ["A tree with n children", "A tree where each node has at most 2 children", "A linked list", "A graph"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c8", question: "What is a hash table?", options: ["A sorting algorithm", "Key-value store with hash function", "A tree structure", "A queue"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c9", question: "What is the worst-case time complexity of bubble sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], correctAnswer: 2, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c10", question: "What is a graph in CS?", options: ["A chart", "Nodes connected by edges", "A tree only", "An array"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c11", question: "What is BFS?", options: ["Best First Search", "Breadth First Search", "Binary First Sort", "Block File System"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c12", question: "What is DFS?", options: ["Data File System", "Depth First Search", "Direct File Sort", "Dynamic First Search"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c13", question: "What is the time complexity of merge sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g11c14", question: "What is a BST (Binary Search Tree)?", options: ["Any binary tree", "Left < root < right for all nodes", "A balanced tree only", "A complete tree"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g11c15", question: "What is dynamic programming?", options: ["Writing dynamic code", "Solving problems by breaking into overlapping subproblems", "Real-time programming", "Object-oriented programming"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g11c16", question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g11c17", question: "What is a heap data structure?", options: ["A stack", "A complete binary tree with heap property", "A linked list", "A hash table"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g11c18", question: "What is the space complexity of merge sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctAnswer: 2, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g11c19", question: "What is an AVL tree?", options: ["Any binary tree", "A self-balancing BST", "A B-tree", "A red-black tree"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g11c20", question: "What is Dijkstra's algorithm for?", options: ["Sorting", "Shortest path in a weighted graph", "Searching", "Hashing"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g11f1", front: "What is the chain rule?", back: "d/dx[f(g(x))] = f'(g(x)) · g'(x).", subject: "math" },
    { id: "g11f2", front: "What is the photoelectric effect?", back: "Emission of electrons from a metal when light of sufficient frequency hits it.", subject: "science" },
    { id: "g11f3", front: "What are ethos, pathos, logos?", back: "Rhetorical appeals: credibility, emotion, and logic.", subject: "english" },
    { id: "g11f4", front: "What is Big-O notation?", back: "A way to describe the upper bound of an algorithm's time/space complexity.", subject: "cs" },
    { id: "g11f5", front: "What is integration by parts?", back: "∫u dv = uv - ∫v du.", subject: "math" },
    { id: "g11f6", front: "What is Faraday's law?", back: "EMF = -dΦ/dt — changing magnetic flux induces an EMF.", subject: "science" },
    { id: "g11f7", front: "What is synecdoche?", back: "A figure of speech where a part represents the whole (e.g., 'all hands on deck').", subject: "english" },
    { id: "g11f8", front: "What is dynamic programming?", back: "Solving complex problems by breaking them into simpler overlapping subproblems.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g11p1", term: "O(n log n)", definition: "Merge sort complexity" },
    { id: "g11p2", term: "EMF = -dΦ/dt", definition: "Faraday's law" },
    { id: "g11p3", term: "Pathos", definition: "Emotional appeal" },
    { id: "g11p4", term: "Stack", definition: "LIFO structure" },
    { id: "g11p5", term: "λ = h/mv", definition: "de Broglie wavelength" },
    { id: "g11p6", term: "BST", definition: "Left < Root < Right" },
  ],
  scrambleWords: [
    { word: "CALCULUS", hint: "Branch of math studying change", subject: "math" },
    { word: "CAPACITOR", hint: "Stores electric charge", subject: "science" },
    { word: "RHETORIC", hint: "Art of persuasive communication", subject: "english" },
    { word: "DIJKSTRA", hint: "Shortest path algorithm", subject: "cs" },
    { word: "INTEGRAL", hint: "Opposite of derivative", subject: "math" },
    { word: "ENTROPY", hint: "Measure of disorder", subject: "science" },
    { word: "CHIASMUS", hint: "AB-BA reversal pattern in text", subject: "english" },
    { word: "RECURSION", hint: "Function calling itself", subject: "cs" },
  ],
};

// ========================= GRADE 12 =========================
const grade12: GradeContent = {
  subjects: [
    { id: "math", name: "Advanced Calculus & Linear Algebra", nameHi: "उन्नत कलन और रैखिक बीजगणित", nameTa: "மேம்பட்ட நுண்கணிதம்", icon: "📐", color: "bg-primary", progress: 0, totalLessons: 28, completedLessons: 0 },
    { id: "science", name: "Modern Physics & Chemistry", nameHi: "आधुनिक भौतिकी और रसायन", nameTa: "நவீன இயற்பியல் & வேதியியல்", icon: "🔬", color: "bg-secondary", progress: 0, totalLessons: 28, completedLessons: 0 },
    { id: "english", name: "World Literature", nameHi: "विश्व साहित्य", nameTa: "உலக இலக்கியம்", icon: "📖", color: "bg-accent", progress: 0, totalLessons: 22, completedLessons: 0 },
    { id: "cs", name: "Algorithms & System Design", nameHi: "एल्गोरिदम और सिस्टम डिज़ाइन", nameTa: "வழிமுறைகள் & அமைப்பு", icon: "💻", color: "bg-level", progress: 0, totalLessons: 26, completedLessons: 0 },
  ],
  quizQuestions: [
    // MATH
    { id: "g12m1", question: "What is a matrix determinant?", options: ["Sum of elements", "A scalar value from a square matrix", "The inverse", "The transpose"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g12m2", question: "What is the rank of a matrix?", options: ["Number of rows", "Maximum number of linearly independent rows/columns", "Number of columns", "Determinant value"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g12m3", question: "What is ∫ cos x dx?", options: ["-sin x + C", "sin x + C", "cos x + C", "tan x + C"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g12m4", question: "What is a vector?", options: ["Only magnitude", "Magnitude and direction", "Only direction", "A scalar"], correctAnswer: 1, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g12m5", question: "What is the dot product of perpendicular vectors?", options: ["1", "-1", "0", "Undefined"], correctAnswer: 2, xpReward: 5, subject: "math", difficulty: "easy" },
    { id: "g12m6", question: "What is a differential equation?", options: ["An algebraic equation", "An equation involving derivatives", "A matrix equation", "A linear equation"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m7", question: "What is the inverse of a 2×2 matrix [[a,b],[c,d]]?", options: ["[[d,-b],[-c,a]]/(ad-bc)", "[[a,c],[b,d]]", "[[d,b],[c,a]]", "[[a,-b],[-c,d]]"], correctAnswer: 0, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m8", question: "What is the cross product of two parallel vectors?", options: ["Maximum", "1", "0 (zero vector)", "Undefined"], correctAnswer: 2, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m9", question: "What is ∫₀^1 x² dx?", options: ["1/2", "1/3", "1/4", "1"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m10", question: "What is the solution of dy/dx = ky?", options: ["y = kx", "y = Ceᵏˣ", "y = x² + C", "y = ln(kx)"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m11", question: "What is an eigenvalue?", options: ["A type of matrix", "λ where Av = λv for some vector v", "The determinant", "The trace"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m12", question: "What is the trace of a matrix?", options: ["The determinant", "Sum of diagonal elements", "Product of elements", "Number of rows"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m13", question: "What is a partial derivative?", options: ["A complete derivative", "Derivative with respect to one variable holding others constant", "An integral", "A limit"], correctAnswer: 1, xpReward: 10, subject: "math", difficulty: "medium" },
    { id: "g12m14", question: "What is Green's theorem about?", options: ["Numbers", "Relating line integral to double integral", "Matrix operations", "Probability"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g12m15", question: "What is the Cayley-Hamilton theorem?", options: ["Every matrix satisfies its own characteristic equation", "All matrices are invertible", "Determinant equals trace", "Eigenvalues are always real"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g12m16", question: "What is ∫ eˣ sin x dx?", options: ["eˣ(sin x - cos x)/2 + C", "eˣ sin x + C", "eˣ cos x + C", "-eˣ sin x + C"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g12m17", question: "What is a saddle point?", options: ["A local maximum", "A point that is max in one direction and min in another", "A local minimum", "A global maximum"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g12m18", question: "What is the divergence of a vector field?", options: ["A vector", "A scalar measuring source/sink strength", "A matrix", "A line integral"], correctAnswer: 1, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g12m19", question: "What is the Laplace transform of f(t)?", options: ["∫₀^∞ f(t)e⁻ˢᵗ dt", "∫₋∞^∞ f(t) dt", "df/dt", "f(s)"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },
    { id: "g12m20", question: "What is Stokes' theorem?", options: ["Relates surface integral to line integral", "F = ma", "Conservation of mass", "PV = nRT"], correctAnswer: 0, xpReward: 20, subject: "math", difficulty: "hard" },

    // SCIENCE
    { id: "g12s1", question: "What is radioactivity?", options: ["Chemical reaction", "Spontaneous emission of radiation from unstable nuclei", "Electric current", "Magnetic field"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g12s2", question: "What is E = mc²?", options: ["Force equation", "Mass-energy equivalence", "Momentum equation", "Wave equation"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g12s3", question: "What are alpha particles?", options: ["Electrons", "Helium nuclei", "Protons", "Neutrons"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g12s4", question: "What is a semiconductor?", options: ["Always conducts", "Never conducts", "Conducts under certain conditions", "A gas"], correctAnswer: 2, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g12s5", question: "What is the Bohr model about?", options: ["Solar system", "Atomic structure with electron orbits", "Chemical bonds", "Nuclear fission"], correctAnswer: 1, xpReward: 5, subject: "science", difficulty: "easy" },
    { id: "g12s6", question: "What is nuclear fission?", options: ["Combining nuclei", "Splitting heavy nucleus into lighter ones", "Electron emission", "Proton capture"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s7", question: "What is a p-n junction?", options: ["A capacitor", "Junction of p-type and n-type semiconductors", "A resistor", "An inductor"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s8", question: "What is the half-life of a radioactive substance?", options: ["Time to fully decay", "Time for half the atoms to decay", "Time to double", "Time to reach stability"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s9", question: "What is the Rydberg formula used for?", options: ["Chemical equations", "Spectral lines of hydrogen", "Nuclear reactions", "Electric circuits"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s10", question: "What is a transistor used for?", options: ["Storing charge", "Amplifying/switching electronic signals", "Measuring temperature", "Generating light"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s11", question: "What is nuclear fusion?", options: ["Splitting atoms", "Combining light nuclei into heavier ones", "Chemical reaction", "Radioactive decay"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s12", question: "What is the Schrödinger equation about?", options: ["Classical mechanics", "Quantum mechanical wave function", "Thermodynamics", "Optics"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s13", question: "What is an LED?", options: ["A resistor", "Light Emitting Diode", "A transistor", "A capacitor"], correctAnswer: 1, xpReward: 10, subject: "science", difficulty: "medium" },
    { id: "g12s14", question: "What is the binding energy per nucleon?", options: ["Energy to add a proton", "Energy needed to remove a nucleon from the nucleus", "Total energy of atom", "Kinetic energy"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g12s15", question: "What is the Compton effect?", options: ["Light reflection", "Increase in wavelength of X-rays after scattering", "Light absorption", "Photoelectric emission"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g12s16", question: "What is the principle of a laser?", options: ["Spontaneous emission", "Stimulated emission of radiation", "Natural radiation", "Thermal emission"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g12s17", question: "What is a Zener diode used for?", options: ["Amplification", "Voltage regulation", "Light emission", "Signal modulation"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g12s18", question: "What is the mass defect?", options: ["Extra mass in nucleus", "Difference between sum of nucleon masses and actual nuclear mass", "Mass of electron", "Mass of proton"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g12s19", question: "What is wave-particle duality?", options: ["Waves are particles", "Particles exhibit both wave and particle behavior", "Only waves exist", "Only particles exist"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },
    { id: "g12s20", question: "What is the Pauli exclusion principle?", options: ["All electrons have same energy", "No two electrons can have same set of quantum numbers", "Electrons repel protons", "Electrons attract neutrons"], correctAnswer: 1, xpReward: 20, subject: "science", difficulty: "hard" },

    // ENGLISH
    { id: "g12e1", question: "What is postmodernism in literature?", options: ["Traditional storytelling", "Challenges traditional narratives, embraces fragmentation", "Only poetry", "Historical writing"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g12e2", question: "What is a critical essay?", options: ["A negative review", "An analytical evaluation of a work", "A summary", "A biography"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g12e3", question: "Who wrote 'The Waste Land'?", options: ["Yeats", "T.S. Eliot", "Pound", "Frost"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g12e4", question: "What is intertextuality?", options: ["Plagiarism", "Relationship between texts", "A single text", "A grammar rule"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g12e5", question: "What is a thesis defense?", options: ["Fighting", "Formally presenting and defending your argument", "Writing an essay", "Reading a book"], correctAnswer: 1, xpReward: 5, subject: "english", difficulty: "easy" },
    { id: "g12e6", question: "What is deconstruction?", options: ["Building something", "Analyzing text to reveal hidden contradictions", "Summarizing", "Translating"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e7", question: "Who wrote 'One Hundred Years of Solitude'?", options: ["Borges", "García Márquez", "Neruda", "Allende"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e8", question: "What is a Socratic dialogue?", options: ["A monologue", "A conversational method of philosophical inquiry", "A poem", "A novel type"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e9", question: "What is colonialism as a literary theme?", options: ["Space exploration", "Examining effects of imperial power on cultures", "A romance subplot", "A comedy genre"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e10", question: "What is a literary canon?", options: ["A weapon", "A collection of works considered most important", "A dictionary", "A grammar book"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e11", question: "What is stream of consciousness?", options: ["A river", "Continuous flow of thoughts in narrative", "A dialogue", "A poem form"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e12", question: "Who wrote 'Things Fall Apart'?", options: ["Soyinka", "Chinua Achebe", "Ngugi", "Adichie"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e13", question: "What is a bildungsroman?", options: ["A horror novel", "A coming-of-age novel", "A mystery", "A romance"], correctAnswer: 1, xpReward: 10, subject: "english", difficulty: "medium" },
    { id: "g12e14", question: "What is the 'death of the author' concept?", options: ["Author dies", "Author's intentions don't determine meaning", "Author writes about death", "A mystery plot"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g12e15", question: "What is magical realism's origin?", options: ["American", "Latin American literature", "British", "Asian"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g12e16", question: "Who coined the term 'objective correlative'?", options: ["Wordsworth", "T.S. Eliot", "Keats", "Shelley"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g12e17", question: "What is a palimpsest metaphor in literature?", options: ["A simple story", "Layers of meaning written over each other", "A plot device", "A character type"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g12e18", question: "What is Derridean différance?", options: ["A spelling error", "The play of meaning through deferral and difference", "A rhyme scheme", "A plot structure"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g12e19", question: "What is the Sapir-Whorf hypothesis?", options: ["Language doesn't matter", "Language shapes thought and perception", "Grammar is universal", "All languages are the same"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },
    { id: "g12e20", question: "Who wrote 'Waiting for Godot'?", options: ["Ionesco", "Samuel Beckett", "Brecht", "Pinter"], correctAnswer: 1, xpReward: 20, subject: "english", difficulty: "hard" },

    // CS
    { id: "g12c1", question: "What is time complexity?", options: ["How long a program takes", "How execution time grows with input size", "CPU speed", "Memory usage"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g12c2", question: "What is a database?", options: ["A file", "Organized collection of structured data", "A program", "An algorithm"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g12c3", question: "What is SQL?", options: ["A programming language", "Structured Query Language for databases", "A markup language", "An operating system"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g12c4", question: "What is an API?", options: ["A programming language", "Application Programming Interface", "A database", "An algorithm"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g12c5", question: "What is version control?", options: ["Versioning software", "Tracking changes in code over time", "A programming language", "A database"], correctAnswer: 1, xpReward: 5, subject: "cs", difficulty: "easy" },
    { id: "g12c6", question: "What is the time complexity of quicksort (average)?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c7", question: "What is a REST API?", options: ["A sleep function", "Representational State Transfer API", "A database type", "A sorting algorithm"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c8", question: "What is normalization in databases?", options: ["Making data bigger", "Organizing to reduce redundancy", "Deleting data", "Encrypting data"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c9", question: "What is the ACID property in databases?", options: ["A chemical property", "Atomicity, Consistency, Isolation, Durability", "A sorting rule", "A data type"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c10", question: "What is a greedy algorithm?", options: ["An algorithm that uses too much memory", "Makes locally optimal choices at each step", "A brute force approach", "A dynamic programming approach"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c11", question: "What is TCP/IP?", options: ["A programming language", "Network communication protocol", "A database", "A design pattern"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c12", question: "What is encapsulation in OOP?", options: ["Inheritance", "Bundling data and methods, hiding internals", "Polymorphism", "Abstraction only"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c13", question: "What is a design pattern?", options: ["UI design", "Reusable solution to common software problems", "A database schema", "A testing method"], correctAnswer: 1, xpReward: 10, subject: "cs", difficulty: "medium" },
    { id: "g12c14", question: "What is the CAP theorem?", options: ["A math theorem", "Consistency, Availability, Partition tolerance tradeoff", "A sorting theorem", "A networking rule"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g12c15", question: "What is the time complexity of Dijkstra's with min-heap?", options: ["O(V²)", "O((V+E)log V)", "O(VE)", "O(V log V)"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g12c16", question: "What is a B-tree used for?", options: ["Sorting", "Efficient disk-based data storage", "Hashing", "Graph traversal"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g12c17", question: "What is the NP-completeness?", options: ["Easy problems", "Problems verifiable in polynomial time but no known polynomial solution", "Unsolvable problems", "Linear problems"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g12c18", question: "What is a microservice architecture?", options: ["One big application", "Small independent services communicating via APIs", "A database type", "A frontend framework"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g12c19", question: "What is eventual consistency?", options: ["Always consistent", "System will become consistent given enough time", "Never consistent", "Immediately consistent"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
    { id: "g12c20", question: "What is the traveling salesman problem?", options: ["A sales strategy", "Finding shortest route visiting all cities exactly once", "A sorting problem", "A database query"], correctAnswer: 1, xpReward: 20, subject: "cs", difficulty: "hard" },
  ],
  flashcards: [
    { id: "g12f1", front: "What is an eigenvalue?", back: "λ such that Av = λv — a scalar that describes how a matrix scales a vector.", subject: "math" },
    { id: "g12f2", front: "What is E = mc²?", back: "Mass-energy equivalence: energy equals mass times speed of light squared.", subject: "science" },
    { id: "g12f3", front: "What is postmodernism?", back: "A literary movement that challenges traditional narratives, uses fragmentation, irony, and metafiction.", subject: "english" },
    { id: "g12f4", front: "What is the CAP theorem?", back: "A distributed system can provide at most 2 of 3: Consistency, Availability, Partition tolerance.", subject: "cs" },
    { id: "g12f5", front: "What is a Laplace transform?", back: "L{f(t)} = ∫₀^∞ f(t)e⁻ˢᵗ dt — converts time domain to frequency domain.", subject: "math" },
    { id: "g12f6", front: "What is wave-particle duality?", back: "Quantum objects exhibit both wave-like and particle-like properties depending on observation.", subject: "science" },
    { id: "g12f7", front: "What is the 'death of the author'?", back: "Roland Barthes' idea that the author's intentions should not limit a text's interpretation.", subject: "english" },
    { id: "g12f8", front: "What is NP-completeness?", back: "A class of problems where solutions can be verified quickly but no efficient solving algorithm is known.", subject: "cs" },
  ],
  matchPairs: [
    { id: "g12p1", term: "E = mc²", definition: "Mass-energy equivalence" },
    { id: "g12p2", term: "Eigenvalue", definition: "Matrix scaling factor" },
    { id: "g12p3", term: "CAP theorem", definition: "Distributed system tradeoff" },
    { id: "g12p4", term: "Postmodernism", definition: "Challenges traditional narrative" },
    { id: "g12p5", term: "SQL", definition: "Database query language" },
    { id: "g12p6", term: "Half-life", definition: "Time for half to decay" },
  ],
  scrambleWords: [
    { word: "EIGENVALUE", hint: "Scalar factor in matrix transformation", subject: "math" },
    { word: "RADIOACTIVE", hint: "Spontaneous nuclear emission", subject: "science" },
    { word: "POSTMODERN", hint: "Literary movement challenging traditions", subject: "english" },
    { word: "MICROSERVICE", hint: "Small independent software services", subject: "cs" },
    { word: "DIVERGENCE", hint: "Measures vector field spreading", subject: "math" },
    { word: "TRANSISTOR", hint: "Semiconductor device for switching", subject: "science" },
    { word: "INTERTEXTUAL", hint: "Relationship between texts", subject: "english" },
    { word: "NORMALIZATION", hint: "Reducing database redundancy", subject: "cs" },
  ],
};

export const gradeContent: Record<Grade, GradeContent> = {
  6: grade6,
  7: grade7,
  8: grade8,
  9: grade9,
  10: grade10,
  11: grade11,
  12: grade12,
};

// Keep backward compatibility - default to grade 8 for existing code
export const subjects = grade8.subjects;
export const quizQuestions = grade8.quizQuestions;

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

// Re-export Language and t from translations module
export type { Language } from "@/lib/translations";
export { t, getSubjectName } from "@/lib/translations";

