export type Language = "en" | "hi" | "ta" | "te" | "kn" | "ml" | "mr";

export const languageMeta: Record<Language, { flag: string; label: string; nativeName: string }> = {
  en: { flag: "🇬🇧", label: "EN", nativeName: "English" },
  hi: { flag: "🇮🇳", label: "हिं", nativeName: "हिन्दी" },
  ta: { flag: "🇮🇳", label: "த", nativeName: "தமிழ்" },
  te: { flag: "🇮🇳", label: "తె", nativeName: "తెలుగు" },
  kn: { flag: "🇮🇳", label: "ಕ", nativeName: "ಕನ್ನಡ" },
  ml: { flag: "🇮🇳", label: "മ", nativeName: "മലയാളം" },
  mr: { flag: "🇮🇳", label: "म", nativeName: "मराठी" },
};

export const translations: Record<string, Record<Language, string>> = {
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", ta: "டாஷ்போர்டு", te: "డాష్‌బోర్డ్", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", ml: "ഡാഷ്‌ബോർഡ്", mr: "डॅशबोर्ड" },
  subjects: { en: "Subjects", hi: "विषय", ta: "பாடங்கள்", te: "విషయాలు", kn: "ವಿಷಯಗಳು", ml: "വിഷയങ്ങൾ", mr: "विषय" },
  leaderboard: { en: "Leaderboard", hi: "लीडरबोर्ड", ta: "தரவரிசை", te: "లీడర్‌బోర్డ్", kn: "ಲೀಡರ್‌ಬೋರ್ಡ್", ml: "ലീഡർബോർഡ്", mr: "लीडरबोर्ड" },
  quiz: { en: "Start Quiz", hi: "क्विज़ शुरू करें", ta: "வினாடி வினா", te: "క్విజ్ ప్రారంభించు", kn: "ಕ್ವಿಜ್ ಪ್ರಾರಂಭಿಸಿ", ml: "ക്വിസ് ആരംഭിക്കുക", mr: "क्विझ सुरू करा" },
  xp: { en: "XP Points", hi: "एक्सपी अंक", ta: "XP புள்ளிகள்", te: "XP పాయింట్లు", kn: "XP ಅಂಕಗಳು", ml: "XP പോയിന്റുകൾ", mr: "XP गुण" },
  streak: { en: "Day Streak", hi: "दिन की लकीर", ta: "நாள் தொடர்", te: "రోజుల స్ట్రీక్", kn: "ದಿನ ಸ್ಟ್ರೀಕ್", ml: "ദിവസ സ്ട്രീക്ക്", mr: "दिवस स्ट्रीक" },
  level: { en: "Level", hi: "स्तर", ta: "நிலை", te: "స్థాయి", kn: "ಮಟ್ಟ", ml: "ലെവൽ", mr: "पातळी" },
  offline: { en: "Offline Ready", hi: "ऑफलाइन तैयार", ta: "ஆஃப்லைன் தயார்", te: "ఆఫ్‌లైన్ రెడీ", kn: "ಆಫ್‌ಲೈನ್ ರೆಡಿ", ml: "ഓഫ്‌ലൈൻ റെഡി", mr: "ऑफलाइन तयार" },
  teacher: { en: "Teacher View", hi: "शिक्षक दृश्य", ta: "ஆசிரியர் காட்சி", te: "ఉపాధ్యాయ వీక్షణ", kn: "ಶಿಕ್ಷಕ ವೀಕ್ಷಣೆ", ml: "അധ്യാപക വ്യൂ", mr: "शिक्षक दृश्य" },
  badges: { en: "Badges", hi: "बैज", ta: "பதக்கங்கள்", te: "బ్యాడ్జ్‌లు", kn: "ಬ್ಯಾಡ್ಜ್‌ಗಳು", ml: "ബാഡ്ജുകൾ", mr: "बॅज" },
  progress: { en: "Progress", hi: "प्रगति", ta: "முன்னேற்றம்", te: "పురోగతి", kn: "ಪ್ರಗತಿ", ml: "പുരോഗതി", mr: "प्रगती" },
  lessons: { en: "lessons completed", hi: "पाठ पूरे हुए", ta: "பாடங்கள் நிறைவு", te: "పాఠాలు పూర్తయ్యాయి", kn: "ಪಾಠಗಳು ಪೂರ್ಣ", ml: "പാഠങ്ങൾ പൂർത്തിയായി", mr: "धडे पूर्ण" },
  rank: { en: "Rank", hi: "रैंक", ta: "தரம்", te: "ర్యాంక్", kn: "ರ್ಯಾಂಕ್", ml: "റാങ്ക്", mr: "रँक" },
  correct: { en: "Correct! 🎉", hi: "सही! 🎉", ta: "சரி! 🎉", te: "సరైనది! 🎉", kn: "ಸರಿ! 🎉", ml: "ശരി! 🎉", mr: "बरोबर! 🎉" },
  wrong: { en: "Try again! 💪", hi: "फिर कोशिश करो! 💪", ta: "மீண்டும் முயற்சி! 💪", te: "మళ్ళీ ప్రయత్నించు! 💪", kn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ! 💪", ml: "വീണ്ടും ശ്രമിക്കൂ! 💪", mr: "पुन्हा प्रयत्न करा! 💪" },
  next: { en: "Next Question", hi: "अगला सवाल", ta: "அடுத்த கேள்வி", te: "తదుపరి ప్రశ్న", kn: "ಮುಂದಿನ ಪ್ರಶ್ನೆ", ml: "അടുത്ത ചോദ്യം", mr: "पुढील प्रश्न" },
  analytics: { en: "Analytics", hi: "विश्लेषण", ta: "பகுப்பாய்வு", te: "విశ్లేషణ", kn: "ವಿಶ್ಲೇಷಣೆ", ml: "വിശകലനം", mr: "विश्लेषण" },
  grade: { en: "Grade", hi: "कक्षा", ta: "வகுப்பு", te: "తరగతి", kn: "ತರಗತಿ", ml: "ക്ലാസ്", mr: "इयत्ता" },
  hello: { en: "Hello", hi: "नमस्ते", ta: "வணக்கம்", te: "నమస్కారం", kn: "ನಮಸ್ಕಾರ", ml: "നമസ്കാരം", mr: "नमस्कार" },
  quizGames: { en: "Quiz Games 🧠", hi: "क्विज़ खेल 🧠", ta: "வினாடி விளையாட்டு 🧠", te: "క్విజ్ ఆటలు 🧠", kn: "ಕ್ವಿಜ್ ಆಟಗಳು 🧠", ml: "ക്വിസ് ഗെയിമുകൾ 🧠", mr: "क्विझ खेळ 🧠" },
  moreGames: { en: "More Games 🎮", hi: "और खेल 🎮", ta: "மேலும் விளையாட்டுகள் 🎮", te: "మరిన్ని ఆటలు 🎮", kn: "ಹೆಚ್ಚಿನ ಆಟಗಳು 🎮", ml: "കൂടുതൽ ഗെയിമുകൾ 🎮", mr: "अधिक खेळ 🎮" },
  flashcards: { en: "Flashcards", hi: "फ्लैशकार्ड", ta: "ஃபிளாஷ்கார்டுகள்", te: "ఫ్లాష్‌కార్డ్‌లు", kn: "ಫ್ಲ್ಯಾಷ್‌ಕಾರ್ಡ್‌ಗಳು", ml: "ഫ്ലാഷ്‌കാർഡുകൾ", mr: "फ्लॅशकार्ड" },
  matchGame: { en: "Match Game", hi: "मैच गेम", ta: "பொருத்தம்", te: "మ్యాచ్ గేమ్", kn: "ಹೊಂದಿಸಿ ಆಟ", ml: "മാച്ച് ഗെയിം", mr: "जुळवा खेळ" },
  wordScramble: { en: "Word Scramble", hi: "शब्द पहेली", ta: "சொல் புதிர்", te: "పద పజిల్", kn: "ಪದ ಒಗಟು", ml: "വാക്ക് പസിൽ", mr: "शब्द कोडे" },
  fillBlanks: { en: "Fill in the Blanks", hi: "रिक्त स्थान भरें", ta: "வெற்றிடம் நிரப்பு", te: "ఖాళీలను పూరించండి", kn: "ಖಾಲಿ ತುಂಬಿ", ml: "ശൂന്യസ്ഥലം പൂരിപ്പിക്കുക", mr: "रिकाम्या जागा भरा" },
  trueFalse: { en: "True or False", hi: "सही या गलत", ta: "சரியா தவறா", te: "నిజం లేదా అబద్ధం", kn: "ಸರಿ ಅಥವಾ ತಪ್ಪು", ml: "ശരിയോ തെറ്റോ", mr: "खरे की खोटे" },
  sortingGame: { en: "Sorting Game", hi: "क्रम खेल", ta: "வரிசை விளையாட்டு", te: "క్రమ ఆట", kn: "ವಿಂಗಡಣೆ ಆಟ", ml: "ക്രമീകരണ ഗെയിം", mr: "क्रमवारी खेळ" },
  crossword: { en: "Crossword", hi: "वर्ग पहेली", ta: "குறுக்கெழுத்து", te: "క్రాస్‌వర్డ్", kn: "ಕ್ರಾಸ್‌ವರ್ಡ್", ml: "ക്രോസ്‌വേഡ്", mr: "शब्दकोडे" },
  chooseSubTopic: { en: "Choose a Sub-Topic", hi: "उप-विषय चुनें", ta: "துணை பொருளைத் தேர்ந்தெடுக்கவும்", te: "ఉప-అంశాన్ని ఎంచుకోండి", kn: "ಉಪ-ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ", ml: "ഉപ-വിഷയം തിരഞ്ഞെടുക്കുക", mr: "उप-विषय निवडा" },
  mixed: { en: "Mixed", hi: "मिश्रित", ta: "கலப்பு", te: "మిశ్రమ", kn: "ಮಿಶ್ರ", ml: "മിശ്രിതം", mr: "मिश्र" },
  allSubjects: { en: "All subjects", hi: "सभी विषय", ta: "அனைத்து பாடங்கள்", te: "అన్ని విషయాలు", kn: "ಎಲ್ಲಾ ವಿಷಯಗಳು", ml: "എല്ലാ വിഷയങ്ങളും", mr: "सर्व विषय" },
  questions: { en: "questions", hi: "सवाल", ta: "கேள்விகள்", te: "ప్రశ్నలు", kn: "ಪ್ರಶ್ನೆಗಳು", ml: "ചോദ്യങ്ങൾ", mr: "प्रश्न" },
  cardsToReview: { en: "cards to review", hi: "कार्ड समीक्षा करें", ta: "அட்டைகள்", te: "కార్డులు", kn: "ಕಾರ್ಡ್‌ಗಳು", ml: "കാർഡുകൾ", mr: "कार्ड" },
  pairsToMatch: { en: "pairs to match", hi: "जोड़ी मिलाएं", ta: "ஜோடிகள்", te: "జతలు", kn: "ಜೋಡಿಗಳು", ml: "ജോഡികൾ", mr: "जोड्या" },
  wordsToUnscramble: { en: "words to unscramble", hi: "शब्द सुलझाएं", ta: "சொற்கள்", te: "పదాలు", kn: "ಪದಗಳು", ml: "വാക്കുകൾ", mr: "शब्द" },
};

// Subject name translations by ID
export const subjectNames: Record<string, Record<Language, string>> = {
  math: { en: "Mathematics", hi: "गणित", ta: "கணிதம்", te: "గణితం", kn: "ಗಣಿತ", ml: "ഗണിതം", mr: "गणित" },
  science: { en: "Science", hi: "विज्ञान", ta: "அறிவியல்", te: "సైన్స్", kn: "ವಿಜ್ಞಾನ", ml: "ശാസ്ത്രം", mr: "विज्ञान" },
  english: { en: "English", hi: "अंग्रेज़ी", ta: "ஆங்கிலம்", te: "ఆంగ్లం", kn: "ಇಂಗ್ಲಿಷ್", ml: "ഇംഗ്ലീഷ്", mr: "इंग्रजी" },
  cs: { en: "Computer Science", hi: "कंप्यूटर विज्ञान", ta: "கணினி அறிவியல்", te: "కంప్యూటర్ సైన్స్", kn: "ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ", ml: "കമ്പ്യൂട്ടർ സയൻസ്", mr: "संगणक शास्त्र" },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}

export function getSubjectName(subjectId: string, subjectName: string, lang: Language): string {
  return subjectNames[subjectId]?.[lang] ?? subjectName;
}
