import { useCallback } from 'react';
import {
  authenticate,
  createTemplate,
  createDraftCard,
  getPreview,
} from '@/api/instantCardClient';
import { askTemplateAssistant } from '@/api/openaiClient';
import { withErrorHandling } from '@/utils/errorHandler';
import { useChatStore } from '@/store/chatStore';

/* Wrap helpers so any thrown AxiosError is surfaced uniformly */
const safeAuth        = withErrorHandling(authenticate);
const safeCreateTmpl  = withErrorHandling(createTemplate);
const safeCreateDraft = withErrorHandling(createDraftCard);
const safeGetPreview  = withErrorHandling(getPreview);

export function useInstantCard() {
  const {
    orgId,
    designBrief,
    setTemplateId,
    setCardId,
    setPreview,
    addSystemMessage,
  } = useChatStore();

  const kickOff = useCallback(async () => {
    try {
      /* 0️⃣  Login – obtains bearer + session cookie */
      await safeAuth(
        import.meta.env.VITE_IC_EMAIL,
        import.meta.env.VITE_IC_PASSWORD,
      );

      /* 1️⃣  (Optional) get JSON back from TemplateGPT */
      const tplJson = await askTemplateAssistant(designBrief);
      const { front_data = '{}', back_data = '{}' } = JSON.parse(tplJson);

      /* 2️⃣  Create template (multipart form-data) */
      const tpl = await safeCreateTmpl(orgId, {
        card_type_id: 1,   // Regular PVC
        name:          '', // you can set a title later
        front_data,
        back_data,
      });
      setTemplateId(tpl.id);

      /* 3️⃣  Draft card so we can render a PNG preview */
      const draft = await safeCreateDraft(orgId, {
        card_template_id: tpl.id,
        card: { data: {} }, // barcodes / photos go here later
      });
      setCardId(draft.id);

      /* 4️⃣  Fetch preview PNG */
      const png = await safeGetPreview(orgId, draft.id);
      if (png) setPreview(png);
    } catch (e: any) {
      addSystemMessage(`❌ ${e.message}`);
    }
  }, [
    orgId,
    designBrief,
    setTemplateId,
    setCardId,
    setPreview,
    addSystemMessage,
  ]);

  return { kickOff };
}
