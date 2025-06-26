import { create } from 'zustand';
import { useInstantCard } from '@/hooks/useInstantCard';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

interface State {
  orgId: string;
  designBrief: any;
  messages: Msg[];
  revisionCount: number;
  templateId?: string;
  cardId?: string;
  previewPng?: string;
  status: 'idle' | 'loading' | 'ready';
  initialize: () => void;
  addUserMessage: (c: string) => void;
  addSystemMessage: (c: string) => void;
  setTemplateId: (id: string) => void;
  setCardId: (id: string) => void;
  setPreview: (png: string) => void;
}

export const useChatStore = create<State>((set, get) => ({
  orgId: import.meta.env.VITE_IC_ORG_ID,
  designBrief: {}, // will be passed as prop in widget
  messages: [],
  revisionCount: 0,
  status: 'idle',
  initialize: () => set({ status: 'loading' }), 
  addUserMessage: (content) =>
    set((s) => ({ messages: [...s.messages, { role: 'user', content }] })),
  addSystemMessage: (content) =>
    set((s) => ({ messages: [...s.messages, { role: 'system', content }] })),
  setTemplateId: (id) => set({ templateId: id }),
  setCardId: (id) => set({ cardId: id }),
  setPreview: (png) => set({ previewPng: png }),
}));
