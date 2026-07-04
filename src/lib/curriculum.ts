import { Grade } from "@/lib/data";

export type CurriculumSubjectId = "physics" | "chemistry" | "biology" | "maths" | "cs";

export interface Topic {
  id: string;
  name: string;
  concept: string; // short lesson text
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface CurriculumSubject {
  id: CurriculumSubjectId;
  name: string;
  icon: string;
  /** Subject id used by the existing QuizQuestion.subject field. */
  quizSubjectId: string;
  /** Subject id used by the OriginalGameShell engine. */
  gameSubject: "physics" | "chemistry" | "biology" | "maths" | "python";
  color: string;
}

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  { id: "physics",   name: "Physics",          icon: "⚡",  quizSubjectId: "science", gameSubject: "physics",   color: "from-cyan-500/20 to-cyan-500/5" },
  { id: "chemistry", name: "Chemistry",        icon: "🧪", quizSubjectId: "science", gameSubject: "chemistry", color: "from-purple-500/20 to-purple-500/5" },
  { id: "biology",   name: "Biology",          icon: "🧬", quizSubjectId: "science", gameSubject: "biology",   color: "from-emerald-500/20 to-emerald-500/5" },
  { id: "maths",     name: "Mathematics",      icon: "📐", quizSubjectId: "math",    gameSubject: "maths",     color: "from-amber-500/20 to-amber-500/5" },
  { id: "cs",        name: "Computer Science", icon: "💻", quizSubjectId: "cs",      gameSubject: "python",    color: "from-green-500/20 to-green-500/5" },
];

/** Compact helper — builds a chapter with N topics. */
const ch = (id: string, name: string, topics: [string, string, string][]): Chapter => ({
  id,
  name,
  topics: topics.map(([tid, tname, concept]) => ({ id: `${id}-${tid}`, name: tname, concept })),
});

/**
 * NCERT-inspired chapter/topic tree per subject × grade (6–12).
 * Kept intentionally compact: 2 chapters × 3 topics per subject-grade.
 */
export const CURRICULUM: Record<CurriculumSubjectId, Record<Grade, Chapter[]>> = {
  physics: {
    6: [
      ch("motion", "Motion & Measurement", [
        ["length", "Measuring Length", "Length is measured with a ruler in metres. 100 cm = 1 m; 1000 m = 1 km. Always align the zero mark with the start of the object."],
        ["rest", "Rest and Motion", "An object is in motion when its position changes with time; otherwise it is at rest. Motion is relative to a reference point."],
        ["types", "Types of Motion", "Motion can be linear (straight line), circular (round a centre), or periodic (repeats — like a pendulum)."],
      ]),
      ch("light", "Light, Shadows & Reflection", [
        ["sources", "Luminous vs Non-luminous", "Luminous objects give out their own light (sun, bulb). Non-luminous objects only reflect light (moon, book)."],
        ["shadows", "How Shadows Form", "A shadow forms when an opaque object blocks light. Its size depends on distance from the source."],
        ["reflection", "Reflection in Mirrors", "A plane mirror produces an image that is upright, same size, and laterally inverted."],
      ]),
    ],
    7: [
      ch("heat", "Heat", [
        ["temp", "Temperature", "Temperature measures how hot or cold something is. It is measured with a thermometer in °C."],
        ["transfer", "Heat Transfer", "Heat flows from hotter to cooler bodies by conduction (solids), convection (fluids), and radiation (no medium needed)."],
        ["expansion", "Thermal Expansion", "Most substances expand when heated. This is why gaps are left in railway tracks."],
      ]),
      ch("electricity", "Electric Current", [
        ["circuit", "Simple Circuits", "An electric circuit needs a cell, wires, and a device. Current flows only in a closed loop."],
        ["symbols", "Circuit Symbols", "Each component has a standard symbol — cell, bulb, switch, wire — used to draw circuit diagrams."],
        ["heating", "Heating Effect", "When current flows through a wire it heats up. This is the basis of bulbs and heaters."],
      ]),
    ],
    8: [
      ch("force", "Force & Pressure", [
        ["force", "What is Force?", "Force is a push or pull that can change speed, direction, or shape of an object."],
        ["pressure", "Pressure", "Pressure = Force / Area. A sharp knife cuts easily because area is tiny, so pressure is huge."],
        ["friction", "Friction", "Friction opposes motion between two surfaces in contact. Rough surfaces have more friction."],
      ]),
      ch("sound", "Sound", [
        ["vibration", "Sound is Vibration", "Sound is produced by vibrating objects and travels as a wave through a medium (solid, liquid, gas)."],
        ["pitch", "Pitch & Loudness", "Pitch depends on frequency; loudness depends on amplitude."],
        ["noise", "Noise Pollution", "Unwanted, loud sound is noise. Prolonged exposure can damage hearing."],
      ]),
    ],
    9: [
      ch("motion9", "Motion & Laws", [
        ["kinematics", "Distance, Speed, Velocity", "Distance is total path; displacement is shortest. Speed = distance/time; velocity is speed with direction."],
        ["newton", "Newton's Laws", "1st: inertia. 2nd: F = m × a. 3rd: every action has an equal, opposite reaction."],
        ["gravity", "Gravitation", "Every mass attracts every other mass. On Earth, g ≈ 9.8 m/s²."],
      ]),
      ch("work9", "Work, Energy & Power", [
        ["work", "Work", "Work = Force × Displacement (in the direction of the force). Unit: joule."],
        ["energy", "Forms of Energy", "Kinetic (motion) and potential (position). Energy is conserved — it changes form but total stays the same."],
        ["power", "Power", "Power is the rate of doing work: P = W / t. Unit: watt."],
      ]),
    ],
    10: [
      ch("light10", "Light — Reflection & Refraction", [
        ["mirrors", "Spherical Mirrors", "Concave mirrors converge light; convex diverge. Used in headlights and rear-view mirrors respectively."],
        ["refraction", "Refraction", "Light bends when passing between media of different densities. Governed by Snell's law."],
        ["lens", "Lenses", "Convex lenses converge; concave diverge. Used in spectacles, cameras, telescopes."],
      ]),
      ch("electricity10", "Electricity", [
        ["ohm", "Ohm's Law", "V = I × R. Resistance is measured in ohms (Ω)."],
        ["series", "Series & Parallel", "In series, current is same and voltages add. In parallel, voltage is same and currents add."],
        ["power10", "Electric Power", "P = V × I. Energy consumed = P × t (kWh)."],
      ]),
    ],
    11: [
      ch("mech11", "Mechanics", [
        ["vectors", "Vectors", "Quantities with magnitude and direction. Added tip-to-tail or by components."],
        ["projectile", "Projectile Motion", "Horizontal + vertical motion combined. Range = u²sin(2θ)/g."],
        ["circular", "Circular Motion", "Centripetal acceleration a = v²/r keeps a body moving on a circle."],
      ]),
      ch("thermo11", "Thermodynamics", [
        ["laws", "Laws of Thermodynamics", "0th: thermal equilibrium. 1st: ΔU = Q − W. 2nd: entropy of an isolated system never decreases."],
        ["heatcap", "Heat Capacity", "Q = m × c × ΔT. Water has a very high specific heat capacity."],
        ["engines", "Heat Engines", "Convert heat into work. Efficiency is always < 100% (Carnot limit)."],
      ]),
    ],
    12: [
      ch("emag12", "Electromagnetism", [
        ["coulomb", "Coulomb's Law", "Force between charges: F = k q₁q₂ / r²."],
        ["magnetism", "Magnetic Fields", "Moving charges create magnetic fields. A wire in a field feels a force F = BIL."],
        ["induction", "EM Induction", "A changing magnetic flux induces an EMF (Faraday's law). Basis of generators."],
      ]),
      ch("modern12", "Modern Physics", [
        ["photo", "Photoelectric Effect", "Light of high-enough frequency ejects electrons from a metal. Evidence that light is quantised (photons)."],
        ["atom", "Atomic Models", "Bohr's model: electrons orbit in fixed energy levels. Transitions emit or absorb photons."],
        ["nuclear", "Nuclear Physics", "Radioactive decay: α, β, γ. E = mc² relates mass and energy."],
      ]),
    ],
  },
  chemistry: {
    6: [
      ch("matter6", "Materials Around Us", [
        ["sorting", "Sorting Materials", "Materials are grouped by properties: hard/soft, transparent/opaque, soluble/insoluble."],
        ["states", "States of Matter", "Solids have fixed shape; liquids take shape of container; gases fill any space."],
        ["water", "Water & Solutions", "A solution is formed when a solute dissolves in a solvent. Salt water is a solution."],
      ]),
      ch("changes6", "Changes Around Us", [
        ["physical", "Physical Changes", "Reversible; no new substance (melting ice, tearing paper)."],
        ["chemical", "Chemical Changes", "Usually irreversible; a new substance forms (burning, rusting)."],
        ["fast", "Fast vs Slow", "Some changes are fast (explosion), some slow (rusting, ripening)."],
      ]),
    ],
    7: [
      ch("acids7", "Acids, Bases & Salts", [
        ["acid", "Acids", "Taste sour, turn blue litmus red. Examples: lemon juice, vinegar."],
        ["base", "Bases", "Taste bitter, feel soapy, turn red litmus blue. Examples: baking soda, soap."],
        ["neutral", "Neutralisation", "Acid + Base → Salt + Water. Used to treat acidity and bee stings."],
      ]),
      ch("fibre7", "Fibre to Fabric", [
        ["natural", "Natural Fibres", "Cotton, jute, wool, silk come from plants or animals."],
        ["synthetic", "Synthetic Fibres", "Nylon, polyester are man-made from petrochemicals — strong and cheap."],
        ["care", "Fabric Care", "Different fibres need different washing and ironing temperatures."],
      ]),
    ],
    8: [
      ch("combustion8", "Combustion & Flame", [
        ["combustion", "What is Combustion?", "A rapid reaction of a substance with oxygen producing heat and light."],
        ["fuels", "Fuels", "Solid (coal), liquid (petrol), gas (LPG). A good fuel is cheap, safe, high-calorie."],
        ["flame", "Zones of a Flame", "Outer (blue — hottest, complete combustion), middle (yellow), inner (dark)."],
      ]),
      ch("metals8", "Metals & Non-metals", [
        ["props", "Properties", "Metals: shiny, malleable, conductors. Non-metals: dull, brittle, insulators."],
        ["reactions", "Reactivity", "Some metals (Na, K) react vigorously with water; gold barely reacts."],
        ["uses", "Uses", "Metals for wires and machines; non-metals for fertilisers and medicines."],
      ]),
    ],
    9: [
      ch("atoms9", "Atoms & Molecules", [
        ["laws", "Laws of Chemical Combination", "Conservation of mass; constant proportions."],
        ["mole", "The Mole", "1 mole = 6.022 × 10²³ particles = molar mass in grams."],
        ["formula", "Chemical Formulae", "Show ratio of atoms in a compound: H₂O, CO₂, NaCl."],
      ]),
      ch("matter9", "Matter in Our Surroundings", [
        ["particles", "Particle Theory", "Matter is made of tiny particles that are always moving. Explains diffusion."],
        ["change", "Change of State", "Melting, boiling, condensation, sublimation. Depend on temperature and pressure."],
        ["evap", "Evaporation", "Surface phenomenon causing cooling — sweat cools the body."],
      ]),
    ],
    10: [
      ch("reactions10", "Chemical Reactions & Equations", [
        ["balance", "Balancing Equations", "Number of atoms of each element must be equal on both sides."],
        ["types", "Types of Reactions", "Combination, decomposition, displacement, double displacement, redox."],
        ["corrosion", "Corrosion & Rancidity", "Metals corrode when exposed to air/water. Fats go rancid on oxidation."],
      ]),
      ch("carbon10", "Carbon & its Compounds", [
        ["bonding", "Covalent Bonding", "Carbon shares 4 electrons — forms chains, branches, rings."],
        ["homologous", "Homologous Series", "Family of compounds with same functional group differing by −CH₂−."],
        ["ethanol", "Ethanol & Ethanoic Acid", "Common carbon compounds; used as fuel and vinegar respectively."],
      ]),
    ],
    11: [
      ch("structure11", "Structure of Atom", [
        ["models", "Atomic Models", "Thomson, Rutherford, Bohr — each refined our picture of atomic structure."],
        ["quantum", "Quantum Numbers", "n, l, m, s describe the state of an electron."],
        ["config", "Electronic Configuration", "Electrons fill orbitals following Aufbau, Pauli, Hund's rules."],
      ]),
      ch("bonding11", "Chemical Bonding", [
        ["ionic", "Ionic Bonding", "Formed by transfer of electrons — e.g. NaCl."],
        ["covalent", "Covalent Bonding", "Formed by sharing electrons — e.g. H₂O, CH₄."],
        ["vsepr", "VSEPR & Shapes", "Electron pairs repel to give predictable geometries (linear, bent, tetrahedral)."],
      ]),
    ],
    12: [
      ch("solutions12", "Solutions & Electrochemistry", [
        ["conc", "Concentration", "Molarity, molality, mole fraction — different ways to express concentration."],
        ["colligative", "Colligative Properties", "Boiling point elevation and freezing point depression depend on number of particles."],
        ["electro", "Electrochemical Cells", "Convert chemical energy to electrical energy. EMF from standard electrode potentials."],
      ]),
      ch("organic12", "Organic Chemistry", [
        ["haloalk", "Haloalkanes", "R–X compounds; undergo substitution and elimination."],
        ["alcohol", "Alcohols & Ethers", "Alcohols contain –OH; ethers contain –O– between two carbons."],
        ["bio", "Biomolecules", "Carbohydrates, proteins, nucleic acids, lipids — the chemistry of life."],
      ]),
    ],
  },
  biology: {
    6: [
      ch("plants6", "The World of Plants", [
        ["parts", "Parts of a Plant", "Roots absorb water; stem supports and transports; leaves make food; flowers reproduce."],
        ["photo", "Photosynthesis", "Plants make glucose using sunlight, water and CO₂, releasing oxygen."],
        ["classify", "Herbs, Shrubs & Trees", "Grouped by size and stem hardness."],
      ]),
      ch("animals6", "Animals Around Us", [
        ["food", "Food Habits", "Herbivores, carnivores, omnivores."],
        ["habitat", "Habitats", "Land, water, air — each animal is adapted to survive there."],
        ["move", "Movement", "Different animals move differently — swim, fly, crawl, walk."],
      ]),
    ],
    7: [
      ch("nutrition7", "Nutrition", [
        ["plants", "In Plants", "Autotrophs — make their own food by photosynthesis."],
        ["animals", "In Animals", "Heterotrophs — get food from plants or other animals."],
        ["digestion", "Human Digestion", "Mouth → oesophagus → stomach → small intestine → large intestine."],
      ]),
      ch("respire7", "Respiration in Organisms", [
        ["breath", "Breathing", "Inhale O₂, exhale CO₂. Lungs exchange gases with blood."],
        ["cellular", "Cellular Respiration", "Glucose + O₂ → CO₂ + H₂O + Energy (ATP)."],
        ["anaerobic", "Anaerobic Respiration", "Without oxygen — yeast makes alcohol; muscles make lactic acid."],
      ]),
    ],
    8: [
      ch("cell8", "Cell — Structure & Functions", [
        ["discovery", "Discovery of Cell", "Robert Hooke saw cells in cork (1665). All living things are made of cells."],
        ["parts", "Cell Parts", "Cell membrane, cytoplasm, nucleus. Plants also have cell wall and chloroplasts."],
        ["types", "Unicellular vs Multicellular", "Amoeba is one cell; humans have trillions."],
      ]),
      ch("micro8", "Microorganisms", [
        ["kinds", "Kinds of Microbes", "Bacteria, fungi, protozoa, viruses, algae."],
        ["useful", "Useful Microbes", "Curd, bread, antibiotics, nitrogen fixation."],
        ["harmful", "Harmful Microbes", "Cause diseases (cholera, flu, malaria) and food spoilage."],
      ]),
    ],
    9: [
      ch("tissues9", "Tissues", [
        ["plant", "Plant Tissues", "Meristematic (growth) and permanent (parenchyma, xylem, phloem)."],
        ["animal", "Animal Tissues", "Epithelial, connective, muscular, nervous."],
        ["blood", "Blood as Tissue", "A connective tissue with plasma, RBCs, WBCs, platelets."],
      ]),
      ch("health9", "Why do we Fall Ill", [
        ["health", "Health", "State of complete physical, mental and social well-being."],
        ["disease", "Infectious Diseases", "Caused by pathogens; spread by air, water, vectors, contact."],
        ["immune", "Immunity", "Body's defence — innate and acquired. Vaccines train the immune system."],
      ]),
    ],
    10: [
      ch("life10", "Life Processes", [
        ["nutrition", "Nutrition", "Autotrophic (photosynthesis) vs heterotrophic (holozoic, parasitic)."],
        ["transport", "Transport", "Blood in animals; xylem (water) and phloem (food) in plants."],
        ["excretion", "Excretion", "Kidneys filter waste from blood forming urine."],
      ]),
      ch("reprod10", "Reproduction", [
        ["asex", "Asexual", "Binary fission, budding, fragmentation, vegetative propagation."],
        ["sex", "Sexual", "Involves gametes from two parents — introduces variation."],
        ["human", "Human Reproduction", "Male and female reproductive systems; fertilisation in fallopian tube."],
      ]),
    ],
    11: [
      ch("plants11", "Plant Physiology", [
        ["transport", "Transport in Plants", "Water rises by transpiration pull through xylem."],
        ["photo", "Photosynthesis", "Light + dark reactions in chloroplasts. Produces glucose."],
        ["growth", "Plant Growth Regulators", "Auxins, gibberellins, cytokinins, ABA, ethylene."],
      ]),
      ch("human11", "Human Physiology", [
        ["digest", "Digestion", "Enzymes break down carbs, proteins, fats into absorbable units."],
        ["breath", "Breathing", "Diaphragm and intercostals ventilate the lungs."],
        ["neuro", "Neural Control", "Neurons transmit impulses; brain and spinal cord coordinate response."],
      ]),
    ],
    12: [
      ch("genetics12", "Genetics & Evolution", [
        ["mendel", "Mendel's Laws", "Segregation and independent assortment of alleles."],
        ["dna", "DNA & Replication", "Double helix; semi-conservative replication; genetic code."],
        ["evo", "Evolution", "Natural selection acts on variation over generations."],
      ]),
      ch("bio12", "Biology & Human Welfare", [
        ["health", "Human Health", "Immunity, vaccines, common diseases and prevention."],
        ["biotech", "Biotechnology", "Recombinant DNA, PCR, GMOs — applications in medicine and agriculture."],
        ["eco", "Ecosystems", "Producers, consumers, decomposers; energy flow and nutrient cycles."],
      ]),
    ],
  },
  maths: {
    6: [
      ch("numbers6", "Numbers", [
        ["natural", "Whole & Natural Numbers", "Natural numbers: 1,2,3… Add 0 to get whole numbers."],
        ["factors", "Factors & Multiples", "A factor divides exactly; a multiple is obtained by multiplying."],
        ["fractions", "Fractions", "A fraction shows part of a whole: numerator / denominator."],
      ]),
      ch("geo6", "Geometry Basics", [
        ["shapes", "Basic Shapes", "Point, line, ray, angle, triangle, quadrilateral, circle."],
        ["angles", "Angles", "Acute (<90°), right (90°), obtuse (>90°), straight (180°)."],
        ["perimeter", "Perimeter & Area", "Perimeter is boundary length; area is space inside."],
      ]),
    ],
    7: [
      ch("integers7", "Integers", [
        ["intro", "What are Integers?", "…, −3, −2, −1, 0, 1, 2, 3, … Positive and negative whole numbers."],
        ["ops", "Operations", "Same signs → add; different signs → subtract. Product of two negatives is positive."],
        ["number", "Number Line", "Move right for +, left for −."],
      ]),
      ch("algebra7", "Simple Algebra", [
        ["variables", "Variables", "A letter representing an unknown number: 2x + 3."],
        ["equations", "Linear Equations", "Solve by keeping the balance: 2x + 3 = 11 ⇒ x = 4."],
        ["expressions", "Expressions", "Combinations of variables, constants, and operations."],
      ]),
    ],
    8: [
      ch("rationals8", "Rational Numbers", [
        ["intro", "Rationals", "Numbers of the form p/q, q ≠ 0. Include integers and fractions."],
        ["ops", "Operations", "Add/subtract with LCM; multiply numerators & denominators; divide by reciprocal."],
        ["repr", "On Number Line", "Every rational fits between two integers."],
      ]),
      ch("mensuration8", "Mensuration", [
        ["area", "Areas", "Rectangle: l × b. Triangle: ½ × b × h. Circle: πr²."],
        ["volume", "Volumes", "Cube: a³. Cuboid: l × b × h. Cylinder: πr²h."],
        ["surface", "Surface Area", "Total outer area of a solid."],
      ]),
    ],
    9: [
      ch("polynomials9", "Polynomials", [
        ["intro", "Terms & Degree", "Sum of monomials. Degree = highest power."],
        ["factor", "Factor Theorem", "(x − a) is a factor of p(x) iff p(a) = 0."],
        ["identities", "Algebraic Identities", "(a+b)² = a² + 2ab + b², etc."],
      ]),
      ch("coord9", "Coordinate Geometry", [
        ["axes", "The Cartesian Plane", "x-axis and y-axis meet at the origin (0,0)."],
        ["quadrants", "Quadrants", "Four regions; sign of coordinates changes."],
        ["distance", "Distance Formula", "d = √((x₂−x₁)² + (y₂−y₁)²)."],
      ]),
    ],
    10: [
      ch("trig10", "Trigonometry", [
        ["ratios", "Trig Ratios", "sin, cos, tan defined from a right triangle."],
        ["identities", "Identities", "sin²θ + cos²θ = 1."],
        ["heights", "Heights & Distances", "Use tan θ = opposite / adjacent to find heights."],
      ]),
      ch("quad10", "Quadratic Equations", [
        ["form", "Standard Form", "ax² + bx + c = 0, a ≠ 0."],
        ["formula", "Quadratic Formula", "x = (−b ± √(b²−4ac)) / 2a."],
        ["nature", "Nature of Roots", "Discriminant b²−4ac tells if roots are real/equal/complex."],
      ]),
    ],
    11: [
      ch("sets11", "Sets & Relations", [
        ["sets", "Sets", "A collection of distinct objects. Union, intersection, complement."],
        ["relations", "Relations", "Subset of A × B. Domain and range."],
        ["functions", "Functions", "Every input has exactly one output."],
      ]),
      ch("calc11", "Introduction to Calculus", [
        ["limits", "Limits", "Value a function approaches. lim x→a f(x)."],
        ["derivative", "Derivatives", "Rate of change. d/dx(xⁿ) = n xⁿ⁻¹."],
        ["applications", "Applications", "Slope of tangent, velocity from displacement."],
      ]),
    ],
    12: [
      ch("calc12", "Calculus", [
        ["cont", "Continuity", "A function is continuous if its limit equals its value."],
        ["diff", "Differentiation", "Chain, product, quotient rules to differentiate composites."],
        ["integ", "Integration", "Antiderivative. ∫xⁿ dx = xⁿ⁺¹/(n+1) + C."],
      ]),
      ch("prob12", "Probability", [
        ["basics", "Basics", "P(event) = favourable / total. 0 ≤ P ≤ 1."],
        ["cond", "Conditional Probability", "P(A|B) = P(A ∩ B) / P(B)."],
        ["bayes", "Bayes' Theorem", "Reverses conditional probabilities using prior knowledge."],
      ]),
    ],
  },
  cs: {
    6: [
      ch("basics6", "Computer Basics", [
        ["parts", "Parts of a Computer", "CPU (brain), memory (RAM), storage (disk), input (keyboard), output (monitor)."],
        ["software", "Hardware vs Software", "Hardware you can touch; software is the set of instructions running on it."],
        ["files", "Files & Folders", "Files store data; folders organise files hierarchically."],
      ]),
      ch("intro6", "Introduction to Coding", [
        ["what", "What is a Program?", "A sequence of instructions a computer follows."],
        ["logic", "Logical Thinking", "Break a problem into small steps — an algorithm."],
        ["block", "Block Coding", "Drag-drop blocks (Scratch) to build programs visually."],
      ]),
    ],
    7: [
      ch("py7", "Python — First Steps", [
        ["print", "print()", "print('Hello') displays text on screen. Strings are in quotes."],
        ["vars", "Variables", "x = 10 stores a value with a name. Python decides the type."],
        ["input", "input()", "Reads text from the user. Returns a string — convert with int() or float()."],
      ]),
      ch("data7", "Data Types", [
        ["numbers", "Numbers", "int (whole), float (decimal). Operators + − * / % **."],
        ["strings", "Strings", "Text in quotes. Concatenate with +, repeat with *, index with []."],
        ["bools", "Booleans", "True or False — result of comparisons like x > 0."],
      ]),
    ],
    8: [
      ch("control8", "Control Flow", [
        ["ifelse", "if / elif / else", "Choose which block to run based on a condition."],
        ["while", "while loops", "Repeat while a condition stays True."],
        ["for", "for loops", "Iterate over a range or a collection: for i in range(10)."],
      ]),
      ch("collections8", "Collections", [
        ["lists", "Lists", "[1,2,3] — ordered, mutable. append, pop, sort."],
        ["tuples", "Tuples", "(1,2,3) — ordered, immutable."],
        ["dicts", "Dictionaries", "{'name': 'Alia'} — key → value lookup."],
      ]),
    ],
    9: [
      ch("func9", "Functions", [
        ["def", "Defining Functions", "def greet(name): return f'Hello {name}'. Reuse code."],
        ["args", "Arguments & Return", "Positional, keyword, default arguments. return sends value back."],
        ["scope", "Scope", "Variables inside a function are local; can't see them outside."],
      ]),
      ch("errors9", "Errors & Debugging", [
        ["types", "Types of Errors", "SyntaxError (typo), NameError (undefined), TypeError (wrong type)."],
        ["try", "try / except", "Catch runtime errors so the program doesn't crash."],
        ["debug", "Debugging Tips", "Print variables, read the traceback bottom-up, use small test cases."],
      ]),
    ],
    10: [
      ch("oop10", "Object-Oriented Programming", [
        ["class", "Classes & Objects", "class Dog: models real-world things. An object is one instance."],
        ["init", "__init__ & self", "The constructor runs when an object is created; self refers to the object."],
        ["inherit", "Inheritance", "class Puppy(Dog) reuses Dog's code and can add its own."],
      ]),
      ch("files10", "Files & Modules", [
        ["open", "Reading/Writing Files", "open('file.txt', 'r') / 'w'. Always close (or use `with`)."],
        ["modules", "Modules", "import math, random. Split code across files with import."],
        ["pip", "pip & packages", "pip install <pkg> to get third-party libraries."],
      ]),
    ],
    11: [
      ch("algo11", "Algorithms", [
        ["search", "Searching", "Linear O(n) vs binary O(log n) — binary needs sorted data."],
        ["sort", "Sorting", "Bubble, insertion, merge, quick. Different time complexities."],
        ["big-o", "Big-O", "Way to express how running time grows with input size."],
      ]),
      ch("ds11", "Data Structures", [
        ["stack", "Stack", "LIFO — push, pop. Used in undo, function calls."],
        ["queue", "Queue", "FIFO — enqueue, dequeue. Used in printers, buffers."],
        ["tree", "Trees", "Hierarchical. Binary trees, traversals (pre, in, post-order)."],
      ]),
    ],
    12: [
      ch("web12", "Web & APIs", [
        ["http", "HTTP Basics", "Clients send requests, servers send responses. Methods: GET, POST."],
        ["json", "JSON", "Text format for structured data. Used by nearly every web API."],
        ["rest", "REST APIs", "URLs represent resources; HTTP methods act on them."],
      ]),
      ch("db12", "Databases", [
        ["sql", "SQL Basics", "SELECT, INSERT, UPDATE, DELETE. Query relational data."],
        ["tables", "Tables & Relations", "Rows and columns; primary and foreign keys link tables."],
        ["nosql", "NoSQL", "Document (Mongo), key-value (Redis) — flexible, scalable."],
      ]),
    ],
  },
};

export function getChaptersFor(subject: CurriculumSubjectId, grade: Grade): Chapter[] {
  return CURRICULUM[subject]?.[grade] ?? [];
}
