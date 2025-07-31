import axios from 'axios';
import { setCsrfToken } from './csrfToken';

/* ------------------------------------------------------------------
   Axios instances routed through Vite’s proxy
-------------------------------------------------------------------*/
const apiV2 = axios.create({
  baseURL: '/ic/v2',
  withCredentials: true,
});

const apiV1 = axios.create({
  baseURL: '/ic',
  withCredentials: true,
  // NOTE: no global Content-Type – we set it per request
});

import { getCsrfToken } from './csrfToken';   // ①  ← add this line

/* 👉 ②  attach the header on every mutating request */
apiV1.interceptors.request.use((config) => {
  const token = getCsrfToken();              // whatever you stored in initCsrfToken
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['X-CSRF-Token'] = token;  // Rails CSRF header
  }
  return config;
});

/* ------------------------------------------------------------------
   Auth
-------------------------------------------------------------------*/
export async function authenticate(email: string, password: string) {
  // step-1: login → bearer token
  const fd = new FormData();
  fd.append('email', email);
  fd.append('password', password);

  const {
  data: { auth_token },
  } = await apiV2.post('/authenticate', fd);

  // make all v-2 calls carry the bearer
  apiV2.defaults.headers.common.Authorization = `Bearer ${auth_token}`;
  apiV2.defaults.headers.common.Accept = 'application/json';

  /* 👇 ADD this line so v-1 has the same header */
  apiV1.defaults.headers.common.Authorization = `Bearer ${auth_token}`;

  // make every v2 call carry Bearer + exact Accept
  Object.assign(apiV2.defaults.headers.common, {
    Authorization: `Bearer ${auth_token}`,
    Accept: 'application/json',
  });

  // step-2: profile/me – server sets _instantcard_session cookie
  const res = await apiV2.get('/profile/me', { params: { v: '2.4' } });
  if (res.status !== 200) {
    throw new Error(`/profile/me failed: ${res.status} ${res.statusText}`);
  }

  return auth_token; // cookie now stored; apiV1 is authenticated
}

export async function initCsrfToken(orgId: string) {
  const res = await apiV1.get('/card_templates', {
    params: { include: 'fields', v: '2.1', organization_id: orgId },
    headers: { Accept: 'application/json' },
  });

  const token = res.headers['x-csrf-token'] as string | undefined;
  if (!token) throw new Error('X‑CSRF‑Token header missing');
  setCsrfToken(token);
}

/* ----------------  v1 helpers  ---------------- */

/* ---------------- createTemplate ---------------- */
export async function createTemplate(orgId: string, template: any) {
  const fd = new FormData();
  fd.append('organization_id', orgId);
  Object.entries(template).forEach(([k, v]) =>
    fd.append(`card_template[${k}]`, v != null ? String(v) : ''),
  );

  const { data } = await apiV1.post('/card_templates', fd, {
    params: { organization_id: orgId },
  });
  return data;
}




export async function updateTemplate(
  orgId: string,
  id: string,
  template: any,
) {
  const { data } = await apiV1.patch(
    `/card_templates/${id}`,
    template,
    { params: { organization_id: orgId } },
  );
  return data;
}

export async function uploadLogo(orgId: string, id: string, file: File) {
  const fd = new FormData();
  fd.append('image', file);

  const { data } = await apiV1.post(
    `/card_templates/${id}/upload`,
    fd,
    {
      params: { organization_id: orgId },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return data;
}

export async function createDraftCard(orgId: string, payload: any) {
  const { data } = await apiV1.post(
    `/organizations/${orgId}/cards`,
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  );
  return data;
}

export async function getPreview(orgId: string, cardId: string) {
  const { data } = await apiV1.get(
    `/organizations/${orgId}/cards/${cardId}/preview`,
  );
  return data; // base-64 PNG
}
