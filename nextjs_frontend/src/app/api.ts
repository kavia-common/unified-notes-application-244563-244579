'use client';

// PUBLIC_INTERFACE
/**
 * Unified Notes API client for frontend REST calls to the FastAPI backend.
 * All functions handle JWT auth, JSON, error handling.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  authToken: string | null = null
) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (authToken) headers.set('Authorization', `Bearer ${authToken}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // cross-origin cookie support if used
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export type UserType = { id: number; email: string };

type LoginResponse = { access_token: string; user?: UserType };

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }) as Promise<LoginResponse>;
}

// PUBLIC_INTERFACE
export async function signup(email: string, password: string): Promise<LoginResponse> {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }) as Promise<LoginResponse>;
}

// PUBLIC_INTERFACE
export async function getMe(token: string): Promise<{ user?: UserType; email?: string }> {
  return apiFetch('/auth/me', {}, token) as Promise<{ user?: UserType; email?: string }>;
}

// PUBLIC_INTERFACE
export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
}

export async function getNotes(token: string, q?: string, tag?: string): Promise<Note[]> {
  let query = '';
  if (q || tag) {
    const params = [];
    if (q) params.push(`q=${encodeURIComponent(q)}`);
    if (tag) params.push(`tag=${encodeURIComponent(tag)}`);
    query = '?' + params.join('&');
  }
  return apiFetch(`/notes${query}`, {}, token);
}

// PUBLIC_INTERFACE
export async function getNoteById(token: string, id: number | string): Promise<Note> {
  return apiFetch(`/notes/${id}`, {}, token);
}

// PUBLIC_INTERFACE
export async function createNote(token: string, data: { title: string; content: string; tags: string[] }): Promise<Note> {
  return apiFetch('/notes', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
}

// PUBLIC_INTERFACE
export async function updateNote(token: string, id: number | string, data: { title?: string; content?: string; tags?: string[] }): Promise<Note> {
  return apiFetch(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token);
}

// PUBLIC_INTERFACE
export async function deleteNote(token: string, id: number | string): Promise<void> {
  return apiFetch(`/notes/${id}`, {
    method: 'DELETE',
  }, token);
}

// PUBLIC_INTERFACE
export async function getTags(token: string): Promise<string[]> {
  return apiFetch('/tags', {}, token);
}

// PUBLIC_INTERFACE
export async function searchNotes(token: string, q: string): Promise<Note[]> {
  return getNotes(token, q);
}

// PUBLIC_INTERFACE
export type SettingsType = {
  theme?: string;
  // add further user settings fields as needed
};

export async function getSettings(token: string): Promise<SettingsType> {
  return apiFetch('/settings', {}, token) as Promise<SettingsType>;
}

// PUBLIC_INTERFACE
export async function updateSettings(token: string, data: SettingsType): Promise<SettingsType> {
  return apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }, token) as Promise<SettingsType>;
}
