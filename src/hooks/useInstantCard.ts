import { useCallback } from 'react';
import { createTemplate, createDraftCard, getPreview } from '@/api/instantCardClient';
import { useChatStore } from '@/store/chatStore';

export function useInstantCard() {
  const { orgId, designBrief, setTemplateId, setCardId, setPreview } = useChatStore();

  const kickOff = useCallback(async () => {
    // 1. create template
    const tpl = await createTemplate(orgId, designBrief);
    setTemplateId(tpl.id);

    // 2. create draft card to render PNG
    const draft = await createDraftCard(orgId, {
      card_template_id: tpl.id,
      card: { data: {} }, // placeholders
    });
    setCardId(draft.id);

    // 3. poll preview until ready (simple immediate fetch for brevity)
    const png = await getPreview(orgId, draft.id);
    setPreview(png);
  }, [orgId, designBrief, setTemplateId, setCardId, setPreview]);

  return { kickOff };
}
