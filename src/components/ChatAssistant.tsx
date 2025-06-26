import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { MessageList } from './MessageList';
import { FileUpload } from './FileUpload';
import { Spinner } from './Spinner';
import { PreviewViewer } from './PreviewViewer';
import { useInstantCard } from '@/hooks/useInstantCard';

export default function ChatAssistant() {
  const { status, previewPng, initialize } = useChatStore();
  const { kickOff } = useInstantCard();          // ✅ hook is now inside component

  useEffect(() => {
    initialize();        // sets status = 'loading'
    kickOff();           // does the API work, then sets preview etc.
  }, [initialize, kickOff]);
  
  return (
    <div className="flex flex-col h-screen">
      <MessageList className="flex-1 overflow-auto" />
      {status === 'loading' && <Spinner />}
      {previewPng && <PreviewViewer base64={previewPng} />}
      <FileUpload />
    </div>
  );
}
