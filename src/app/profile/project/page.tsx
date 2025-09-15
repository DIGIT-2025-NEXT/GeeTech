"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fab,
  Card,
  CardContent,
  Stack,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Tables, TablesInsert, TablesUpdate, Enums } from "@/lib/types_db";

type Project = Tables<"project">;
type ProjectInsert = TablesInsert<"project">;
type ProjectUpdate = TablesUpdate<"project">;
type ProjectStatus = Enums<"project_status">;

interface Skill {
  id: string;
  skill_name: string;
  icon_name: string | null;
}

export default function ProjectManagePage() {
  const router = useRouter();
  const { user, loading: profileLoading, profile } = useProfile();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    status: "draft" as ProjectStatus,
  });

  const supabase = createClient();

  useEffect(() => {
    if (profileLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (profile?.profile_type !== "company") {
      router.replace("/");
      return;
    }

    fetchProjects();
    fetchSkills();
  }, [user, profile, profileLoading, router]);

  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: companyData, error: companyError } = await supabase
        .from("company")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (companyError) throw companyError;

      const { data, error } = await supabase
        .from("project")
        .select("*")
        .eq("company_id", companyData.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("プロジェクトの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("skill_name");

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const handleCreate = async () => {
    if (!user || !formData.title.trim()) return;

    try {
      const { data: companyData, error: companyError } = await supabase
        .from("company")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (companyError) throw companyError;

      const projectData: ProjectInsert = {
        company_id: companyData.id,
        title: formData.title,
        description: formData.description || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        status: formData.status,
      };

      const { error } = await supabase.from("project").insert(projectData);

      if (error) throw error;

      setCreateDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error("Error creating project:", err);
      setError("プロジェクトの作成に失敗しました");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProject || !formData.title.trim()) return;

    try {
      const projectData: ProjectUpdate = {
        title: formData.title,
        description: formData.description || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        status: formData.status,
      };

      const { error } = await supabase
        .from("project")
        .update(projectData)
        .eq("id", selectedProject.id);

      if (error) throw error;

      setEditDialogOpen(false);
      setSelectedProject(null);
      resetForm();
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err);
      setError("プロジェクトの更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;

    try {
      const { error } = await supabase
        .from("project")
        .delete()
        .eq("id", selectedProject.id);

      if (error) throw error;

      setDeleteDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("プロジェクトの削除に失敗しました");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      skills: [],
      status: "draft",
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      skills: project.skills || [],
      status: project.status || "draft",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const getStatusLabel = (status: ProjectStatus | null) => {
    switch (status) {
      case "active":
        return "募集中";
      case "closed":
        return "クローズ";
      case "draft":
        return "下書き";
      default:
        return "不明";
    }
  };

  const getStatusColor = (status: ProjectStatus | null) => {
    switch (status) {
      case "active":
        return "success";
      case "closed":
        return "default";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  if (profileLoading || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || profile?.profile_type !== "company") {
    return null;
  }

  return (
    <Box sx={{ p: 3, maxWidth: "90%", mx: "auto" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          プロジェクト管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          新規プロジェクト作成
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              プロジェクトがありません
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              新しいプロジェクトを作成して学生からの応募を受け付けましょう
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
            >
              プロジェクトを作成
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "35%" }}>プロジェクト名</TableCell>
                <TableCell sx={{ width: "15%" }}>ステータス</TableCell>
                <TableCell sx={{ width: "25%" }}>スキル</TableCell>
                <TableCell sx={{ width: "15%" }}>作成日</TableCell>
                <TableCell align="center" sx={{ width: "10%" }}>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "medium",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {project.title}
                    </Typography>
                    {project.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {project.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(project.status)}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {project.skills?.slice(0, 3).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {project.skills && project.skills.length > 3 && (
                        <Chip
                          label={`+${project.skills.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString("ja-JP")
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="default"
                        onClick={() => openEditDialog(project)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(project)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 新規作成ダイアログ */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>新規プロジェクト作成</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="プロジェクト名"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <Autocomplete
              multiple
              options={skills.map((skill) => skill.skill_name)}
              value={formData.skills}
              onChange={(_, newValue) => setFormData({ ...formData, skills: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="必要なスキル" />
              )}
            />
            <FormControl fullWidth>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                label="ステータス"
              >
                <MenuItem value="draft">下書き</MenuItem>
                <MenuItem value="active">募集中</MenuItem>
                <MenuItem value="closed">クローズ</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formData.title.trim()}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>

      {/* 編集ダイアログ */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>プロジェクト編集</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="プロジェクト名"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <Autocomplete
              multiple
              options={skills.map((skill) => skill.skill_name)}
              value={formData.skills}
              onChange={(_, newValue) => setFormData({ ...formData, skills: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="必要なスキル" />
              )}
            />
            <FormControl fullWidth>
              <InputLabel>ステータス</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                label="ステータス"
              >
                <MenuItem value="draft">下書き</MenuItem>
                <MenuItem value="active">募集中</MenuItem>
                <MenuItem value="closed">クローズ</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!formData.title.trim()}
          >
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>プロジェクトの削除</DialogTitle>
        <DialogContent>
          <Typography>
            「{selectedProject?.title}」を削除してもよろしいですか？
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}