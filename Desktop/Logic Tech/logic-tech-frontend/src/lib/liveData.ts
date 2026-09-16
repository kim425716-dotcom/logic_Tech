import type {
  AdminDashboardStats,
  ClientDashboardStats,
  ConsultantDashboardStats,
  ConsultantProfile,
  Invoice,
  Project,
  ProjectStatus,
  User,
} from '../types';
import {
  mockAdminStats,
  mockClientStats,
  mockConsultantStats,
  mockConsultants,
  mockInvoices,
  mockProjects,
  mockUsers,
} from '../data/mockData';

export const LIVE_INTERVALS = {
  lists: 5000,
  details: 10000,
  consultants: 10000,
} as const;

interface BackendProject {
  id: string;
  title: string;
  description: string;
  client_id: string;
  consultant_id?: string | null;
  budget: number;
  status: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface BackendConsultant {
  id: string;
  user_id: string;
  specialization: string;
  bio?: string | null;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
}

function getApiUrl(): string {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000';
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${getApiUrl()}${endpoint}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
}

function mapStatus(status: string): ProjectStatus {
  if (status === 'open' || status === 'assigned') return 'pending';
  if (status === 'in_progress') return 'in_progress';
  if (status === 'completed') return 'completed';
  return 'cancelled';
}

export function mapBackendProject(project: BackendProject, userName?: string): Project {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    status: mapStatus(project.status),
    budget: project.budget,
    deadline: project.updated_at,
    progress: project.status === 'completed' ? 100 : project.status === 'in_progress' ? 50 : 10,
    clientId: project.client_id,
    clientName: 'Client',
    consultantId: project.consultant_id ?? undefined,
    consultantName: userName,
    category: project.category,
    priority: 'medium',
    tasks: [],
    createdAt: project.created_at,
  };
}

export function mapBackendConsultant(profile: BackendConsultant, user?: User): ConsultantProfile {
  const fallback = mockConsultants.find(c => c.userId === profile.user_id) ?? mockConsultants[0];
  return {
    id: profile.id,
    userId: profile.user_id,
    name: user?.name ?? fallback.name,
    email: user?.email ?? fallback.email,
    avatarUrl: user?.avatarUrl ?? fallback.avatarUrl,
    specialization: profile.specialization,
    bio: profile.bio ?? fallback.bio,
    hourlyRate: profile.hourly_rate,
    rating: profile.rating,
    reviewCount: profile.total_reviews,
    completedProjects: fallback.completedProjects,
    experienceYears: fallback.experienceYears,
    availability: fallback.availability,
    skills: fallback.skills,
    certifications: fallback.certifications,
    location: fallback.location,
    verified: profile.is_verified,
  };
}

export function computeClientStats(projects: Project[]): ClientDashboardStats {
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'pending').length;
  const pendingRequests = projects.filter(p => p.status === 'pending').length;
  const completed = projects.filter(p => p.status === 'completed');
  return {
    activeProjects,
    pendingRequests,
    totalSpent: completed.reduce((sum, p) => sum + p.budget, 0),
    completedProjects: completed.length,
  };
}

export function computeConsultantStats(projects: Project[], userId?: string): ConsultantDashboardStats {
  const mine = projects.filter(p => p.consultantId === userId);
  const activeProjects = mine.filter(p => p.status === 'in_progress' || p.status === 'pending').length;
  const pendingProposals = projects.filter(p => p.status === 'pending').length;
  const completed = mine.filter(p => p.status === 'completed');
  return {
    activeProjects,
    pendingProposals,
    totalEarned: completed.reduce((sum, p) => sum + p.budget, 0),
    avgRating: mockConsultantStats.avgRating,
  };
}

export function computeAdminStats(projects: Project[], consultants: ConsultantProfile[]): AdminDashboardStats {
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'pending').length;
  const completedBudget = projects
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.budget, 0);

  return {
    totalUsers: mockUsers.length + Math.max(0, consultants.length - mockUsers.filter(u => u.role === 'consultant').length),
    totalConsultants: consultants.length || mockAdminStats.totalConsultants,
    totalClients: mockUsers.filter(u => u.role === 'client').length,
    activeProjects: activeProjects || mockAdminStats.activeProjects,
    totalRevenue: completedBudget || mockAdminStats.totalRevenue,
    pendingApprovals: projects.filter(p => p.status === 'pending').length || mockAdminStats.pendingApprovals,
  };
}

export function getFallbackClientStats(): ClientDashboardStats {
  return mockClientStats;
}

export function getFallbackConsultantStats(): ConsultantDashboardStats {
  return mockConsultantStats;
}

export function getFallbackAdminStats(): AdminDashboardStats {
  return mockAdminStats;
}

export function getFallbackProjects(): Project[] {
  return mockProjects;
}

export function getFallbackInvoices(): Invoice[] {
  return mockInvoices;
}

export function getFallbackConsultants(): ConsultantProfile[] {
  return mockConsultants;
}

export function getFallbackUsers(): User[] {
  return mockUsers;
}

export async function fetchLiveProjects(): Promise<BackendProject[]> {
  return apiFetch<BackendProject[]>('/projects/?limit=100');
}

export async function fetchLiveProject(id: string): Promise<BackendProject> {
  return apiFetch<BackendProject>(`/projects/${id}`);
}

export async function fetchLiveConsultants(): Promise<BackendConsultant[]> {
  return apiFetch<BackendConsultant[]>('/consultants/?limit=100');
}

export async function fetchLiveInvoices(): Promise<Invoice[]> {
  return apiFetch<Invoice[]>('/invoices');
}

export async function loadLiveProjects(userName?: string): Promise<{ projects: Project[]; live: boolean }> {
  try {
    const backendProjects = await fetchLiveProjects();
    return {
      projects: backendProjects.map(p => mapBackendProject(p, userName)),
      live: true,
    };
  } catch {
    return { projects: getFallbackProjects(), live: false };
  }
}

export async function loadLiveProject(id: string, userName?: string): Promise<{ project: Project | null; live: boolean }> {
  try {
    const backendProject = await fetchLiveProject(id);
    return { project: mapBackendProject(backendProject, userName), live: true };
  } catch {
    const project = getFallbackProjects().find(p => p.id === id) ?? null;
    return { project, live: false };
  }
}

export async function loadLiveConsultants(): Promise<{ consultants: ConsultantProfile[]; live: boolean }> {
  try {
    const backend = await fetchLiveConsultants();
    return {
      consultants: backend.map(c => mapBackendConsultant(c)),
      live: true,
    };
  } catch {
    return { consultants: getFallbackConsultants(), live: false };
  }
}

export async function loadLiveInvoices(): Promise<{ invoices: Invoice[]; live: boolean }> {
  try {
    const invoices = await fetchLiveInvoices();
    return { invoices, live: true };
  } catch {
    return { invoices: getFallbackInvoices(), live: false };
  }
}

export async function loadLiveAdminData(): Promise<{
  stats: AdminDashboardStats;
  projects: Project[];
  consultants: ConsultantProfile[];
  live: boolean;
}> {
  try {
    const [backendProjects, backendConsultants] = await Promise.all([
      fetchLiveProjects(),
      fetchLiveConsultants(),
    ]);
    const projects = backendProjects.map(p => mapBackendProject(p));
    const consultants = backendConsultants.map(c => mapBackendConsultant(c));
    return {
      stats: computeAdminStats(projects, consultants),
      projects,
      consultants,
      live: true,
    };
  } catch {
    return {
      stats: getFallbackAdminStats(),
      projects: getFallbackProjects(),
      consultants: getFallbackConsultants(),
      live: false,
    };
  }
}

export async function loadLiveUsers(): Promise<{ users: User[]; live: boolean }> {
  try {
    const { consultants } = await loadLiveConsultants();
    const consultantUsers: User[] = consultants.map(c => ({
      id: c.userId,
      name: c.name,
      email: c.email,
      role: 'consultant',
      avatarUrl: c.avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    const merged = [
      ...mockUsers,
      ...consultantUsers.filter(c => !mockUsers.some(u => u.id === c.id)),
    ];
    return { users: merged, live: true };
  } catch {
    return { users: getFallbackUsers(), live: false };
  }
}
