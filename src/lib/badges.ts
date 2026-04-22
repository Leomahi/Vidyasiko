import { Profile } from "./db";

export interface BadgeRule {
  id: string;
  test: (p: Profile, ctx?: { gamesPlayed?: number }) => boolean;
}

/**
 * Centralised badge rules. A badge is "earned" if its test returns true.
 * Badge ids include an emoji prefix so they render nicely in BadgeWall.
 */
export const BADGE_RULES: BadgeRule[] = [
  { id: "🌱 First Steps", test: (p) => (p.xp ?? 0) >= 10 },
  { id: "🏆 Quick Learner", test: (p) => (p.xp ?? 0) >= 100 },
  { id: "📚 Bookworm", test: (p) => (p.xp ?? 0) >= 300 },
  { id: "⭐ Rising Star", test: (p) => (p.xp ?? 0) >= 500 },
  { id: "💎 Scholar", test: (p) => (p.xp ?? 0) >= 1000 },
  { id: "🚀 Level 5", test: (p) => (p.level ?? 1) >= 5 },
  { id: "👑 Level 10", test: (p) => (p.level ?? 1) >= 10 },
  { id: "🔥 3-Day Streak", test: (p) => (p.streak ?? 0) >= 3 },
  { id: "⚡ 7-Day Streak", test: (p) => (p.streak ?? 0) >= 7 },
  { id: "🎮 Game On", test: (_p, c) => (c?.gamesPlayed ?? 0) >= 1 },
  { id: "🎯 Dedicated Player", test: (_p, c) => (c?.gamesPlayed ?? 0) >= 10 },
];

/**
 * Compute the union of (existing badges ∪ newly-earned badges).
 * Returns the merged list and the list of newly-earned badge ids.
 */
export function computeBadges(
  profile: Profile,
  ctx?: { gamesPlayed?: number }
): { merged: string[]; earned: string[] } {
  const current = new Set(profile.badges ?? []);
  const earned: string[] = [];
  for (const rule of BADGE_RULES) {
    if (rule.test(profile, ctx) && !current.has(rule.id)) {
      current.add(rule.id);
      earned.push(rule.id);
    }
  }
  return { merged: Array.from(current), earned };
}