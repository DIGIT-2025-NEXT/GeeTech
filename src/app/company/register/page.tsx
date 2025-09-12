"use client";

import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Breadcrumbs,
  Divider,
  Alert,
  AlertTitle,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Web as WebIcon,
  Work as WorkIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { step1Schema, step2Schema } from "@/lib/schema/companyApplication";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";

const steps = ["基本情報", "詳細情報", "確認"];

// industries_rows.csv の内容を反映
const industries = [
  { id: "e19c8767-418e-44fe-b826-beae8c0db6d0", name: "IT・情報サービス" },
  { id: "25d490cd-d504-4a9c-8903-0edfeac3bc30", name: "メーカー" },
  { id: "c276cff7-7e82-483e-8f26-3b69a311b3c4", name: "金融・保険" },
  { id: "59f427de-fce5-4260-8a13-91fc846d0432", name: "商社" },
  { id: "b503d256-0520-4db6-8b4a-8e4550030a08", name: "小売" },
  { id: "de08d442-007e-45f1-8248-bdcef28ea626", name: "サービス" },
  { id: "d4ee691a-aed1-43df-a34c-fa5e8b65a3c8", name: "不動産" },
  { id: "c124ca65-a92b-42bb-9845-241dadeb71f3", name: "建設" },
  { id: "5a4d9120-a55d-4ca2-b288-767ed1682ca0", name: "運輸・物流" },
  { id: "6c30ed4c-7a7a-49c9-b690-a3a6749b1ac8", name: "医療・福祉" },
  { id: "b8e9c061-d83f-42d3-bc66-f64471aa335a", name: "コンサルティング" },
  { id: "f132272a-9aca-48c9-8127-315cae2da276", name: "エネルギー" },
  { id: "1a637c03-c149-4722-980f-2efcf10c0de7", name: "その他" },
];

const employeeRanges = [
  "1-10人",
  "11-50人",
  "51-100人",
  "101-500人",
  "501-1000人",
  "1001-5000人",
  "5000人以上",
];

export default function CompanyRegisterPage() {
  const router = useRouter();
  const { user, profile, loading: profileLoading } = useProfile();
  
  const [activeStep, setActiveStep] = useState(0);
  const [companyData, setCompanyData] = useState({
    // 基本情報
    companyName: "",
    representativeName: "",
    email: "",
    phone: "",
    website: "",
    // 詳細情報
    industry: "", // industry ID を格納
    employeeCount: "",
    establishedYear: "",
    capital: "",
    address: "",
    description: "",
    businessContent: "",
    is_without_recompense: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // アクセス制御をuseEffect内で実装
  useEffect(() => {
    // プロファイル情報のローディング中は何もしない
    if (profileLoading) return;

    // 未認証の場合はログインページにリダイレクト
    if (!user) {
      console.log('🚫 No user, redirecting to login');
      router.replace('/login');
      return;
    }

    // プロファイルが存在しない場合はプロファイル作成ページにリダイレクト
    if (!profile) {
      console.log('🚫 No profile, redirecting to profile creation');
      router.replace('/profile/create');
      return;
    }

    // profile_typeが"company"以外の場合はアクセス拒否
    if (profile.profile_type !== 'company') {
      console.log('🚫 Access denied for profile_type:', profile.profile_type, '- redirecting to unauthorized');
      router.replace('/unauthorized');
      return;
    }

    console.log('✅ Access granted for company user');
  }, [user, profile, profileLoading, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setCompanyData((prev) => ({
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

  const validateStep = (step: number) => {
    let schema;
    if (step === 0) {
      schema = step1Schema;
    } else if (step === 1) {
      schema = step2Schema;
    } else {
      return true; // 確認画面ではバリデーション不要
    }

    const result = schema.safeParse(companyData);

    if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      setSubmitError(
        "入力内容にエラーがあります。前のステップに戻って確認してください。"
      );
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/company/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "登録に失敗しました。");
      }

      alert(
        "企業登録申請が完了しました！管理者による審査後、ご連絡いたします。"
      );
      window.location.href = "/company";
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message || "予期せぬエラーが発生しました。");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="企業名"
                required
                value={companyData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                error={!!errors.companyName}
                helperText={errors.companyName}
                InputProps={{
                  startAdornment: (
                    <BusinessIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="代表者名"
                required
                value={companyData.representativeName}
                onChange={(e) =>
                  handleInputChange("representativeName", e.target.value)
                }
                error={!!errors.representativeName}
                helperText={errors.representativeName}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="メールアドレス"
                type="email"
                required
                value={companyData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="電話番号"
                required
                value={companyData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ウェブサイト"
                value={companyData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://example.com"
                error={!!errors.website}
                helperText={errors.website}
                InputProps={{
                  startAdornment: (
                    <WebIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.industry}>
                <InputLabel>業界</InputLabel>
                <Select
                  value={companyData.industry}
                  label="業界"
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.industry && (
                  <FormHelperText>{errors.industry}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.employeeCount}>
                <InputLabel>従業員数</InputLabel>
                <Select
                  value={companyData.employeeCount}
                  label="従業員数"
                  onChange={(e) =>
                    handleInputChange("employeeCount", e.target.value)
                  }
                >
                  {employeeRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
                {errors.employeeCount && (
                  <FormHelperText>{errors.employeeCount}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="設立年"
                type="number"
                value={companyData.establishedYear}
                onChange={(e) =>
                  handleInputChange("establishedYear", e.target.value)
                }
                error={!!errors.establishedYear}
                helperText={errors.establishedYear}
                inputProps={{ min: 1900 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="資本金（万円）"
                type="number"
                value={companyData.capital}
                onChange={(e) => handleInputChange("capital", e.target.value)}
                error={!!errors.capital}
                helperText={errors.capital}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="所在地"
                required
                value={companyData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  startAdornment: (
                    <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="企業説明"
                required
                multiline
                rows={4}
                value={companyData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={!!errors.description}
                helperText={
                  errors.description || "企業の特色や魅力をアピールしてください"
                }
                placeholder="当社は..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="事業内容"
                multiline
                rows={3}
                value={companyData.businessContent}
                onChange={(e) =>
                  handleInputChange("businessContent", e.target.value)
                }
                placeholder="主な事業内容を詳しく教えてください"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={companyData.is_without_recompense}
                    onChange={(e) =>
                      handleInputChange(
                        "is_without_recompense",
                        e.target.checked
                      )
                    }
                    name="is_without_recompense"
                    color="primary"
                  />
                }
                label="無償での募集（インターンシップ等）"
              />
            </Grid>
          </Grid>
        );

      case 2:
        const selectedIndustry = industries.find(
          (ind) => ind.id === companyData.industry
        );
        return (
          <Box>
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <AlertTitle>登録エラー</AlertTitle>
                {submitError}
              </Alert>
            )}
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>登録内容の確認</AlertTitle>
              以下の内容で企業登録を行います。内容をご確認ください。
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <BusinessIcon sx={{ mr: 1 }} />
                    基本情報
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        企業名
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {companyData.companyName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        代表者名
                      </Typography>
                      <Typography variant="body1">
                        {companyData.representativeName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        メールアドレス
                      </Typography>
                      <Typography variant="body1">
                        {companyData.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        電話番号
                      </Typography>
                      <Typography variant="body1">
                        {companyData.phone}
                      </Typography>
                    </Grid>
                    {companyData.website && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          ウェブサイト
                        </Typography>
                        <Typography variant="body1">
                          {companyData.website}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <WorkIcon sx={{ mr: 1 }} />
                    詳細情報
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        業界
                      </Typography>
                      <Chip
                        label={selectedIndustry?.name || "未選択"}
                        color="primary"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        従業員数
                      </Typography>
                      <Typography variant="body1">
                        {companyData.employeeCount}
                      </Typography>
                    </Grid>
                    {companyData.establishedYear && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          設立年
                        </Typography>
                        <Typography variant="body1">
                          {companyData.establishedYear}年
                        </Typography>
                      </Grid>
                    )}
                    {companyData.capital && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          資本金
                        </Typography>
                        <Typography variant="body1">
                          {companyData.capital}万円
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        所在地
                      </Typography>
                      <Typography variant="body1">
                        {companyData.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        企業説明
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-line" }}
                      >
                        {companyData.description}
                      </Typography>
                    </Grid>
                    {companyData.businessContent && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          事業内容
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {companyData.businessContent}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        無償での募集
                      </Typography>
                      <Typography variant="body1">
                        {companyData.is_without_recompense ? "はい" : "いいえ"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  // プロファイルローディング中はローディング画面を表示
  if (profileLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            onClick={() => (window.location.href = "/company")}
          >
            企業向けページ
          </Typography>
          <Typography color="text.primary">企業登録</Typography>
        </Breadcrumbs>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          企業登録
        </Typography>
        <Typography variant="h6" color="text.secondary">
          優秀な学生との出会いを始めましょう
        </Typography>
      </Box>

      {/* ステッパー */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* メインコンテンツ */}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {renderStepContent()}

          {/* ボタン */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleBack}
              variant="outlined"
              size="large"
              sx={{ px: 4 }}
            >
              戻る
            </Button>

            <Button
              variant="contained"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
              size="large"
              sx={{ px: 4 }}
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  <CheckIcon />
                ) : undefined
              }
            >
              {activeStep === steps.length - 1
                ? isSubmitting
                  ? "登録中..."
                  : "登録申請"
                : "次へ"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">
          <AlertTitle>ご注意</AlertTitle>
          • 企業登録後、管理者による審査を行います（通常1-2営業日）
          <br />
          • 審査完了後、登録いただいたメールアドレスに通知をお送りします
          <br />• 登録情報は後からダッシュボードで変更可能です
        </Alert>
      </Box>
    </Container>
  );
}
