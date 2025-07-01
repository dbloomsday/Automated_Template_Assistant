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

/* Wrap every API helper so errors bubble up in a uniform way */
const safeAuth          = withErrorHandling(authenticate);
const safeCreateTmpl    = withErrorHandling(createTemplate);
const safeCreateDraft   = withErrorHandling(createDraftCard);
const safeGetPreview    = withErrorHandling(getPreview);

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
      /* 0️⃣  Login – obtains bearer token */
      await safeAuth(
        import.meta.env.VITE_IC_EMAIL,
        import.meta.env.VITE_IC_PASSWORD,
      );

      /* 1️⃣  Let TemplateGPT build the JSON */
      const tplJson = await askTemplateAssistant(designBrief);

      /* 2️⃣  Store template in InstantCard (v1) */
      const tpl = await safeCreateTmpl(orgId, {
        card_template: JSON.parse(tplJson),
      });
      setTemplateId(tpl.id);

      /* 3️⃣  Draft card for preview */
      const draft = await safeCreateDraft(orgId, {
        card_template_id: tpl.id,
        card: { data: {} }, // placeholders
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
