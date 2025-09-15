"use client";

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
  Email as EmailIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface CompanyApplication {
  id: string;
  company_name: string;
  president_name: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  industry_id: string;
  number_of_employees?: number;
  year_of_establishment?: string;
  address: string;
  description: string;
  business_detail?: string;
  is_without_recompense: boolean;
  created_at: string;
  application_status: 'pending' | 'approved' | 'rejected';
  industries?: {
    id: string;
    name: string;
  };
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<CompanyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CompanyApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const supabase = createClient();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);

      // まず申請データを取得
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('company_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      // 業界データを別途取得
      const { data: industriesData, error: industriesError } = await supabase
        .from('industries')
        .select('id, name');

      if (industriesError) {
        console.warn('Industries fetch failed:', industriesError);
      }

      // データをマージ
      const mergedData = (applicationsData || []).map(app => ({
        ...app,
        industries: industriesData?.find(ind => ind.id === app.industry_id) || null
      }));

      setApplications(mergedData);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('申請データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAction = (application: CompanyApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedApplication || !actionType) return;

    setProcessing(true);
    try {
      if (actionType === 'approve') {
        // company_applicationsの状態を更新
        const { error: updateError } = await supabase
          .from('company_applications')
          .update({
            application_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedApplication.id);

        if (updateError) throw updateError;

        // companyテーブルに新しい企業を作成
        const { error: insertError } = await supabase
          .from('company')
          .insert({
            name: selectedApplication.company_name,
            industry: selectedApplication.industries?.name || '',
            description: selectedApplication.description,
            features: [],
            user_id: null, // 後で手動で関連付け
            is_verified: true, // 管理者承認により認証済み
          });

        if (insertError) throw insertError;
      } else {
        // 拒否の場合
        const { error } = await supabase
          .from('company_applications')
          .update({
            application_status: 'rejected',
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedApplication.id);

        if (error) throw error;
      }

      await fetchApplications();
      setDialogOpen(false);
      setSelectedApplication(null);
      setActionType(null);
    } catch (err) {
      console.error('Error processing application:', err);
      setError('処理中にエラーが発生しました');
    } finally {
      setProcessing(false);
    }
  };

  const toggleRowExpansion = (applicationId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId);
      } else {
        newSet.add(applicationId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '承認済み';
      case 'rejected':
        return '拒否';
      default:
        return '審査中';
    }
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            ホーム
          </Link>
          <Typography color="text.primary">管理者</Typography>
          <Typography color="text.primary">企業申請管理</Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          企業申請管理
        </Typography>
        <Typography variant="h6" color="text.secondary">
          企業登録申請の確認・承認を行います
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {applications.filter(app => app.application_status === 'pending').length}
                  </Typography>
                  <Typography variant="body2">
                    審査待ち
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {applications.filter(app => app.application_status === 'approved').length}
                  </Typography>
                  <Typography variant="body2">
                    承認済み
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {applications.filter(app => app.application_status === 'rejected').length}
                  </Typography>
                  <Typography variant="body2">
                    拒否
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
                <TableCell>代表者</TableCell>
                <TableCell>業界</TableCell>
                <TableCell>申請日</TableCell>
                <TableCell>ステータス</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <React.Fragment key={application.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        onClick={() => toggleRowExpansion(application.id)}
                        size="small"
                      >
                        {expandedRows.has(application.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {application.company_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{application.president_name}</TableCell>
                    <TableCell>{application.industries?.name || '未設定'}</TableCell>
                    <TableCell>
                      {new Date(application.created_at).toLocaleDateString('ja-JP')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(application.application_status)}
                        color={getStatusColor(application.application_status) as 'success' | 'error' | 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {application.application_status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleAction(application, 'approve')}
                          >
                            承認
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CloseIcon />}
                            onClick={() => handleAction(application, 'reject')}
                          >
                            拒否
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedRows.has(application.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                  <BusinessIcon sx={{ mr: 1 }} />
                                  基本情報
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                        メール:
                                      </Typography>
                                      <Typography variant="body2">
                                        {application.contact_email}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                        電話:
                                      </Typography>
                                      <Typography variant="body2">
                                        {application.contact_phone}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  {application.website && (
                                    <Grid item xs={12}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                          サイト:
                                        </Typography>
                                        <Typography variant="body2">
                                          <a href={application.website} target="_blank" rel="noopener noreferrer">
                                            {application.website}
                                          </a>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  )}
                                  <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                        住所:
                                      </Typography>
                                      <Typography variant="body2">
                                        {application.address}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  詳細情報
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  企業説明:
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                  {application.description}
                                </Typography>
                                {application.business_detail && (
                                  <>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                      事業内容:
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                      {application.business_detail}
                                    </Typography>
                                  </>
                                )}
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {application.number_of_employees && (
                                    <Chip
                                      label={`従業員: ${application.number_of_employees}人`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                  {application.year_of_establishment && (
                                    <Chip
                                      label={`設立: ${new Date(application.year_of_establishment).getFullYear()}年`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                  {application.is_without_recompense && (
                                    <Chip
                                      label="無償募集"
                                      size="small"
                                      color="info"
                                    />
                                  )}
                                </Box>
                              </Paper>
                            </Grid>
                          </Grid>
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

      {/* 承認/拒否ダイアログ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? '申請を承認' : '申請を拒否'}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Typography variant="body1" gutterBottom>
                企業名: <strong>{selectedApplication.company_name}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
                代表者: <strong>{selectedApplication.president_name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                この操作は取り消しできません。よろしいですか？
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
            color={actionType === 'approve' ? 'success' : 'error'}
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : null}
          >
            {processing ? '処理中...' : actionType === 'approve' ? '承認する' : '拒否する'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}