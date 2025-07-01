/// <reference types="vite/client" />

// (optional but nice) declare only the vars you actually use
interface ImportMetaEnv {
  readonly VITE_IC_BASE_URL: string;
  readonly VITE_IC_ORG_ID: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_ASSISTANT_ID_CHAT: string;
  readonly VITE_ASSISTANT_ID_TEMPLATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
