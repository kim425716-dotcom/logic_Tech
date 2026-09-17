import type { AuthState, LoginCredentials, RegisterData, BackendUserResponse, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthState> {
    const tokenResponse = await this.request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(tokenResponse.access_token);
    
    const backendUser = await this.request<BackendUserResponse>('/auth/me');
    const user: User = {
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      role: backendUser.role,
      avatarUrl: backendUser.avatar_url || undefined,
      createdAt: backendUser.created_at,
      updatedAt: backendUser.created_at, // fallback
    };
    
    return {
      user,
      token: tokenResponse.access_token,
      isAuthenticated: true,
    };
  }

  async register(data: RegisterData): Promise<BackendUserResponse> {
    return this.request<BackendUserResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(data: unknown) {
    return this.request('/projects', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProject(id: string, data: unknown) {
    return this.request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  // Invoices
  async getInvoices() {
    return this.request('/invoices');
  }

  async createCheckoutSession(invoiceId: string) {
    return this.request('/payments/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ invoice_id: invoiceId }),
    });
  }

  // Messages
  async getMessagesForUser(userId: string) {
    return this.request<any[]>(`/messages/?user_id=${userId}`);
  }

  async sendMessageToUser(senderId: string, recipientId: string, content: string, projectId?: string) {
    return this.request<any>(`/messages/?sender_id=${senderId}`, {
      method: 'POST',
      body: JSON.stringify({
        recipient_id: recipientId,
        content: content,
        project_id: projectId || null,
      }),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request<any>(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  // User profile
  async updateProfile(data: unknown) {
    return this.request('/users/me', { method: 'PUT', body: JSON.stringify(data) });
  }

  async updatePassword(data: { current_password: string; new_password: string }) {
    return this.request('/users/me/password', { method: 'PUT', body: JSON.stringify(data) });
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;
