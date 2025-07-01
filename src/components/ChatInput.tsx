import { useState } from 'react';
import { askChatAssistant } from '@/api/openaiClient';
import { useChatStore } from '@/store/chatStore';

export default function ChatInput() {
  const [value, setValue] = useState('');
  const { addUserMessage, addSystemMessage } = useChatStore();

  async function handleSend() {
    if (!value.trim()) return;
    const prompt = value.trim();
    setValue('');
    addUserMessage(prompt);

    try {
      const assistantReply = await askChatAssistant(prompt);
      addSystemMessage(assistantReply);
    } catch (e: any) {
      addSystemMessage(`❌ OpenAI error: ${e.message}`);
    }
  }

  return (
    <div className="flex border-t p-3 space-x-2">
      <input
        className="flex-1 border rounded-lg px-3 py-2"
        placeholder="Type a message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}
