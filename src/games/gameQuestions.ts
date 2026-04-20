import { CanvasMCQ } from "./_shared/gameUtils";

/**
 * Game question banks ported from the original Flask STEM games (shikshasetu).
 * Each game gets its own bank with translations across all 7 languages.
 * Falls back to English when a translation is missing.
 */

// PHYSICS — Arcade & Shooter
export const physicsQuestions: CanvasMCQ[] = [
  {
    q: "What is the SI unit of force?",
    choices: ["Newton", "Joule", "Watt", "Pascal"],
    answer: 0,
    i18n: {
      hi: { q: "बल का SI मात्रक क्या है?", choices: ["न्यूटन", "जूल", "वाट", "पास्कल"] },
      ta: { q: "விசையின் SI அலகு என்ன?", choices: ["நியூட்டன்", "ஜூல்", "வாட்", "பாஸ்கல்"] },
      te: { q: "బలానికి SI యూనిట్ ఏది?", choices: ["న్యూటన్", "జౌల్", "వాట్", "పాస్కల్"] },
      kn: { q: "ಬಲದ SI ಘಟಕ ಯಾವುದು?", choices: ["ನ್ಯೂಟನ್", "ಜೌಲ್", "ವಾಟ್", "ಪಾಸ್ಕಲ್"] },
      ml: { q: "ബലത്തിന്റെ SI യൂണിറ്റ് എന്താണ്?", choices: ["ന്യൂട്ടൺ", "ജൂൾ", "വാട്ട്", "പാസ്കൽ"] },
      mr: { q: "बलाचे SI एकक काय आहे?", choices: ["न्यूटन", "ज्यूल", "वॅट", "पास्कल"] },
    },
  },
  {
    q: "Acceleration due to gravity on Earth (approx)?",
    choices: ["9.8 m/s²", "8.9 m/s²", "10.8 m/s²", "9.0 m/s²"],
    answer: 0,
    i18n: {
      hi: { q: "पृथ्वी पर गुरुत्वीय त्वरण लगभग?", choices: ["9.8 m/s²", "8.9 m/s²", "10.8 m/s²", "9.0 m/s²"] },
      ta: { q: "புவியில் ஈர்ப்பு முடுக்கம் சுமார்?", choices: ["9.8 m/s²", "8.9 m/s²", "10.8 m/s²", "9.0 m/s²"] },
    },
  },
  { q: "Speed = ?", choices: ["Distance / Time", "Force × Mass", "Mass / Time", "Time × Distance"], answer: 0,
    i18n: { hi: { q: "गति = ?", choices: ["दूरी / समय", "बल × द्रव्यमान", "द्रव्यमान / समय", "समय × दूरी"] } } },
  { q: "Light is a form of?", choices: ["Energy", "Matter", "Force", "Pressure"], answer: 0,
    i18n: { hi: { q: "प्रकाश किसका रूप है?", choices: ["ऊर्जा", "पदार्थ", "बल", "दाब"] } } },
  { q: "Which has more inertia?", choices: ["Truck", "Bicycle", "Pen", "Feather"], answer: 0,
    i18n: { hi: { q: "किसमें अधिक जड़त्व है?", choices: ["ट्रक", "साइकिल", "पेन", "पंख"] } } },
  { q: "Sound cannot travel through?", choices: ["Vacuum", "Air", "Water", "Iron"], answer: 0,
    i18n: { hi: { q: "ध्वनि किसमें नहीं चल सकती?", choices: ["निर्वात", "हवा", "पानी", "लोहा"] } } },
  { q: "Unit of work?", choices: ["Joule", "Newton", "Watt", "Volt"], answer: 0,
    i18n: { hi: { q: "कार्य की इकाई?", choices: ["जूल", "न्यूटन", "वाट", "वोल्ट"] } } },
  { q: "Power = ?", choices: ["Work / Time", "Force × Distance", "Mass × Acc.", "Energy × Time"], answer: 0,
    i18n: { hi: { q: "शक्ति = ?", choices: ["कार्य / समय", "बल × दूरी", "द्रव्यमान × त्वरण", "ऊर्जा × समय"] } } },
  { q: "Refractive index of vacuum?", choices: ["1", "0", "1.33", "1.5"], answer: 0,
    i18n: { hi: { q: "निर्वात का अपवर्तनांक?", choices: ["1", "0", "1.33", "1.5"] } } },
  { q: "Which device measures current?", choices: ["Ammeter", "Voltmeter", "Barometer", "Thermometer"], answer: 0,
    i18n: { hi: { q: "धारा मापने का यंत्र?", choices: ["ऐमीटर", "वोल्टमीटर", "बैरोमीटर", "थर्मामीटर"] } } },
];

// CHEMISTRY — Lab & Heist
export const chemistryQuestions: CanvasMCQ[] = [
  { q: "Symbol for Sodium?", choices: ["Na", "S", "So", "N"], answer: 0,
    i18n: { hi: { q: "सोडियम का प्रतीक?", choices: ["Na", "S", "So", "N"] } } },
  { q: "pH of pure water?", choices: ["7", "0", "14", "1"], answer: 0,
    i18n: { hi: { q: "शुद्ध जल का pH?", choices: ["7", "0", "14", "1"] } } },
  { q: "H₂O is?", choices: ["Water", "Hydrogen peroxide", "Oxygen", "Hydroxide"], answer: 0,
    i18n: { hi: { q: "H₂O क्या है?", choices: ["पानी", "हाइड्रोजन पेरॉक्साइड", "ऑक्सीजन", "हाइड्रॉक्साइड"] } } },
  { q: "Atomic number of Carbon?", choices: ["6", "12", "8", "14"], answer: 0,
    i18n: { hi: { q: "कार्बन का परमाणु क्रमांक?", choices: ["6", "12", "8", "14"] } } },
  { q: "Acid turns blue litmus to?", choices: ["Red", "Green", "Yellow", "Blue"], answer: 0,
    i18n: { hi: { q: "अम्ल नीले लिटमस को बनाता है?", choices: ["लाल", "हरा", "पीला", "नीला"] } } },
  { q: "Most abundant gas in air?", choices: ["Nitrogen", "Oxygen", "CO₂", "Argon"], answer: 0,
    i18n: { hi: { q: "वायु में सर्वाधिक गैस?", choices: ["नाइट्रोजन", "ऑक्सीजन", "CO₂", "आर्गन"] } } },
  { q: "NaCl is commonly known as?", choices: ["Salt", "Sugar", "Soda", "Acid"], answer: 0,
    i18n: { hi: { q: "NaCl को कहते हैं?", choices: ["नमक", "चीनी", "सोडा", "अम्ल"] } } },
  { q: "Number of electrons in oxygen?", choices: ["8", "6", "10", "16"], answer: 0,
    i18n: { hi: { q: "ऑक्सीजन में इलेक्ट्रॉन?", choices: ["8", "6", "10", "16"] } } },
  { q: "Lightest element?", choices: ["Hydrogen", "Helium", "Lithium", "Carbon"], answer: 0,
    i18n: { hi: { q: "सबसे हल्का तत्व?", choices: ["हाइड्रोजन", "हीलियम", "लिथियम", "कार्बन"] } } },
  { q: "Chemical formula of Methane?", choices: ["CH₄", "CO₂", "C₂H₆", "CH₃"], answer: 0,
    i18n: { hi: { q: "मीथेन का सूत्र?", choices: ["CH₄", "CO₂", "C₂H₆", "CH₃"] } } },
];

// BIOLOGY — Defence & DNA
export const biologyQuestions: CanvasMCQ[] = [
  { q: "Powerhouse of the cell?", choices: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"], answer: 0,
    i18n: { hi: { q: "कोशिका का पावरहाउस?", choices: ["माइटोकॉन्ड्रिया", "केन्द्रक", "राइबोसोम", "क्लोरोप्लास्ट"] } } },
  { q: "DNA stands for?", choices: ["Deoxyribonucleic acid", "Dynamic neural acid", "Direct nuclear atom", "Double natural amino"], answer: 0 },
  { q: "Number of chromosomes in humans?", choices: ["46", "23", "44", "48"], answer: 0,
    i18n: { hi: { q: "मनुष्य में गुणसूत्रों की संख्या?", choices: ["46", "23", "44", "48"] } } },
  { q: "Plants make food via?", choices: ["Photosynthesis", "Respiration", "Digestion", "Osmosis"], answer: 0,
    i18n: { hi: { q: "पौधे भोजन बनाते हैं द्वारा?", choices: ["प्रकाश संश्लेषण", "श्वसन", "पाचन", "परासरण"] } } },
  { q: "Largest organ in the human body?", choices: ["Skin", "Liver", "Brain", "Heart"], answer: 0,
    i18n: { hi: { q: "मानव शरीर का सबसे बड़ा अंग?", choices: ["त्वचा", "यकृत", "मस्तिष्क", "हृदय"] } } },
  { q: "Red Blood Cells carry?", choices: ["Oxygen", "Glucose", "Water", "Hormones"], answer: 0 },
  { q: "Universal donor blood group?", choices: ["O-", "AB+", "A+", "B-"], answer: 0 },
  { q: "Which vitamin from sunlight?", choices: ["D", "A", "C", "K"], answer: 0,
    i18n: { hi: { q: "सूर्य से कौन सा विटामिन?", choices: ["D", "A", "C", "K"] } } },
  { q: "Heart has how many chambers?", choices: ["4", "2", "3", "5"], answer: 0 },
  { q: "Smallest unit of life?", choices: ["Cell", "Atom", "Tissue", "Organ"], answer: 0,
    i18n: { hi: { q: "जीवन की सबसे छोटी इकाई?", choices: ["कोशिका", "परमाणु", "ऊतक", "अंग"] } } },
];

// MATHS — Ninja, Laser, Cannon, Mission, Calculus Coaster
export const mathsQuestions: CanvasMCQ[] = [
  { q: "12 × 8 = ?", choices: ["96", "84", "108", "98"], answer: 0 },
  { q: "Square root of 169?", choices: ["13", "12", "14", "11"], answer: 0,
    i18n: { hi: { q: "169 का वर्गमूल?", choices: ["13", "12", "14", "11"] } } },
  { q: "Sum of angles in a triangle?", choices: ["180°", "360°", "90°", "270°"], answer: 0,
    i18n: { hi: { q: "त्रिभुज के कोणों का योग?", choices: ["180°", "360°", "90°", "270°"] } } },
  { q: "Value of π (approx)?", choices: ["3.14", "2.72", "1.62", "1.41"], answer: 0 },
  { q: "Solve: 2x + 6 = 18, x = ?", choices: ["6", "4", "8", "12"], answer: 0,
    i18n: { hi: { q: "2x + 6 = 18, x = ?", choices: ["6", "4", "8", "12"] } } },
  { q: "15% of 200?", choices: ["30", "20", "25", "35"], answer: 0 },
  { q: "Area of circle (radius r)?", choices: ["πr²", "2πr", "πd", "r²"], answer: 0 },
  { q: "Derivative of x²?", choices: ["2x", "x", "x²/2", "2"], answer: 0 },
  { q: "Integral of 1?", choices: ["x + C", "1", "0", "x²"], answer: 0 },
  { q: "log₁₀(1000)?", choices: ["3", "10", "100", "2"], answer: 0 },
  { q: "Fibonacci: 1,1,2,3,5,8, ?", choices: ["13", "11", "12", "10"], answer: 0 },
  { q: "Quadratic formula discriminant?", choices: ["b²-4ac", "2a", "-b/2a", "ac"], answer: 0 },
];

// PYTHON — Fill, Debug, Drag
export const pythonQuestions: CanvasMCQ[] = [
  { q: "Keyword to define a function?", choices: ["def", "function", "func", "define"], answer: 0 },
  { q: "Which is a Python list?", choices: ["[1,2,3]", "(1,2,3)", "{1,2,3}", "<1,2,3>"], answer: 0 },
  { q: "Output of: print(2 ** 3)", choices: ["8", "6", "9", "23"], answer: 0 },
  { q: "Comment in Python starts with?", choices: ["#", "//", "/*", "--"], answer: 0 },
  { q: "Convert string to int?", choices: ["int(s)", "str(s)", "float(s)", "list(s)"], answer: 0 },
  { q: "Length of list l?", choices: ["len(l)", "l.length", "size(l)", "l.size()"], answer: 0 },
  { q: "Loop keyword for known iterations?", choices: ["for", "while", "do", "loop"], answer: 0 },
  { q: "Boolean values in Python?", choices: ["True/False", "true/false", "1/0", "yes/no"], answer: 0 },
  { q: "Dictionary syntax?", choices: ["{'a': 1}", "['a',1]", "('a',1)", "<a:1>"], answer: 0 },
  { q: "Module to work with random?", choices: ["random", "math", "rand", "system"], answer: 0 },
  { q: "What does len('hello') return?", choices: ["5", "4", "6", "0"], answer: 0 },
  { q: "Indentation in Python is?", choices: ["Required", "Optional", "Forbidden", "Decorative"], answer: 0 },
];

export const gameQuestionBanks: Record<string, CanvasMCQ[]> = {
  physics: physicsQuestions,
  chemistry: chemistryQuestions,
  biology: biologyQuestions,
  maths: mathsQuestions,
  python: pythonQuestions,
};
