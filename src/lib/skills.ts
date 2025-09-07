import { SupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/types/supabase";

// 型エイリアスもここに集約
export type Skill = Database["public"]["Tables"]["skills"]["Row"];

/**
 * すべてのスキルを取得する
 */
export async function getAllSkills(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("skills").select("*");
  if (error) throw error;
  return data || [];
}

/**
 * 特定のユーザーが持つスキルを取得する
 */
export async function getUserSkills(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Skill[]> {
  const { data: userSkillIdsData, error: userSkillIdsError } = await supabase
    .from("user_skills")
    .select("skill_id")
    .eq("user_id", userId);

  if (userSkillIdsError) throw userSkillIdsError;
  if (!userSkillIdsData || userSkillIdsData.length === 0) {
    return [];
  }

  const skillIds = userSkillIdsData.map((item) => item.skill_id);

  const { data: userSkillsData, error: userSkillsError } = await supabase
    .from("skills")
    .select("*")
    .in("id", skillIds);

  if (userSkillsError) throw userSkillsError;
  return userSkillsData || [];
}

/**
 * ユーザーにスキルを追加する
 */
export async function addSkillToUser(
  supabase: SupabaseClient<Database>,
  userId: string,
  skillId: string
) {
  const { error } = await supabase
    .from("user_skills")
    .insert({ user_id: userId, skill_id: skillId });
  if (error) throw error;
}

/**
 * ユーザーからスキルを削除する
 */
export async function removeSkillFromUser(
  supabase: SupabaseClient<Database>,
  userId: string,
  skillId: string
) {
  const { error } = await supabase
    .from("user_skills")
    .delete()
    .match({ user_id: userId, skill_id: skillId });
  if (error) throw error;
}
