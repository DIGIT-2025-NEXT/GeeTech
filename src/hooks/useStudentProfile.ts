"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/types_db";
import { createClient } from "@/lib/supabase/client";

type StudentProfile = Database["public"]["Tables"]["students"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useStudentProfile() {
  const { user } = useAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const fetchProfiles = useCallback(async () => {
    if (user && supabase) {
      setLoading(true);
      setError(null);

      try {
        // 基本プロフィールを取得
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          throw new Error(`基本プロフィールの取得に失敗: ${profileError.message}`);
        }

        setProfile(profileData);

        // 学生プロフィールを取得
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (studentError && studentError.code !== 'PGRST116') {
          throw new Error(`学生プロフィールの取得に失敗: ${studentError.message}`);
        }

        if (studentData) {
          setStudentProfile(studentData);
          setName(studentData.name || "");
          setUniversity(studentData.university || "");
          setBio(studentData.bio || "");
          setSkills(Array.isArray(studentData.skills) ? studentData.skills : []);
        } else if (profileData) {
          // 学生プロフィールが存在しない場合、基本プロフィールから初期値を設定
          const fullName = `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim();
          setName(fullName);
          setBio(profileData.bio || "");
          setUniversity("");
          setSkills([]);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError(err instanceof Error ? err.message : "プロフィールの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const updateStudentProfile = async (newProfileData: {
    name: string;
    university: string;
    bio: string;
    skills: string[];
  }) => {
    if (!user || !supabase) {
      throw new Error("User or Supabase client not available.");
    }

    try {
      // 学生プロフィールが存在するかチェック
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (existingStudent) {
        // 更新
        const { error } = await supabase
          .from("students")
          .update({
            name: newProfileData.name,
            university: newProfileData.university,
            bio: newProfileData.bio,
            skills: newProfileData.skills,
          })
          .eq("id", user.id);

        if (error) throw error;
      } else {
        // 新規作成
        const { error } = await supabase
          .from("students")
          .insert({
            id: user.id,
            name: newProfileData.name,
            university: newProfileData.university,
            bio: newProfileData.bio,
            skills: newProfileData.skills,
            avatar: "", // デフォルト値
          });

        if (error) throw error;
      }

      await fetchProfiles();
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error;
    }
  };

  const hasChanges = studentProfile
    ? name !== (studentProfile.name || "") ||
      university !== (studentProfile.university || "") ||
      bio !== (studentProfile.bio || "") ||
      JSON.stringify(skills) !== JSON.stringify(studentProfile.skills)
    : name !== "" || university !== "" || bio !== "" || skills.length > 0;

  return {
    user,
    loading,
    error,
    studentProfile,
    profile,
    name,
    university,
    bio,
    skills,
    setName,
    setUniversity,
    setBio,
    setSkills,
    updateStudentProfile,
    hasChanges,
  };
}