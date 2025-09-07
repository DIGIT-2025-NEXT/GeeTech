"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSkills } from "@/hooks/useSkills";
import {
  Box,
  Chip,
  CircularProgress,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { SkillIcon } from "../_components/SkillIcon";

export default function ProfilePage() {
  const {
    user,
    allSkills,
    currentUserSkills,
    loading,
    saving,
    error,
    successMessage,
    hasChanges,
    handleSkillToggle,
    handleSave,
    setSuccessMessage,
  } = useSkills();

  const router = useRouter();

  // 未ログインならloginにリダイレクトする
  useEffect(() => {
    if (!user && !loading) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const userSkillIds = new Set(currentUserSkills.map((s) => s.id));

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          プロフィール設定
        </Typography>
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
          エラーが発生しました: {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          あなたのスキル
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