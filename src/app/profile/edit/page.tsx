"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSkills } from "@/hooks/useSkills";
import { useProfile } from "@/hooks/useProfile";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useProfileCreation } from "@/hooks/useProfileCreation";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Button,
  Chip,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { SkillIcon } from "@/app/_components/SkillIcon";

export default function EditProfilePage() {
  const router = useRouter();
  const { profileChecked } = useProfileCreation();
  const {
    loading: profileLoading,
    error: profileError,
    firstName,
    lastName,
    username,
    website,
    bio: profileBio,
    email,
    setFirstName,
    setLastName,
    setUsername,
    setWebsite,
    setEmail,
    updateProfile,
    hasChanges: profileHasChanges,
  } = useProfile();

  const {
    loading: studentLoading,
    error: studentError,
    name,
    university,
    bio: studentBio,
    setName,
    setUniversity,
    setBio,
    updateStudentProfile,
    hasChanges: studentHasChanges,
  } = useStudentProfile();

  const {
    allSkills,
    currentUserSkills,
    loading: skillsLoading,
    error: skillsError,
    hasChanges: skillsHasChanges,
    handleSkillToggle,
    handleSave: handleSkillsSave,
  } = useSkills();

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasChanges = profileHasChanges || skillsHasChanges || studentHasChanges;

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage(null);

    try {
      if (profileHasChanges) {
        await updateProfile({
          firstName,
          lastName,
          username,
          website,
          bio: profileBio,
          email,
        });
      }
      if (skillsHasChanges) {
        await handleSkillsSave();
      }
      if (studentHasChanges) {
        await updateStudentProfile({
          name,
          university,
          bio: studentBio,
          skills: currentUserSkills.map(skill => skill.skill_name),
        });
      }
      setSuccessMessage("プロフィールを更新しました！");
      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading || skillsLoading || studentLoading || !profileChecked) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2">
            {!profileChecked ? 'プロフィール準備中...' : '読み込み中...'}
          </Typography>
        </Box>
      </Box>
    );
  }

  const error = profileError || skillsError || studentError;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">プロフィール編集</Typography>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? <CircularProgress size={24} /> : "保存する"}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* 基本情報フォーム */}
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              基本情報
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="フルネーム"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                placeholder="山田 太郎"
              />
              <TextField
                label="大学名"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                fullWidth
                placeholder="例: 東京大学"
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="姓"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="名"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                />
              </Stack>
              <TextField
                label="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="ウェブサイト"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                fullWidth
              />
              <TextField
                label="自己紹介"
                value={studentBio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder="あなたの経験、興味、目標について教えてください"
              />
            </Stack>
          </Paper>
        </Box>

        {/* スキル編集 */}
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                あなたのスキル
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  minHeight: "40px",
                }}
              >
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
                      onDelete={() => handleSkillToggle(skill)}
                      color="primary"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    スキルを選択してください。
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
                    color={
                      currentUserSkills.some((s) => s.id === skill.id)
                        ? "primary"
                        : "default"
                    }
                    variant={
                      currentUserSkills.some((s) => s.id === skill.id)
                        ? "filled"
                        : "outlined"
                    }
                  />
                ))}
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
