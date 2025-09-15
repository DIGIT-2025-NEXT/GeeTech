"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Breadcrumbs,
  Alert,
  AlertTitle,
  CircularProgress,
  Autocomplete,
  Chip,
  Avatar,
} from "@mui/material";
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

// 北九州市内の大学・専門学校・高専リスト
const universities = [
  "北九州市立大学",
  "九州工業大学",
  "産業医科大学",
  "西南女学院大学",
  "九州共立大学",
  "九州国際大学",
  "西日本工業大学",
  "北九州市立大学短期大学部",
  "西南女学院大学短期大学部",
  "九州栄養福祉大学",
  "北九州工業高等専門学校",
  "麻生情報ビジネス専門学校 北九州校",
  "専門学校 麻生工科自動車大学校",
  "KCS北九州情報専門学校",
  "北九州調理製菓専門学校",
  "北九州リハビリテーション学院",
  "福岡県私設病院協会 看護学校",
  "北九州保育福祉専門学校",
  "九州医療スポーツ専門学校",
  "北九州ビューティーモード専門学校",
  "専門学校 北九州自動車大学校",
  "北九州予備校専門学校",
  "九州ビジネス専門学校",
  "福岡県理容美容専門学校",
  "西鉄国際ビジネスカレッジ",
  "福岡医療専門学校",
  "九州電気専門学校",
  "その他"
];

// 技術スキルリスト
const techSkills = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "React", "Vue.js", "Angular", "Node.js", "Express", "Next.js", "Django",
  "Flask", "Spring", "Laravel", "Ruby on Rails", "ASP.NET",
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "Docker", "Kubernetes",
  "AWS", "Google Cloud", "Azure", "Git", "CI/CD", "Linux", "データサイエンス",
  "機械学習", "AI", "ブロックチェーン", "IoT", "AR/VR", "その他"
];

export default function StudentProfileCreatePage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [studentData, setStudentData] = useState({
    name: "",
    university: "",
    bio: "",
    skills: [] as string[],
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string | string[]) => {
    setStudentData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!studentData.name.trim()) {
      newErrors.name = "氏名は必須です";
    }
    if (!studentData.university.trim()) {
      newErrors.university = "大学名は必須です";
    }
    if (!studentData.bio.trim()) {
      newErrors.bio = "自己紹介は必須です";
    }
    if (studentData.skills.length === 0) {
      newErrors.skills = "少なくとも1つのスキルを選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('画像のアップロードに失敗しました');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Avatar upload error:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("ログインが必要です");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let avatarUrl = studentData.avatar;

      // アバター画像をアップロード
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (!uploadedUrl) {
          throw new Error('画像のアップロードに失敗しました');
        }
        avatarUrl = uploadedUrl;
      }

      const response = await fetch("/api/students/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...studentData,
          avatar: avatarUrl,
          id: user.id, // 現在のユーザーIDを使用
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "プロフィール作成に失敗しました。");
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        window.location.href = "/students";
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message || "予期せぬエラーが発生しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          <AlertTitle>ログインが必要です</AlertTitle>
          学生プロフィールを作成するにはログインしてください。
        </Alert>
      </Container>
    );
  }

  if (submitSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ bgcolor: '#f5f5f5', color: '#000000' }}>
          <AlertTitle>プロフィール作成完了</AlertTitle>
          学生プロフィールが正常に作成されました。企業一覧ページにリダイレクトします...
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => (window.location.href = "/")}
          >
            ホーム
          </Typography>
          <Typography
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => (window.location.href = "/students")}
          >
            学生向けページ
          </Typography>
          <Typography color="text.primary">学生プロフィール作成</Typography>
        </Breadcrumbs>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          学生プロフィール作成
        </Typography>
        <Typography variant="h6" color="text.secondary">
          企業にアピールするためのプロフィールを作成しましょう
        </Typography>
      </Box>

      {/* エラー表示 */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>エラー</AlertTitle>
          {submitError}
        </Alert>
      )}

      {/* メインフォーム */}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="氏名"
                required
                value={studentData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                options={universities}
                value={studentData.university}
                onChange={(_, newValue) =>
                  handleInputChange("university", newValue || "")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="大学名"
                    required
                    error={!!errors.university}
                    helperText={errors.university}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <SchoolIcon sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                )}
                freeSolo
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="自己紹介"
                required
                multiline
                rows={6}
                value={studentData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                error={!!errors.bio}
                helperText={
                  errors.bio ||
                  `${studentData.bio.length}/1000文字 - あなたの経験、興味、目標について教えてください`
                }
                placeholder="私は..."
                inputProps={{ maxLength: 1000 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={techSkills}
                value={studentData.skills}
                onChange={(_, newValue) =>
                  handleInputChange("skills", newValue)
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="技術スキル"
                    required
                    placeholder="スキルを選択..."
                    error={!!errors.skills}
                    helperText={
                      errors.skills || "持っている技術スキルを選択してください"
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <CodeIcon sx={{ mr: 1, color: "text.secondary" }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                freeSolo
              />
            </Grid>

            <Grid item xs={12}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  プロフィール画像（任意）
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 80, height: 80 }}
                  >
                    <PersonIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mb: 1 }}
                    >
                      画像を選択
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Button>
                    <Typography variant="caption" display="block" color="text.secondary">
                      JPG, PNG, GIF対応（最大5MB）
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* 送信ボタン */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{ px: 6, py: 1.5 }}
            >
              {isSubmitting ? "作成中..." : "プロフィール作成"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          <AlertTitle>ご注意</AlertTitle>
          • このプロフィールは学生一覧ページに表示されます
          <br />
          • 企業があなたのプロフィールを見てコンタクトを取る可能性があります
          <br />• 作成後もプロフィール編集ページで内容を変更できます
        </Alert>
      </Box>
    </Container>
  );
}