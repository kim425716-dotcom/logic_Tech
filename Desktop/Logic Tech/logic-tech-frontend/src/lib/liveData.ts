import type {
  AdminDashboardStats,
  ClientDashboardStats,
  Invoice,
  Project,
  ProjectStatus,
  User,
} from '../types';
import {
  mockAdminStats,
  mockClientStats,
  mockInvoices,
  mockProjects,
  mockUsers,
} from '../data/mockData';

export const LIVE_INTERVALS = {
  lists: 5000,
  details: 10000,
} as const;

interface BackendProject {
  id: string;
  title: string;
  description: string;
  client_id: string;
  budget: number;
  status: string;
  category: string;
  created_at: string;
  updated_at: string;
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
    clientName: userName || 'Client',
    category: project.category,
    priority: 'medium',
    tasks: [],
    createdAt: project.created_at,
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

export function computeAdminStats(projects: Project[], users: User[] = mockUsers): AdminDashboardStats {
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'pending').length;
  const completedBudget = projects
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.budget, 0);

  return {
    totalUsers: users.length,
    totalClients: users.filter(u => u.role === 'client').length,
    activeProjects: activeProjects || mockAdminStats.activeProjects,
    totalRevenue: completedBudget || mockAdminStats.totalRevenue,
    pendingApprovals: projects.filter(p => p.status === 'pending').length || mockAdminStats.pendingApprovals,
  };
}

export function getFallbackClientStats(): ClientDashboardStats {
  return mockClientStats;
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

export function getFallbackUsers(): User[] {
  return mockUsers;
}

export async function fetchLiveProjects(): Promise<BackendProject[]> {
  return apiFetch<BackendProject[]>('/projects/?limit=100');
}

export async function fetchLiveProject(id: string): Promise<BackendProject> {
  return apiFetch<BackendProject>(`/projects/${id}`);
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
  live: boolean;
}> {
  try {
    const backendProjects = await fetchLiveProjects();
    const projects = backendProjects.map(p => mapBackendProject(p));
    return {
      stats: computeAdminStats(projects, mockUsers),
      projects,
      live: true,
    };
  } catch {
    return {
      stats: getFallbackAdminStats(),
      projects: getFallbackProjects(),
      live: false,
    };
  }
}

export async function loadLiveUsers(): Promise<{ users: User[]; live: boolean }> {
  return { users: getFallbackUsers(), live: true };
}
