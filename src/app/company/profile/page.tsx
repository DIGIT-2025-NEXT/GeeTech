"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Alert,
  Stack,
  Button,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  description: string;
  features: string[];
  logo: string;
}

export default function CompanyProfilePage() {
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          setError("ログインが必要です");
          return;
        }

        const { data: companyData, error: companyError } = await supabase
          .from('company')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (companyError && companyError.code !== 'PGRST116') {
          throw companyError;
        }

        if (companyData) {
          setProfile({
            id: companyData.id,
            name: companyData.name || "",
            industry: companyData.industry || "",
            description: companyData.description || "",
            features: companyData.features || [],
            logo: companyData.logo || "",
          });
        }
      } catch (err: unknown) {
        console.error('プロフィール読み込みエラー:', err);
        setError(err instanceof Error ? err.message : "プロフィールの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [supabase]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <BusinessIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            企業プロフィールが登録されていません
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            企業プロフィールを登録して、学生にアピールしましょう。
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<EditIcon />}
            component={Link}
            href="/company/profile/edit"
          >
            プロフィールを作成
          </Button>
        </Paper>
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
          mb: 3,
        }}
      >
        <Typography variant="h4">企業プロフィール</Typography>
        <Button 
          variant="contained" 
          startIcon={<EditIcon />}
          component={Link}
          href="/company/profile/edit"
        >
          編集する
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* 基本情報 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={profile.logo}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 3,
                  bgcolor: "primary.main"
                }}
              >
                <BusinessIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {profile.name}
                </Typography>
                <Chip
                  label={profile.industry}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <DescriptionIcon sx={{ mr: 1 }} />
                企業説明
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
              >
                {profile.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* サイド情報 */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* 企業の特徴 */}
            <Paper sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <WorkIcon sx={{ mr: 1 }} />
                企業の特徴
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {profile.features.length > 0 ? (
                  profile.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    特徴が設定されていません
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* 企業情報 */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                企業情報
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    業界
                  </Typography>
                  <Typography variant="body1">
                    {profile.industry}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    企業ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {profile.id}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}