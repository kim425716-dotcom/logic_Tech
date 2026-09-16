import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-500 bg-amber-500/10',
    in_progress: 'text-blue-500 bg-blue-500/10',
    completed: 'text-emerald-500 bg-emerald-500/10',
    cancelled: 'text-red-500 bg-red-500/10',
    paid: 'text-emerald-500 bg-emerald-500/10',
    overdue: 'text-red-500 bg-red-500/10',
    available: 'text-emerald-500 bg-emerald-500/10',
    busy: 'text-amber-500 bg-amber-500/10',
    unavailable: 'text-red-500 bg-red-500/10',
    low: 'text-slate-500 bg-slate-500/10',
    medium: 'text-amber-500 bg-amber-500/10',
    high: 'text-red-500 bg-red-500/10',
  };
  return map[status] ?? 'text-slate-500 bg-slate-500/10';
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    in_progress: 'In Progress',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    paid: 'Paid',
    overdue: 'Overdue',
    available: 'Available',
    busy: 'Busy',
    unavailable: 'Unavailable',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return map[status] ?? status;
}
