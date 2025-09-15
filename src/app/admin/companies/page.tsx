"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Paper,
  Breadcrumbs,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  features?: string[];
  user_id?: string;
  is_verified: boolean;
  created_at?: string;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'verify' | 'unverify' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('企業データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleAction = (company: Company, action: 'verify' | 'unverify') => {
    setSelectedCompany(company);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedCompany || !actionType) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('company')
        .update({
          is_verified: actionType === 'verify',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCompany.id);

      if (error) throw error;

      await fetchCompanies();
      setDialogOpen(false);
      setSelectedCompany(null);
      setActionType(null);
    } catch (err) {
      console.error('Error updating company:', err);
      setError('処理中にエラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };

  const toggleRowExpansion = (companyId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? 'success' : 'warning';
  };

  const getStatusText = (isVerified: boolean) => {
    return isVerified ? '認証済み' : '未認証';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const verifiedCount = companies.filter(company => company.is_verified).length;
  const unverifiedCount = companies.filter(company => !company.is_verified).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">管理者</Typography>
          <Typography color="text.primary">企業認証管理</Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          企業認証管理
        </Typography>
        <Typography variant="h6" color="text.secondary">
          既存企業の認証ステータスを管理します
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {companies.length}
                  </Typography>
                  <Typography variant="body2">
                    総企業数
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {verifiedCount}
                  </Typography>
                  <Typography variant="body2">
                    認証済み
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {unverifiedCount}
                  </Typography>
                  <Typography variant="body2">
                    未認証
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>企業名</TableCell>
                <TableCell>業界</TableCell>
                <TableCell>認証ステータス</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <React.Fragment key={company.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        onClick={() => toggleRowExpansion(company.id)}
                        size="small"
                      >
                        {expandedRows.has(company.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {company.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(company.is_verified)}
                        color={getStatusColor(company.is_verified) as 'success' | 'warning'}
                        size="small"
                        icon={company.is_verified ? <VerifiedIcon /> : <PendingIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {!company.is_verified ? (
                          <Button
                            variant="contained"
                            sx={{ bgcolor: '#666666', color: 'white' }}
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleAction(company, 'verify')}
                          >
                            認証
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            startIcon={<CloseIcon />}
                            onClick={() => handleAction(company, 'unverify')}
                          >
                            認証解除
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                      <Collapse in={expandedRows.has(company.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                              <BusinessIcon sx={{ mr: 1 }} />
                              企業詳細
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  企業説明:
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                  {company.description}
                                </Typography>
                              </Grid>
                              {company.features && company.features.length > 0 && (
                                <Grid item xs={12}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    特徴:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {company.features.map((feature, index) => (
                                      <Chip
                                        key={index}
                                        label={feature}
                                        size="small"
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                </Grid>
                              )}
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                  企業ID: {company.id}
                                </Typography>
                                {company.user_id && (
                                  <Typography variant="body2" color="text.secondary">
                                    関連ユーザーID: {company.user_id}
                                  </Typography>
                                )}
                              </Grid>
                            </Grid>
                          </Paper>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 認証/認証解除ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'verify' ? '企業を認証' : '企業の認証を解除'}
        </DialogTitle>
        <DialogContent>
          {selectedCompany && (
            <Box>
              <Typography variant="body1" gutterBottom>
                企業名: <strong>{selectedCompany.name}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                業界: <strong>{selectedCompany.industry}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {actionType === 'verify'
                  ? 'この企業を認証すると、学生ページに表示されるようになります。'
                  : 'この企業の認証を解除すると、学生ページから非表示になります。'
                }
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={processing}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmAction}
            color={actionType === 'verify' ? 'success' : 'warning'}
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? '処理中...' : actionType === 'verify' ? '認証する' : '認証解除する'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}