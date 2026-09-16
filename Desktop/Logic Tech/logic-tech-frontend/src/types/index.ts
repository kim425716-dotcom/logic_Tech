// ============================================================
// Logic Tech IT Consultant Marketplace - TypeScript Types
// ============================================================

export type UserRole = 'client' | 'consultant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ConsultantProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  specialization: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  experienceYears: number;
  availability: 'available' | 'busy' | 'unavailable';
  skills: string[];
  certifications: string[];
  location?: string;
  verified?: boolean;
}

export interface ClientProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  companyName?: string;
  billingAddress?: string;
  website?: string;
}

export type ProjectStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
  progress: number;
  clientId: string;
  clientName: string;
  consultantId?: string;
  consultantName?: string;
  category: string;
  priority: ProjectPriority;
  tasks: Task[];
  createdAt: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface Invoice {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  consultantName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantOneId: string;
  participantOneName: string;
  participantOneAvatar?: string;
  participantTwoId: string;
  participantTwoName: string;
  participantTwoAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconIdentifier: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  content: string;
  rating: number;
}

export interface Stat {
  label: string;
  value: string;
  description?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'consultant';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Dashboard stats
export interface ClientDashboardStats {
  activeProjects: number;
  pendingRequests: number;
  totalSpent: number;
  completedProjects: number;
}

export interface ConsultantDashboardStats {
  activeProjects: number;
  pendingProposals: number;
  totalEarned: number;
  avgRating: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalConsultants: number;
  totalClients: number;
  activeProjects: number;
  totalRevenue: number;
  pendingApprovals: number;
}

// Toast
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Theme
export type Theme = 'light' | 'dark';
