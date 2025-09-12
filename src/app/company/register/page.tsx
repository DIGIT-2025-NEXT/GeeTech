'use client';

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
  Avatar,
  Paper,
  Breadcrumbs,
  Divider,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Web as WebIcon,
  Work as WorkIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useState } from 'react';

const steps = ['基本情報', '詳細情報', '確認'];

const industries = [
  'IT・情報サービス', 'メーカー', '金融・保険', '商社', '小売',
  'サービス', '不動産', '建設', '運輸・物流', '医療・福祉',
  'コンサルティング', 'エネルギー', 'その他'
];

const employeeRanges = [
  '1-10人', '11-50人', '51-100人', '101-500人', 
  '501-1000人', '1001-5000人', '5000人以上'
];

export default function CompanyRegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [companyData, setCompanyData] = useState({
    // 基本情報
    companyName: '',
    representativeName: '',
    email: '',
    phone: '',
    website: '',
    // 詳細情報
    industry: '',
    employeeCount: '',
    establishedYear: '',
    capital: '',
    address: '',
    description: '',
    businessContent: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 0) {
      if (!companyData.companyName.trim()) newErrors.companyName = '企業名を入力してください';
      if (!companyData.representativeName.trim()) newErrors.representativeName = '代表者名を入力してください';
      if (!companyData.email.trim()) newErrors.email = 'メールアドレスを入力してください';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) newErrors.email = '有効なメールアドレスを入力してください';
      if (!companyData.phone.trim()) newErrors.phone = '電話番号を入力してください';
    }
    
    if (step === 1) {
      if (!companyData.industry) newErrors.industry = '業界を選択してください';
      if (!companyData.employeeCount) newErrors.employeeCount = '従業員数を選択してください';
      if (!companyData.address.trim()) newErrors.address = '住所を入力してください';
      if (!companyData.description.trim()) newErrors.description = '企業説明を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    // 実際の登録処理をここに実装
    alert('企業登録が完了しました！管理者による審査後、ご連絡いたします。');
    // 登録完了後、企業ページに戻る
    window.location.href = '/company';
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
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                error={!!errors.companyName}
                helperText={errors.companyName}
                InputProps={{
                  startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="代表者名"
                required
                value={companyData.representativeName}
                onChange={(e) => handleInputChange('representativeName', e.target.value)}
                error={!!errors.representativeName}
                helperText={errors.representativeName}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="電話番号"
                required
                value={companyData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ウェブサイト"
                value={companyData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.employeeCount}>
                <InputLabel>従業員数</InputLabel>
                <Select
                  value={companyData.employeeCount}
                  label="従業員数"
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                >
                  {employeeRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="設立年"
                type="number"
                value={companyData.establishedYear}
                onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="資本金（万円）"
                type="number"
                value={companyData.capital}
                onChange={(e) => handleInputChange('capital', e.target.value)}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="所在地"
                required
                value={companyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
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
                onChange={(e) => handleInputChange('description', e.target.value)}
                error={!!errors.description}
                helperText={errors.description || '企業の特色や魅力をアピールしてください'}
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
                onChange={(e) => handleInputChange('businessContent', e.target.value)}
                placeholder="主な事業内容を詳しく教えてください"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>登録内容の確認</AlertTitle>
              以下の内容で企業登録を行います。内容をご確認ください。
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    基本情報
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">企業名</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{companyData.companyName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">代表者名</Typography>
                      <Typography variant="body1">{companyData.representativeName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                      <Typography variant="body1">{companyData.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">電話番号</Typography>
                      <Typography variant="body1">{companyData.phone}</Typography>
                    </Grid>
                    {companyData.website && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">ウェブサイト</Typography>
                        <Typography variant="body1">{companyData.website}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    詳細情報
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">業界</Typography>
                      <Chip label={companyData.industry} color="primary" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">従業員数</Typography>
                      <Typography variant="body1">{companyData.employeeCount}</Typography>
                    </Grid>
                    {companyData.establishedYear && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">設立年</Typography>
                        <Typography variant="body1">{companyData.establishedYear}年</Typography>
                      </Grid>
                    )}
                    {companyData.capital && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">資本金</Typography>
                        <Typography variant="body1">{companyData.capital}万円</Typography>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">所在地</Typography>
                      <Typography variant="body1">{companyData.address}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">企業説明</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{companyData.description}</Typography>
                    </Grid>
                    {companyData.businessContent && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">事業内容</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{companyData.businessContent}</Typography>
                      </Grid>
                    )}
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Typography 
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => window.location.href = '/'}
          >
            ホーム
          </Typography>
          <Typography 
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => window.location.href = '/company'}
          >
            企業向けページ
          </Typography>
          <Typography color="text.primary">企業登録</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
              sx={{ px: 4 }}
            >
              戻る
            </Button>
            
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              size="large"
              sx={{ px: 4 }}
              startIcon={activeStep === steps.length - 1 ? <CheckIcon /> : undefined}
            >
              {activeStep === steps.length - 1 ? '登録完了' : '次へ'}
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
          <br />
          • 登録情報は後からダッシュボードで変更可能です
        </Alert>
      </Box>
    </Container>
  );
}