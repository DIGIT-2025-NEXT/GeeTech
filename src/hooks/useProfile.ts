"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/lib/types_db";
import { createClient } from "@/lib/supabase/client";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useProfile() {
  const { user } = useAuth();
  const supabase = createClient();
  //  useSupabaseClient<Database>() as unknown as SupabaseClient<Database>;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  const fetchProfile = useCallback(async () => {
    if (user && supabase) {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error.message);
        setError("プロフィールの読み込みに失敗しました。");
      } else if (data) {
        setProfile(data);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setUsername(data.username || "");
        setWebsite(data.website || "");
        setBio(data.bio || "");
        setEmail(data.email || ""); // profiles.emailがなければ空文字にする
      }
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (newProfileData: {
    firstName: string;
    lastName: string;
    username: string;
    website: string;
    bio: string;
    email: string;
  }) => {
    if (!user || !supabase)
      throw new Error("User or Supabase client not available.");

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: newProfileData.firstName,
        last_name: newProfileData.lastName,
        username: newProfileData.username,
        website: newProfileData.website,
        bio: newProfileData.bio,
        email: newProfileData.email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    await fetchProfile();
  };

  const hasChanges = true;
  //profile;
  //   ? firstName !== (profile.first_name || "") ||
  //     lastName !== (profile.last_name || "") ||
  //     username !== (profile.username || "") ||
  //     website !== (profile.website || "") ||
  //     bio !== (profile.bio || "") ||
  //     email !== (profile.email || user?.email || "")
  //   : false;

  return {
    user, // userを返すように追加
    loading,
    error,
    profile,
    firstName,
    lastName,
    username,
    website,
    bio,
    email,
    setFirstName,
    setLastName,
    setUsername,
    setWebsite,
    setBio,
    setEmail,
    updateProfile,
    hasChanges,
  };
}
