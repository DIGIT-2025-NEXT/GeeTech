"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Chip, CircularProgress, Typography, Paper } from "@mui/material";
import { Database } from "@/types/supabase";
import {
  getAllSkills,
  getUserSkills,
  addSkillToUser,
  removeSkillFromUser,
  type Skill,
} from "@/lib/skills";
import { SkillIcon } from "../_components/SkillIcon";

export default function ProfilePage() {
  const supabase =
    useSupabaseClient<Database>() as unknown as SupabaseClient<Database>;
  const { user } = useAuth();

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userSkillIds = new Set(userSkills.map((s) => s.id));

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [all, userSkillsData] = await Promise.all([
        getAllSkills(supabase),
        getUserSkills(supabase, user.id),
      ]);
      setAllSkills(all);
      setUserSkills(userSkillsData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSkillToggle = async (skill: Skill) => {
    if (!user) return;
    const isSkillSet = userSkillIds.has(skill.id);
    try {
      if (isSkillSet) {
        await removeSkillFromUser(supabase, user.id, skill.id);
        setUserSkills((prev) => prev.filter((s) => s.id !== skill.id));
      } else {
        await addSkillToUser(supabase, user.id, skill.id);
        setUserSkills((prev) => [...prev, skill]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        エラーが発生しました: {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        プロフィール設定
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          あなたのスキル
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {userSkills.length > 0 ? (
            userSkills.map((skill) => (
              <Chip
                key={skill.id}
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SkillIcon iconName={skill.icon_name} />
                    <Box component="span" sx={{ ml: 1 }}>
                      {skill.skill_name}
                    </Box>
                  </Box>
                }
                onDelete={() => handleSkillToggle(skill)}
                color="primary"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              スキルが設定されていません。下のリストから追加してください。
            </Typography>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          利用可能なスキル
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {allSkills.map((skill) => (
            <Chip
              key={skill.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <SkillIcon iconName={skill.icon_name} />
                  <Box component="span" sx={{ ml: 1 }}>
                    {skill.skill_name}
                  </Box>
                </Box>
              }
              onClick={() => handleSkillToggle(skill)}
              color={userSkillIds.has(skill.id) ? "primary" : "default"}
              variant={userSkillIds.has(skill.id) ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
