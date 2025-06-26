import { ChangeEvent } from 'react';
import { uploadLogo } from '@/api/instantCardClient';
import { useChatStore } from '@/store/chatStore';

export function FileUpload() {
  const { orgId, templateId, addSystemMessage } = useChatStore();

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !templateId) return;
    await uploadLogo(orgId, templateId, e.target.files[0]);
    addSystemMessage('✅ Logo uploaded');
  };

  return (
    <label className="block p-4 border-t">
      <span className="sr-only">Upload logo</span>
      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={onChange}
        className="file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg"
      />
    </label>
  );
}
