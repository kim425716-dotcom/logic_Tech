export function getWebSocketBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return apiUrl.replace(/^http/, 'ws');
}

export function buildWebSocketUrl(path: string): string {
  const base = getWebSocketBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
