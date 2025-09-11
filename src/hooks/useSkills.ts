"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllSkills,
  getUserSkills,
  addSkillToUser,
  removeSkillFromUser,
  type Skill,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/client";

export function useSkills() {
  const supabase = createClient();
  const { user } = useAuth();

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [initialUserSkills, setInitialUserSkills] = useState<Skill[]>([]);
  const [currentUserSkills, setCurrentUserSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasChanges = (() => {
    if (initialUserSkills.length !== currentUserSkills.length) {
      return true;
    }
    const initialIds = initialUserSkills.map((s) => s.id).sort();
    const currentIds = currentUserSkills.map((s) => s.id).sort();
    return JSON.stringify(initialIds) !== JSON.stringify(currentIds);
  })();

  const fetchData = useCallback(async () => {
    if (!user || !supabase) return;
    try {
      setLoading(true);
      setError(null);
      const [all, userSkillsData] = await Promise.all([
        getAllSkills(supabase),
        getUserSkills(supabase, user.id),
      ]);
      setAllSkills(all);
      setInitialUserSkills(userSkillsData);
      setCurrentUserSkills(userSkillsData);
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

  const handleSkillToggle = (skill: Skill) => {
    const userSkillIds = new Set(currentUserSkills.map((s) => s.id));
    const isSkillSet = userSkillIds.has(skill.id);
    if (isSkillSet) {
      setCurrentUserSkills((prev) => prev.filter((s) => s.id !== skill.id));
    } else {
      setCurrentUserSkills((prev) => [...prev, skill]);
    }
  };

  const handleSave = async () => {
    if (!user || !supabase) return;
    setSaving(true);
    setError(null);

    try {
      const initialIds = new Set(initialUserSkills.map((s) => s.id));
      const currentIds = new Set(currentUserSkills.map((s) => s.id));

      const skillsToAdd = currentUserSkills.filter(
        (s) => !initialIds.has(s.id)
      );
      const skillsToRemove = initialUserSkills.filter(
        (s) => !currentIds.has(s.id)
      );

      await Promise.all([
        ...skillsToAdd.map((skill) =>
          addSkillToUser(supabase, user.id, skill.id)
        ),
        ...skillsToRemove.map((skill) =>
          removeSkillFromUser(supabase, user.id, skill.id)
        ),
      ]);

      setInitialUserSkills(currentUserSkills);
      setSuccessMessage("スキル情報を更新しました！");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    allSkills,
    currentUserSkills,
    initialUserSkills, // ここに追加
    loading,
    saving,
    error,
    successMessage,
    hasChanges,
    handleSkillToggle,
    handleSave,
    setSuccessMessage,
  };
}
