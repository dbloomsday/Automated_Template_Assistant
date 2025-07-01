/* --------------------------------------------------------------------------
   OpenAI Assistants helper
----------------------------------------------------------------------------*/
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: import.meta.env.DEV,  // ✔ only true in dev mode
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runAssistant(
  assistantId: string,
  userMessage: string,
) {
  // 1️⃣  create a new thread with the user’s message
  const thread = await openai.beta.threads.create({
    messages: [{ role: 'user', content: userMessage }],
  });

  // 2️⃣  start a run of the assistant on that thread
  let run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
  });

  // 3️⃣  poll until the run is done
  while (run.status === 'queued' || run.status === 'in_progress') {
    await sleep(1_000);
    // 🔧 UPDATE — single-object signature
    run = await openai.beta.threads.runs.retrieve(run.id, {
    thread_id: thread.id,
    });
  }

  if (run.status !== 'completed') {
    throw new Error(`Assistant run ended with status: ${run.status}`);
  }

  // 4️⃣  fetch the last assistant reply
  const msgs = await openai.beta.threads.messages.list(thread.id, { limit: 1 });
  const last = msgs.data[0];
  let text = '';

  if (last?.content?.[0]?.type === 'text') {
    text = last.content[0].text.value;
  }

  return text;
}

/* Convenience wrappers ---------------------------------------------------- */
export const askChatAssistant = (prompt: string) =>
  runAssistant(import.meta.env.VITE_ASSISTANT_ID_CHAT, prompt);

export const askTemplateAssistant = (designBrief: any) =>
  runAssistant(
    import.meta.env.VITE_ASSISTANT_ID_TEMPLATE,
    JSON.stringify(designBrief, null, 2),
  );
