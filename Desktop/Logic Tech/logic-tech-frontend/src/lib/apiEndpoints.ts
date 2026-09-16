import apiRequest from './apiClient';

// Authentication APIs
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'consultant' | 'admin';
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: data,
    });
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest<{
      access_token: string;
      token_type: string;
    }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    // Store token in localStorage
    localStorage.setItem('access_token', response.access_token);
    return response;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    return apiRequest('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Projects APIs
export const projectAPI = {
  listProjects: async (skip = 0, limit = 10, status?: string) => {
    let url = `/projects/?skip=${skip}&limit=${limit}`;
    if (status) url += `&status_filter=${status}`;
    return apiRequest(url);
  },

  getProject: async (projectId: string) => {
    return apiRequest(`/projects/${projectId}`);
  },

  createProject: async (data: {
    title: string;
    description: string;
    budget: number;
    category: string;
  }, clientId: string) => {
    return apiRequest('/projects/', {
      method: 'POST',
      body: data,
      headers: { 'X-Client-ID': clientId },
    });
  },

  updateProject: async (
    projectId: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      consultant_id?: string;
    }
  ) => {
    return apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: data,
    });
  },

  deleteProject: async (projectId: string) => {
    return apiRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};
