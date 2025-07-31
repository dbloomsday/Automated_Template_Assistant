// src/api/csrfToken.ts
let csrfToken: string | null = null;
export const setCsrfToken = (t: string) => (csrfToken = t);
export const getCsrfToken = () => csrfToken;
