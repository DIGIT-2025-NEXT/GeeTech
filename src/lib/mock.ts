// lib/mock.ts - Mock data for events and students
import { createClient } from './supabase/client'
import type { Tables } from './types_db'

export type Event = Tables<'profiles'>;

export interface Student {
  id: string;
  name: string;
  university: string | null;
  bio: string | null;
  skills: string[];
  avatar?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  features?: string[];
  logo?: string;
  projects?: Project[];
  partcipantsid?: string[];
  adoptedid?: string[];
  Rejectedid?: string[];
  is_verified?: boolean;
}

export interface Project {
  id: string;
  companyId: string;
  title: string;
  description: string;
  skills: string[];
  status: 'active' | 'closed' | 'draft';
}
export interface ChatLog{
  speaker: `company`|`student`;
  chattext: string;
  chattime: string;
}
 export interface Chat {
  id: string;
  companyid: string;
  studentid: string;
  chatlog: ChatLog[];
 }





export async function getNext10(): Promise<Event[]> {
  const supabase = createClient()
  const { data: events, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return events || [];
}

export async function getAllStudents(): Promise<Student[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('students').select('id, name, university, bio, skills, avatar');
  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }
  // skillsがstringの場合は配列に変換
  return (data || []).map((student) => ({
    id: student.id,
    name: student.name,
    university: student.university,
    bio: student.bio,
    skills: Array.isArray(student.skills) ? student.skills : (student.skills ? (student.skills as string).split(',') : []),
    avatar: student.avatar || undefined,
  }));
}

// Note: Company data is now managed in Supabase database

export async function getCompanyById(id: string): Promise<Company | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('company')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching company by ID:', error);
    return undefined;
  }

  if (!data) return undefined;

  return {
    id: data.id,
    name: data.name,
    industry: data.industry,
    description: data.description,
    features: data.features || [],
    logo: data.logo || '',
    projects: data.projects || [],
    partcipantsid: data.partcipantsid || [],
    adoptedid: data.adoptedid || [],
    Rejectedid: data.Rejectedid || [],
    is_verified: data.is_verified || false,
  };
}

// Note: getCompanyByIdSync removed - use async getCompanyById instead




export async function getAllCompanies(): Promise<Company[]> {
  const supabase = createClient();
  // 認証済み企業のみを取得
  const { data, error } = await supabase
    .from('company')
    .select('*')
    .eq('is_verified', true);

  if (error) {
    console.error('Error fetching companies:', error);
    return [];
  }

  return (data || []).map((company: Company) => ({
    id: company.id,
    name: company.name,
    industry: company.industry,
    description: company.description,
    features: company.features || [],
    logo: company.logo || '',
    projects: company.projects || [],
    partcipantsid: company.partcipantsid || [],
    adoptedid: company.adoptedid || [],
    Rejectedid: company.Rejectedid || [],
    is_verified: company.is_verified || false,
  }));
}

export async function getProjectsByCompanyId(companyId: string): Promise<Project[]> {
  const supabase = createClient();

  try {
    console.log('Fetching projects for company ID:', companyId);
    const { data, error } = await supabase
      .from('project')
      .select('*')
      .eq('company_id', companyId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    console.log('Fetched project data:', data);

    if (!data || data.length === 0) {
      console.log('No active projects found in database');
      return [];
    }

    // Transform database data to Project interface format
    const transformedProjects = data.map(project => ({
      id: project.id,
      companyId: project.company_id,
      title: project.title,
      description: project.description,
      skills: Array.isArray(project.skills) ? project.skills : [],
      status: project.status as 'active' | 'closed' | 'draft'
    }));

    console.log('Transformed projects:', transformedProjects);
    return transformedProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('project')
      .select('*');
    
    if (error) {
      console.error('Error fetching all projects:', error);
      return [];
    }
    
    // Transform database data to Project interface format
    return (data || []).map(project => ({
      id: project.id,
      companyId: project.company_id,
      title: project.title,
      description: project.description,
      skills: project.skills || [],
      status: project.status as 'active' | 'closed' | 'draft'
    }));
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

// Note: Company manipulation functions removed - these should be handled via Supabase database operations