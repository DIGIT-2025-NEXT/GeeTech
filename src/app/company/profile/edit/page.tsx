"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { createClient } from "@/lib/supabase/client";

const industries = [
  "IT・情報サービス",
  "メーカー",
  "金融・保険",
  "商社",
  "小売",
  "サービス",
  "不動産",
  "建設",
  "運輸・物流",
  "医療・福祉",
  "コンサルティング",
  "エネルギー",
  "その他",
];

const availableFeatures = [
  "リモートワーク可",
  "フレックス制",
  "副業OK",
  "海外勤務機会",
  "研修制度充実",
  "社内イベント充実",
  "福利厚生充実",
  "ベンチャー",
  "大手企業",
  "成長中",
];

export default function CompanyProfileEditPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    features: [] as string[],
    logo: "",
  });
  
  const [originalData, setOriginalData] = useState({
    name: "",
    industry: "",
    description: "",
    features: [] as string[],
    logo: "",
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          setError("ログインが必要です");
          return;
        }

        setCurrentUserId(user.id);

        const { data: companyData, error: companyError } = await supabase
          .from('company')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (companyError && companyError.code !== 'PGRST116') {
          throw companyError;
        }

        if (companyData) {
          const profileData = {
            name: companyData.name || "",
            industry: companyData.industry || "",
            description: companyData.description || "",
            features: companyData.features || [],
            logo: companyData.logo || "",
          };
          setFormData(profileData);
          setOriginalData(profileData);
        }
      } catch (err: unknown) {
        console.error('プロフィール読み込みエラー:', err);
        setError(err instanceof Error ? err.message : "プロフィールの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [supabase]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const currentFeatures = prev.features;
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];
      
      return {
        ...prev,
        features: newFeatures,
      };
    });
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) {
      errors.push("企業名は必須です");
    }
    
    if (!formData.industry) {
      errors.push("業界の選択は必須です");
    }
    
    if (!formData.description.trim()) {
      errors.push("企業説明は必須です");
    }
    
    if (formData.description.trim().length < 20) {
      errors.push("企業説明は20文字以上で入力してください");
    }
    
    if (errors.length > 0) {
      setError(errors.join("、"));
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!currentUserId) {
      setError("ユーザー情報が取得できません");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data: existingCompany } = await supabase
        .from('company')
        .select('id')
        .eq('user_id', currentUserId)
        .single();

      const companyData = {
        name: formData.name,
        industry: formData.industry,
        description: formData.description,
        features: formData.features,
        logo: formData.logo,
        user_id: currentUserId,
      };

      if (existingCompany) {
        const { error: updateError } = await supabase
          .from('company')
          .update(companyData)
          .eq('user_id', currentUserId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('company')
          .insert([companyData]);

        if (insertError) throw insertError;
      }

      setOriginalData(formData);
      setSuccessMessage("企業プロフィールを更新しました！");
      
      // 保存完了後すぐにプロフィール表示ページにリダイレクト
      router.push("/company/profile");
    } catch (err: unknown) {
      console.error('保存エラー:', err);
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        <Typography variant="h4">企業プロフィール編集</Typography>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!hasChanges() || saving}
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
                label="企業名"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                required
              />
              
              <FormControl fullWidth required>
                <InputLabel>業界</InputLabel>
                <Select
                  value={formData.industry}
                  label="業界"
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="企業説明"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
                helperText="企業の特色や魅力をアピールしてください"
              />

              <TextField
                label="ロゴURL"
                value={formData.logo}
                onChange={(e) => handleInputChange("logo", e.target.value)}
                fullWidth
                helperText="企業ロゴの画像URLを入力してください"
              />
            </Stack>
          </Paper>
        </Box>

        {/* 特徴選択 */}
        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
          <Stack spacing={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                選択中の特徴
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  minHeight: "40px",
                }}
              >
                {formData.features.length > 0 ? (
                  formData.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      onDelete={() => handleFeatureToggle(feature)}
                      color="primary"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    特徴を選択してください。
                  </Typography>
                )}
              </Box>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                利用可能な特徴
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableFeatures.map((feature) => (
                  <Chip
                    key={feature}
                    label={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    color={formData.features.includes(feature) ? "primary" : "default"}
                    variant={formData.features.includes(feature) ? "filled" : "outlined"}
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