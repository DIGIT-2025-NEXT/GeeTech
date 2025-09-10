"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useSkills } from "@/hooks/useSkills";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Chip,
  Stack,
  Avatar,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import { SkillIcon } from "../_components/SkillIcon";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";

export default function ProfilePage() {
  const router = useRouter();

  const {
    user,
    loading: profileLoading,
    error: profileError,
    profile,
  } = useProfile();
  const {
    currentUserSkills,
    loading: skillsLoading,
    error: skillsError,
  } = useSkills();

  // 未ログインならloginにリダイレクトする
  useEffect(() => {
    if (!user && !profileLoading) {
      router.replace("/login");
    }
  }, [user, profileLoading, router]);

  const loading = profileLoading || skillsLoading;
  const error = profileError || skillsError;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 3 }}>
        エラーが発生しました: {error}
      </Typography>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>プロフィールが見つかりません。</Typography>
        <Button onClick={() => router.push("/profile/edit")} sx={{ mt: 2 }}>
          プロフィールを作成
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: "90%", mx: "auto" }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {profile.username}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {profile.last_name} {profile.first_name}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push("/profile/edit")}
          >
            編集
          </Button>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Stack spacing={3}>
          {profile.bio && (
            <Box>
              <Typography variant="h6" gutterBottom>
                自己紹介
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {profile.bio}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="h6" gutterBottom>
              スキル
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {currentUserSkills.length > 0 ? (
                currentUserSkills.map((skill) => (
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
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  スキルが設定されていません。
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              連絡先・リンク
            </Typography>
            <Stack spacing={1.5}>
              {profile.email && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EmailIcon color="action" />
                  <Typography variant="body1">{profile.email}</Typography>
                </Stack>
              )}
              {profile.website && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LanguageIcon color="action" />
                  <MuiLink
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profile.website}
                  </MuiLink>
                </Stack>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
