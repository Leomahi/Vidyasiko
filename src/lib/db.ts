import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { cacheSet, cacheGet, enqueue, getPendingActions, dequeue } from "./offlineCache";

export type Profile = Tables<"profiles">;
export type QuizScore = Tables<"quiz_scores">;
export type SubjectProgress = Tables<"subject_progress">;

// ── Profile ──

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data) cacheSet(`profile_${userId}`, data);
    return data;
  } catch {
    return cacheGet<Profile>(`profile_${userId}`);
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  if (!navigator.onLine) {
    // apply optimistically to cache
    const cached = cacheGet<Profile>(`profile_${userId}`);
    if (cached) cacheSet(`profile_${userId}`, { ...cached, ...updates });
    return;
  }
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId);
  if (error) throw error;
}

// ── Leaderboard ──

export async function getLeaderboard(): Promise<Profile[]> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("xp", { ascending: false })
      .limit(10);
    const result = data ?? [];
    cacheSet("leaderboard", result);
    return result;
  } catch {
    return cacheGet<Profile[]>("leaderboard") ?? [];
  }
}

// ── Quiz Scores ──

export async function saveQuizScore(score: TablesInsert<"quiz_scores">) {
  if (!navigator.onLine) {
    enqueue({ type: "save_score", payload: score as Record<string, unknown> });
    return;
  }
  const { error } = await supabase.from("quiz_scores").insert(score);
  if (error) throw error;
}

// ── Subject Progress ──

export async function getSubjectProgress(userId: string): Promise<SubjectProgress[]> {
  try {
    const { data } = await supabase
      .from("subject_progress")
      .select("*")
      .eq("user_id", userId);
    const result = data ?? [];
    cacheSet(`progress_${userId}`, result);
    return result;
  } catch {
    return cacheGet<SubjectProgress[]>(`progress_${userId}`) ?? [];
  }
}

export async function upsertSubjectProgress(userId: string, subjectId: string, completedLessons: number, totalLessons: number) {
  const progress = Math.round((completedLessons / totalLessons) * 100);
  const { error } = await supabase
    .from("subject_progress")
    .upsert(
      { user_id: userId, subject_id: subjectId, completed_lessons: completedLessons, total_lessons: totalLessons, progress },
      { onConflict: "user_id,subject_id" }
    );
  if (error) throw error;
}

// ── XP ──

export async function addXpToProfile(userId: string, xpToAdd: number) {
  if (!navigator.onLine) {
    // Optimistic local update
    const cached = cacheGet<Profile>(`profile_${userId}`);
    if (cached) {
      const newXp = cached.xp + xpToAdd;
      cacheSet(`profile_${userId}`, { ...cached, xp: newXp, level: Math.floor(newXp / 200) + 1 });
    }
    enqueue({ type: "add_xp", payload: { userId, xpToAdd } });
    return;
  }
  const profile = await getProfile(userId);
  if (!profile) return;
  const newXp = profile.xp + xpToAdd;
  const newLevel = Math.floor(newXp / 200) + 1;
  await updateProfile(userId, { xp: newXp, level: newLevel });
}

// ── Sync pending offline actions ──

export async function syncPendingActions() {
  if (!navigator.onLine) return;
  const actions = getPendingActions();
  for (const action of actions) {
    try {
      if (action.type === "add_xp") {
        const { userId, xpToAdd } = action.payload as { userId: string; xpToAdd: number };
        const profile = await getProfile(userId);
        if (profile) {
          const newXp = profile.xp + xpToAdd;
          await supabase
            .from("profiles")
            .update({ xp: newXp, level: Math.floor(newXp / 200) + 1 })
            .eq("user_id", userId);
        }
      } else if (action.type === "save_score") {
        await supabase.from("quiz_scores").insert(action.payload as TablesInsert<"quiz_scores">);
      }
      dequeue(action.id);
    } catch {
      break; // stop on first failure, retry later
    }
  }
}
