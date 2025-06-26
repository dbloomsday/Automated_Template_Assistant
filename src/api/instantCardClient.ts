import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_IC_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function authenticate(email: string, password: string) {
  const { data } = await api.post('/authenticate', { email, password });
  api.defaults.headers.common.Authorization = `Bearer ${data.auth_token}`;
  return data;
}

// --- Card‑template helpers --------------------------------------------------
export async function createTemplate(orgId: string, template: any) {
  const { data } = await api.post(`/card_templates?organization_id=${orgId}`, template);
  return data;
}

export async function updateTemplate(orgId: string, id: string, template: any) {
  const { data } = await api.patch(`/card_templates/${id}?organization_id=${orgId}`, template);
  return data;
}

export async function uploadLogo(orgId: string, id: string, file: File) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await api.post(`/card_templates/${id}/upload?organization_id=${orgId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function createDraftCard(orgId: string, payload: any) {
  const { data } = await api.post(`/organizations/${orgId}/cards`, payload);
  return data;
}

export async function getPreview(orgId: string, cardId: string) {
  const { data } = await api.get(`/organizations/${orgId}/cards/${cardId}/preview`);
  return data; // base‑64 PNG(s)
}
