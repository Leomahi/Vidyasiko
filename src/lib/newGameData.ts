import { FillBlankQuestion } from "@/components/FillBlanksGame";
import { TrueFalseQuestion } from "@/components/TrueFalseGame";
import { SortChallenge } from "@/components/DragDropSortGame";
import { CrosswordClue } from "@/components/CrosswordGame";
import { Grade } from "./data";

// Grade-agnostic pool - questions are grouped loosely; components pick what's available
const fillBlanksPool: FillBlankQuestion[] = [
  // Math
  { id: "fb1", sentence: "The area of a rectangle is length ___ width.", answer: "×", options: ["×", "+", "-", "÷"], subject: "math" },
  { id: "fb2", sentence: "A triangle has ___ sides.", answer: "3", options: ["2", "3", "4", "5"], subject: "math" },
  { id: "fb3", sentence: "The square root of 144 is ___.", answer: "12", options: ["10", "11", "12", "14"], subject: "math" },
  { id: "fb4", sentence: "Pi (π) is approximately ___.", answer: "3.14", options: ["2.14", "3.14", "4.14", "3.41"], subject: "math" },
  { id: "fb5", sentence: "The sum of angles in a quadrilateral is ___°.", answer: "360", options: ["180", "270", "360", "450"], subject: "math" },
  // Science
  { id: "fb6", sentence: "Water is made of hydrogen and ___.", answer: "oxygen", options: ["nitrogen", "oxygen", "carbon", "helium"], subject: "science" },
  { id: "fb7", sentence: "The ___ is the powerhouse of the cell.", answer: "mitochondria", options: ["nucleus", "mitochondria", "ribosome", "membrane"], subject: "science" },
  { id: "fb8", sentence: "Light travels at approximately 3 × 10⁸ ___.", answer: "m/s", options: ["km/h", "m/s", "cm/s", "mph"], subject: "science" },
  { id: "fb9", sentence: "Photosynthesis converts CO₂ and water into glucose and ___.", answer: "oxygen", options: ["nitrogen", "oxygen", "hydrogen", "carbon"], subject: "science" },
  { id: "fb10", sentence: "The chemical symbol for gold is ___.", answer: "Au", options: ["Ag", "Au", "Go", "Gd"], subject: "science" },
  // English
  { id: "fb11", sentence: "A ___ is a word that describes a noun.", answer: "adjective", options: ["verb", "adjective", "adverb", "pronoun"], subject: "english" },
  { id: "fb12", sentence: "The past tense of 'run' is ___.", answer: "ran", options: ["runned", "ran", "running", "runs"], subject: "english" },
  { id: "fb13", sentence: "'Quickly' is an example of an ___.", answer: "adverb", options: ["adjective", "adverb", "noun", "pronoun"], subject: "english" },
  { id: "fb14", sentence: "A ___ is a figure of speech using 'like' or 'as'.", answer: "simile", options: ["metaphor", "simile", "hyperbole", "irony"], subject: "english" },
  { id: "fb15", sentence: "The plural of 'mouse' is ___.", answer: "mice", options: ["mouses", "mice", "mousen", "mouse"], subject: "english" },
  // CS
  { id: "fb16", sentence: "HTML stands for HyperText ___ Language.", answer: "Markup", options: ["Markup", "Machine", "Modern", "Multiple"], subject: "cs" },
  { id: "fb17", sentence: "In Python, ___ is used to define a function.", answer: "def", options: ["function", "def", "func", "define"], subject: "cs" },
  { id: "fb18", sentence: "CSS stands for Cascading ___ Sheets.", answer: "Style", options: ["Style", "System", "Script", "Source"], subject: "cs" },
  { id: "fb19", sentence: "JavaScript uses ___ to declare a constant variable.", answer: "const", options: ["var", "let", "const", "define"], subject: "cs" },
  { id: "fb20", sentence: "A ___ is a collection of key-value pairs in Python.", answer: "dictionary", options: ["list", "tuple", "dictionary", "set"], subject: "cs" },
];

const trueFalsePool: TrueFalseQuestion[] = [
  // Math
  { id: "tf1", statement: "The sum of interior angles of a triangle is 180°.", isTrue: true, explanation: "All triangles have interior angles summing to 180°.", subject: "math" },
  { id: "tf2", statement: "Zero is a positive number.", isTrue: false, explanation: "Zero is neither positive nor negative.", subject: "math" },
  { id: "tf3", statement: "Every square is a rectangle.", isTrue: true, explanation: "A square meets all criteria of a rectangle.", subject: "math" },
  { id: "tf4", statement: "1 is a prime number.", isTrue: false, explanation: "Prime numbers have exactly 2 factors. 1 has only 1 factor.", subject: "math" },
  { id: "tf5", statement: "The product of two negative numbers is positive.", isTrue: true, explanation: "Negative × negative = positive.", subject: "math" },
  // Science
  { id: "tf6", statement: "Sound travels faster in water than in air.", isTrue: true, explanation: "Sound travels about 4x faster in water than air.", subject: "science" },
  { id: "tf7", statement: "The Sun revolves around the Earth.", isTrue: false, explanation: "Earth revolves around the Sun.", subject: "science" },
  { id: "tf8", statement: "Diamonds are made of carbon.", isTrue: true, explanation: "Diamonds are a crystalline form of carbon.", subject: "science" },
  { id: "tf9", statement: "Humans have 4 chambers in their heart.", isTrue: true, explanation: "The human heart has 2 atria and 2 ventricles.", subject: "science" },
  { id: "tf10", statement: "Plants release carbon dioxide during photosynthesis.", isTrue: false, explanation: "Plants release oxygen during photosynthesis.", subject: "science" },
  // English
  { id: "tf11", statement: "A metaphor uses 'like' or 'as' for comparison.", isTrue: false, explanation: "That's a simile. Metaphors compare directly.", subject: "english" },
  { id: "tf12", statement: "'They're' is a contraction of 'they are'.", isTrue: true, explanation: "They're = they are.", subject: "english" },
  { id: "tf13", statement: "An adverb modifies a noun.", isTrue: false, explanation: "Adverbs modify verbs, adjectives, or other adverbs.", subject: "english" },
  { id: "tf14", statement: "A haiku has 5-7-5 syllables.", isTrue: true, explanation: "Traditional haiku follows the 5-7-5 syllable pattern.", subject: "english" },
  { id: "tf15", statement: "'Their', 'there', and 'they're' all mean the same thing.", isTrue: false, explanation: "They are homophones with different meanings.", subject: "english" },
  // CS
  { id: "tf16", statement: "HTML is a programming language.", isTrue: false, explanation: "HTML is a markup language, not a programming language.", subject: "cs" },
  { id: "tf17", statement: "Python is an interpreted language.", isTrue: true, explanation: "Python code is executed line by line by the interpreter.", subject: "cs" },
  { id: "tf18", statement: "RAM is permanent storage.", isTrue: false, explanation: "RAM is volatile; data is lost when power is off.", subject: "cs" },
  { id: "tf19", statement: "JavaScript can run in the browser.", isTrue: true, explanation: "JavaScript was originally designed for browsers.", subject: "cs" },
  { id: "tf20", statement: "An array index starts from 1 in most languages.", isTrue: false, explanation: "Most programming languages use 0-based indexing.", subject: "cs" },
];

const sortChallengesPool: SortChallenge[] = [
  { id: "sc1", instruction: "Sort these numbers from smallest to largest", items: ["42", "7", "15", "3", "28"], correctOrder: ["3", "7", "15", "28", "42"], subject: "math" },
  { id: "sc2", instruction: "Order the planets from closest to farthest from the Sun", items: ["Mars", "Mercury", "Earth", "Venus"], correctOrder: ["Mercury", "Venus", "Earth", "Mars"], subject: "science" },
  { id: "sc3", instruction: "Put these programming languages in order of creation (oldest first)", items: ["Python", "C", "JavaScript", "Java"], correctOrder: ["C", "Python", "Java", "JavaScript"], subject: "cs" },
  { id: "sc4", instruction: "Sort these fractions from smallest to largest", items: ["3/4", "1/2", "1/4", "1/8"], correctOrder: ["1/8", "1/4", "1/2", "3/4"], subject: "math" },
  { id: "sc5", instruction: "Order the steps of the water cycle", items: ["Precipitation", "Evaporation", "Condensation", "Collection"], correctOrder: ["Evaporation", "Condensation", "Precipitation", "Collection"], subject: "science" },
  { id: "sc6", instruction: "Sort by size: smallest to largest data unit", items: ["Gigabyte", "Byte", "Kilobyte", "Megabyte"], correctOrder: ["Byte", "Kilobyte", "Megabyte", "Gigabyte"], subject: "cs" },
  { id: "sc7", instruction: "Order these English tenses: Past → Present → Future", items: ["Will eat", "Ate", "Eating", "Eats"], correctOrder: ["Ate", "Eats", "Eating", "Will eat"], subject: "english" },
  { id: "sc8", instruction: "Sort these numbers in descending order", items: ["5", "99", "23", "67", "12"], correctOrder: ["99", "67", "23", "12", "5"], subject: "math" },
  { id: "sc9", instruction: "Order HTML document structure (top to bottom)", items: ["<body>", "<!DOCTYPE>", "<head>", "<html>"], correctOrder: ["<!DOCTYPE>", "<html>", "<head>", "<body>"], subject: "cs" },
  { id: "sc10", instruction: "Sort animals by average lifespan (shortest to longest)", items: ["Elephant", "Mouse", "Dog", "Turtle"], correctOrder: ["Mouse", "Dog", "Elephant", "Turtle"], subject: "science" },
];

const crosswordPool: CrosswordClue[] = [
  { id: "cw1", clue: "The result of addition", answer: "sum", direction: "across", subject: "math" },
  { id: "cw2", clue: "Gas we breathe in", answer: "oxygen", direction: "across", subject: "science" },
  { id: "cw3", clue: "A word that names a person, place, or thing", answer: "noun", direction: "down", subject: "english" },
  { id: "cw4", clue: "The brain of a computer (abbr.)", answer: "cpu", direction: "across", subject: "cs" },
  { id: "cw5", clue: "Shape with 4 equal sides", answer: "square", direction: "down", subject: "math" },
  { id: "cw6", clue: "Force that pulls objects toward Earth", answer: "gravity", direction: "across", subject: "science" },
  { id: "cw7", clue: "Past tense of 'go'", answer: "went", direction: "down", subject: "english" },
  { id: "cw8", clue: "Language used for web styling", answer: "css", direction: "across", subject: "cs" },
  { id: "cw9", clue: "Number of sides in a hexagon", answer: "six", direction: "down", subject: "math" },
  { id: "cw10", clue: "Smallest unit of an element", answer: "atom", direction: "across", subject: "science" },
  { id: "cw11", clue: "A comparison using 'like' or 'as'", answer: "simile", direction: "across", subject: "english" },
  { id: "cw12", clue: "Popular programming language named after a snake", answer: "python", direction: "down", subject: "cs" },
  { id: "cw13", clue: "The number you divide by", answer: "divisor", direction: "across", subject: "math" },
  { id: "cw14", clue: "Process by which plants make food", answer: "photosynthesis", direction: "across", subject: "science" },
  { id: "cw15", clue: "A word opposite in meaning to another", answer: "antonym", direction: "down", subject: "english" },
];

export function getNewGameData(grade: Grade) {
  // All grades get the same pool for now; content is universal
  return {
    fillBlanks: fillBlanksPool,
    trueFalse: trueFalsePool,
    sortChallenges: sortChallengesPool,
    crosswordClues: crosswordPool,
  };
}
