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
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
            <Typography variant="h6" className="mt-6 mb-2 text-lg font-semibold">基本情報</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* 企業名 - 2カラム幅 */}
              <div className="md:col-span-2">
                <label htmlFor="companyName" className="text-sm font-medium mb-1 block">
                  企業名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BusinessIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <TextField
                    id="companyName"
                    fullWidth
                    value={companyData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    error={!!errors.companyName}
                    aria-invalid={!!errors.companyName}
                    aria-describedby={errors.companyName ? "companyName-error" : undefined}
                    className="h-11"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                        paddingLeft: '64px',
                      }
                    }}
                  />
                </div>
                {errors.companyName && (
                  <p id="companyName-error" className="mt-1 text-xs text-red-600">
                    {errors.companyName}
                  </p>
                )}
              </div>

              {/* 代表者名 */}
              <div>
                <label htmlFor="representativeName" className="text-sm font-medium mb-1 block">
                  代表者名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PersonIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <TextField
                    id="representativeName"
                    fullWidth
                    value={companyData.representativeName}
                    onChange={(e) => handleInputChange('representativeName', e.target.value)}
                    error={!!errors.representativeName}
                    aria-invalid={!!errors.representativeName}
                    aria-describedby={errors.representativeName ? "representativeName-error" : undefined}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                        paddingLeft: '56px',
                      }
                    }}
                  />
                </div>
                {errors.representativeName && (
                  <p id="representativeName-error" className="mt-1 text-xs text-red-600">
                    {errors.representativeName}
                  </p>
                )}
              </div>

              {/* メールアドレス */}
              <div>
                <label htmlFor="email" className="text-sm font-medium mb-1 block">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <EmailIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <TextField
                    id="email"
                    fullWidth
                    type="email"
                    value={companyData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                        paddingLeft: '56px',
                      }
                    }}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* 電話番号 */}
              <div>
                <label htmlFor="phone" className="text-sm font-medium mb-1 block">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <TextField
                    id="phone"
                    fullWidth
                    value={companyData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                        paddingLeft: '56px',
                      }
                    }}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-xs text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* ウェブサイト - 2カラム幅 */}
              <div className="md:col-span-2">
                <label htmlFor="website" className="text-sm font-medium mb-1 block">
                  ウェブサイト
                </label>
                <div className="relative">
                  <WebIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <TextField
                    id="website"
                    fullWidth
                    value={companyData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                        paddingLeft: '56px',
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">
            <Typography variant="h6" className="mt-6 mb-2 text-lg font-semibold">詳細情報</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* 業界 */}
              <div>
                <label htmlFor="industry" className="text-sm font-medium mb-1 block">
                  業界 <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth required error={!!errors.industry}>
                  <Select
                    id="industry"
                    value={companyData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    aria-invalid={!!errors.industry}
                    aria-describedby={errors.industry ? "industry-error" : undefined}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                      }
                    }}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.industry && (
                  <p id="industry-error" className="mt-1 text-xs text-red-600">
                    {errors.industry}
                  </p>
                )}
              </div>

              {/* 従業員数 */}
              <div>
                <label htmlFor="employeeCount" className="text-sm font-medium mb-1 block">
                  従業員数 <span className="text-red-500">*</span>
                </label>
                <FormControl fullWidth required error={!!errors.employeeCount}>
                  <Select
                    id="employeeCount"
                    value={companyData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    aria-invalid={!!errors.employeeCount}
                    aria-describedby={errors.employeeCount ? "employeeCount-error" : undefined}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                      }
                    }}
                  >
                    {employeeRanges.map((range) => (
                      <MenuItem key={range} value={range}>
                        {range}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.employeeCount && (
                  <p id="employeeCount-error" className="mt-1 text-xs text-red-600">
                    {errors.employeeCount}
                  </p>
                )}
              </div>

              {/* 設立年 */}
              <div>
                <label htmlFor="establishedYear" className="text-sm font-medium mb-1 block">
                  設立年
                </label>
                <TextField
                  id="establishedYear"
                  fullWidth
                  type="number"
                  value={companyData.establishedYear}
                  onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '44px',
                      borderRadius: '12px',
                    }
                  }}
                />
              </div>

              {/* 資本金 */}
              <div>
                <label htmlFor="capital" className="text-sm font-medium mb-1 block">
                  資本金（万円）
                </label>
                <TextField
                  id="capital"
                  fullWidth
                  type="number"
                  value={companyData.capital}
                  onChange={(e) => handleInputChange('capital', e.target.value)}
                  inputProps={{ min: 0 }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '44px',
                      borderRadius: '12px',
                    }
                  }}
                />
              </div>

              {/* 所在地 - 2カラム幅 */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium mb-1 block">
                  所在地 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LocationIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <TextField
                    id="address"
                    fullWidth
                    value={companyData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={!!errors.address}
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? "address-error" : undefined}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '44px',
                        borderRadius: '12px',
                        paddingLeft: '56px',
                      }
                    }}
                  />
                </div>
                {errors.address && (
                  <p id="address-error" className="mt-1 text-xs text-red-600">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* 企業説明 - 2カラム幅 */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium mb-1 block">
                  企業説明 <span className="text-red-500">*</span>
                </label>
                <TextField
                  id="description"
                  fullWidth
                  multiline
                  rows={4}
                  value={companyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={!!errors.description}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="当社は..."
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
                {errors.description ? (
                  <p id="description-error" className="mt-1 text-xs text-red-600">
                    {errors.description}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    企業の特色や魅力をアピールしてください
                  </p>
                )}
              </div>

              {/* 事業内容 - 2カラム幅 */}
              <div className="md:col-span-2">
                <label htmlFor="businessContent" className="text-sm font-medium mb-1 block">
                  事業内容
                </label>
                <TextField
                  id="businessContent"
                  fullWidth
                  multiline
                  rows={3}
                  value={companyData.businessContent}
                  onChange={(e) => handleInputChange('businessContent', e.target.value)}
                  placeholder="主な事業内容を詳しく教えてください"
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '12px',
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>登録内容の確認</AlertTitle>
              以下の内容で企業登録を行います。内容をご確認ください。
            </Alert>

            <Grid container spacing={3}>
              <Grid xs={12}>
                <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1 }} />
                    基本情報
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">企業名</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{companyData.companyName}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">代表者名</Typography>
                      <Typography variant="body1">{companyData.representativeName}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                      <Typography variant="body1">{companyData.email}</Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">電話番号</Typography>
                      <Typography variant="body1">{companyData.phone}</Typography>
                    </Grid>
                    {companyData.website && (
                      <Grid xs={12}>
                        <Typography variant="body2" color="text.secondary">ウェブサイト</Typography>
                        <Typography variant="body1">{companyData.website}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>

              <Grid xs={12}>
                <Paper elevation={1} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    詳細情報
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">業界</Typography>
                      <Chip label={companyData.industry} color="primary" variant="outlined" />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">従業員数</Typography>
                      <Typography variant="body1">{companyData.employeeCount}</Typography>
                    </Grid>
                    {companyData.establishedYear && (
                      <Grid xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">設立年</Typography>
                        <Typography variant="body1">{companyData.establishedYear}年</Typography>
                      </Grid>
                    )}
                    {companyData.capital && (
                      <Grid xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">資本金</Typography>
                        <Typography variant="body1">{companyData.capital}万円</Typography>
                      </Grid>
                    )}
                    <Grid xs={12}>
                      <Typography variant="body2" color="text.secondary">所在地</Typography>
                      <Typography variant="body1">{companyData.address}</Typography>
                    </Grid>
                    <Grid xs={12}>
                      <Typography variant="body2" color="text.secondary">企業説明</Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{companyData.description}</Typography>
                    </Grid>
                    {companyData.businessContent && (
                      <Grid xs={12}>
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
          <div className="flex justify-center gap-6 pt-8 max-w-3xl mx-auto px-4 md:px-6">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              className="min-w-[140px] h-11"
              sx={{ 
                minWidth: '140px',
                height: '44px',
                borderRadius: '12px',
                px: 4 
              }}
            >
              戻る
            </Button>
            
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              className="min-w-[140px] h-11"
              sx={{ 
                minWidth: '140px',
                height: '44px',
                borderRadius: '12px',
                px: 4 
              }}
              startIcon={activeStep === steps.length - 1 ? <CheckIcon /> : undefined}
            >
              {activeStep === steps.length - 1 ? '登録完了' : '次へ'}
            </Button>
          </div>
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