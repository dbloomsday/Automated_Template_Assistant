import { useChatStore } from '@/store/chatStore';
import clsx from 'clsx';

interface Props {
  className?: string;
}

export function MessageList({ className }: Props) {
  const messages = useChatStore((s) => s.messages);
  return (
    <ul className={clsx('p-4 space-y-2', className)}>
      {messages.map((m, i) => (
        <li key={i} className={m.role === 'user' ? 'text-right' : ''}>
          <span
            className={clsx(
              'inline-block px-3 py-2 rounded-xl',
              m.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 text-neutral-900',
            )}
          >
            {m.content}
          </span>
        </li>
      ))}
    </ul>
  );
}
