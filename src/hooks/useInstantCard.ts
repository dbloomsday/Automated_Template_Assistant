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
      /* 0️⃣ login */
      await safeAuth(
        import.meta.env.VITE_IC_EMAIL,
        import.meta.env.VITE_IC_PASSWORD,
      );

      /* 1️⃣  generate initial JSON (optional) */
      const tplJson = await askTemplateAssistant(designBrief);
      const { front_data = '{}', back_data = '{}' } = JSON.parse(tplJson);

      /* 2️⃣  create template (multipart) */
      const tpl = await safeCreateTmpl(orgId, {
        card_type_id: 1,
        front_data,
        back_data,
      });
      setTemplateId(tpl.id);

      /* 3️⃣  draft card */
      const draft = await safeCreateDraft(orgId, {
        card_template_id: tpl.id,
        card: { data: {} },
      });
      setCardId(draft.id);

      /* 4️⃣  preview */
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
