/**
 * 13 STEM games — each a route into the original ShikshaSetu canvas engine.
 * The engine itself dispatches by (subject, grade); we pick the grade that
 * makes the engine pick the matching game.
 */
import { Language } from "@/lib/translations";
import OriginalGameShell from "./engine/OriginalGameShell";

interface GameProps {
  language: Language;
  onBack: () => void;
  onComplete: (xpEarned: number, correctCount: number) => void;
}

type Subject = "physics" | "chemistry" | "biology" | "maths" | "python";

function makeGame(title: string, emoji: string, subject: Subject, grade: number) {
  return (p: GameProps) => (
    <OriginalGameShell
      title={title}
      emoji={emoji}
      subject={subject}
      grade={grade}
      onBack={p.onBack}
      onComplete={p.onComplete}
    />
  );
}

export const ALL_GAMES = [
  // Physics: <=7 → arcade, 8-9 → shooter, 10+ → MCQ
  { id: "physics-arcade",   subject: "physics",   title: "Physics Arcade",     emoji: "⚡",   Component: makeGame("Physics Arcade", "⚡", "physics", 7) },
  { id: "physics-shooter",  subject: "physics",   title: "Physics Shooter",    emoji: "🎯",   Component: makeGame("Physics Shooter", "🎯", "physics", 9) },
  // Chemistry: <=7 lab, 8-9 heist, 10 mcq, 11+ molecule forge
  { id: "chem-lab",         subject: "chemistry", title: "Chem Lab",           emoji: "🧪",   Component: makeGame("Chem Lab", "🧪", "chemistry", 7) },
  { id: "chem-heist",       subject: "chemistry", title: "Chem Heist",         emoji: "🦹‍♂️", Component: makeGame("Chem Heist", "🦹‍♂️", "chemistry", 9) },
  // Biology: <=7 defence, 8-9 DNA, 10+ ecosystem
  { id: "bio-defence",      subject: "biology",   title: "Bio Defence",        emoji: "🦠",   Component: makeGame("Bio Defence", "🦠", "biology", 7) },
  { id: "bio-dna",          subject: "biology",   title: "Bio DNA Builder",    emoji: "🧬",   Component: makeGame("Bio DNA Builder", "🧬", "biology", 9) },
  { id: "bio-eco",          subject: "biology",   title: "Ecosystem Architect",emoji: "🌿",   Component: makeGame("Ecosystem Architect", "🌿", "biology", 11) },
  // Maths: <=7 ninja, 8 laser, 9 cannon, 10 mission, 11+ calculus
  { id: "maths-ninja",      subject: "maths",     title: "Maths Ninja",        emoji: "🥷",   Component: makeGame("Maths Ninja", "🥷", "maths", 7) },
  { id: "maths-laser",      subject: "maths",     title: "Maths Laser",        emoji: "🔫",   Component: makeGame("Maths Laser", "🔫", "maths", 8) },
  { id: "maths-cannon",     subject: "maths",     title: "Maths Cannon",       emoji: "💣",   Component: makeGame("Maths Cannon", "💣", "maths", 9) },
  { id: "maths-mission",    subject: "maths",     title: "Maths Mission",      emoji: "🚀",   Component: makeGame("Maths Mission", "🚀", "maths", 10) },
  { id: "calculus-coaster", subject: "maths",     title: "Calculus Coaster",   emoji: "🎢",   Component: makeGame("Calculus Coaster", "🎢", "maths", 11) },
  // Python: <=8 fill, 9-10 debug, 11+ drag
  { id: "python-fill",      subject: "python",    title: "Python Fill",        emoji: "🐍",   Component: makeGame("Python Fill", "🐍", "python", 8) },
  { id: "python-debug",     subject: "python",    title: "Python Debug",       emoji: "🐛",   Component: makeGame("Python Debug", "🐛", "python", 10) },
  { id: "python-drag",      subject: "python",    title: "Python Drag",        emoji: "🧩",   Component: makeGame("Python Drag", "🧩", "python", 11) },
] as const;

export type GameId = typeof ALL_GAMES[number]["id"];
