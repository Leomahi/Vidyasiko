import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type QuizScore = Tables<"quiz_scores">;
export type SubjectProgress = Tables<"subject_progress">;

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function getLeaderboard(): Promise<Profile[]> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("xp", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function saveQuizScore(score: TablesInsert<"quiz_scores">) {
  const { error } = await supabase.from("quiz_scores").insert(score);
  if (error) throw error;
}

export async function getSubjectProgress(userId: string): Promise<SubjectProgress[]> {
  const { data } = await supabase
    .from("subject_progress")
    .select("*")
    .eq("user_id", userId);
  return data ?? [];
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

export async function addXpToProfile(userId: string, xpToAdd: number) {
  const profile = await getProfile(userId);
  if (!profile) return;
  const newXp = profile.xp + xpToAdd;
  const newLevel = Math.floor(newXp / 200) + 1;
  await updateProfile(userId, { xp: newXp, level: newLevel });
}
