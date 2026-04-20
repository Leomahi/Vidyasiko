/**
 * All 13 STEM games ported from the original Flask engine.
 * Each one is a themed wrapper around the shared canvas MCQ engine,
 * matching the visual identity of the corresponding game in the zip.
 */
import { Language } from "@/lib/translations";
import CanvasGameShell from "./_shared/CanvasGameShell";
import { biologyQuestions, chemistryQuestions, mathsQuestions, physicsQuestions, pythonQuestions } from "./gameQuestions";

interface GameProps {
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

// PHYSICS
export const PhysicsArcade = (p: GameProps) => (
  <CanvasGameShell title="Physics Arcade" emoji="⚡" questions={physicsQuestions}
    accent="#22d3ee" bgGradient={["#0b1224", "#1a1140"]} totalTime={70} {...p} />
);
export const PhysicsShooter = (p: GameProps) => (
  <CanvasGameShell title="Physics Shooter" emoji="🎯" questions={physicsQuestions}
    accent="#fbbf24" bgGradient={["#1a0b24", "#3b0764"]} totalTime={60} {...p} />
);

// CHEMISTRY
export const ChemLab = (p: GameProps) => (
  <CanvasGameShell title="Chem Lab" emoji="🧪" questions={chemistryQuestions}
    accent="#a78bfa" bgGradient={["#0c1f1a", "#1b3a4d"]} totalTime={75} {...p} />
);
export const ChemHeist = (p: GameProps) => (
  <CanvasGameShell title="Chem Heist" emoji="🦹‍♂️" questions={chemistryQuestions}
    accent="#f472b6" bgGradient={["#0a0a18", "#1a0a30"]} totalTime={60} {...p} />
);

// BIOLOGY
export const BioDefence = (p: GameProps) => (
  <CanvasGameShell title="Bio Defence" emoji="🦠" questions={biologyQuestions}
    accent="#34d399" bgGradient={["#062018", "#0c3a2c"]} totalTime={70} {...p} />
);
export const BioDNA = (p: GameProps) => (
  <CanvasGameShell title="Bio DNA Builder" emoji="🧬" questions={biologyQuestions}
    accent="#60a5fa" bgGradient={["#0b1a2e", "#1e3a5f"]} totalTime={65} {...p} />
);

// MATHS
export const MathsNinja = (p: GameProps) => (
  <CanvasGameShell title="Maths Ninja" emoji="🥷" questions={mathsQuestions}
    accent="#f87171" bgGradient={["#180a0a", "#3a1010"]} totalTime={60} {...p} />
);
export const MathsLaser = (p: GameProps) => (
  <CanvasGameShell title="Maths Laser" emoji="🔫" questions={mathsQuestions}
    accent="#22d3ee" bgGradient={["#06182e", "#082f49"]} totalTime={60} {...p} />
);
export const MathsCannon = (p: GameProps) => (
  <CanvasGameShell title="Maths Cannon" emoji="💣" questions={mathsQuestions}
    accent="#fb923c" bgGradient={["#1a0e06", "#3a1c0a"]} totalTime={70} {...p} />
);
export const MathsMission = (p: GameProps) => (
  <CanvasGameShell title="Maths Mission" emoji="🚀" questions={mathsQuestions}
    accent="#a78bfa" bgGradient={["#0a0a24", "#1a1140"]} totalTime={75} {...p} />
);
export const CalculusCoaster = (p: GameProps) => (
  <CanvasGameShell title="Calculus Coaster" emoji="🎢" questions={mathsQuestions}
    accent="#facc15" bgGradient={["#1a0b2e", "#4c1d95"]} totalTime={80} {...p} />
);

// PYTHON / CS
export const PythonFill = (p: GameProps) => (
  <CanvasGameShell title="Python Fill" emoji="🐍" questions={pythonQuestions}
    accent="#4ade80" bgGradient={["#0a1a0e", "#1a3a20"]} totalTime={70} {...p} />
);
export const PythonDebug = (p: GameProps) => (
  <CanvasGameShell title="Python Debug" emoji="🐛" questions={pythonQuestions}
    accent="#f59e0b" bgGradient={["#1a0e0a", "#3a2010"]} totalTime={70} {...p} />
);
export const PythonDrag = (p: GameProps) => (
  <CanvasGameShell title="Python Drag" emoji="🧩" questions={pythonQuestions}
    accent="#06b6d4" bgGradient={["#0a1a24", "#0e2a40"]} totalTime={70} {...p} />
);

export const ALL_GAMES = [
  { id: "physics-arcade",   subject: "physics",   title: "Physics Arcade",   emoji: "⚡",   Component: PhysicsArcade },
  { id: "physics-shooter",  subject: "physics",   title: "Physics Shooter",  emoji: "🎯",   Component: PhysicsShooter },
  { id: "chem-lab",         subject: "chemistry", title: "Chem Lab",         emoji: "🧪",   Component: ChemLab },
  { id: "chem-heist",       subject: "chemistry", title: "Chem Heist",       emoji: "🦹‍♂️", Component: ChemHeist },
  { id: "bio-defence",      subject: "biology",   title: "Bio Defence",      emoji: "🦠",   Component: BioDefence },
  { id: "bio-dna",          subject: "biology",   title: "Bio DNA Builder",  emoji: "🧬",   Component: BioDNA },
  { id: "maths-ninja",      subject: "maths",     title: "Maths Ninja",      emoji: "🥷",   Component: MathsNinja },
  { id: "maths-laser",      subject: "maths",     title: "Maths Laser",      emoji: "🔫",   Component: MathsLaser },
  { id: "maths-cannon",     subject: "maths",     title: "Maths Cannon",     emoji: "💣",   Component: MathsCannon },
  { id: "maths-mission",    subject: "maths",     title: "Maths Mission",    emoji: "🚀",   Component: MathsMission },
  { id: "calculus-coaster", subject: "maths",     title: "Calculus Coaster", emoji: "🎢",   Component: CalculusCoaster },
  { id: "python-fill",      subject: "python",    title: "Python Fill",      emoji: "🐍",   Component: PythonFill },
  { id: "python-debug",     subject: "python",    title: "Python Debug",     emoji: "🐛",   Component: PythonDebug },
  { id: "python-drag",      subject: "python",    title: "Python Drag",      emoji: "🧩",   Component: PythonDrag },
] as const;

export type GameId = typeof ALL_GAMES[number]["id"];
