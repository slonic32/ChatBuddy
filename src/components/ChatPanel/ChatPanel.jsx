'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRouter } from 'next/navigation';
import ChatForm from '../ChatForm/ChatForm';
import ChatMessageList from '../ChatMessagesList/ChatMessageList';
import Loader from '../Loader/Loader';

export default function ChatPanel({ conversationId, initialMessages }) {
    const router = useRouter();

    const { messages, sendMessage, status, error } = useChat({
        id: conversationId,
        messages: initialMessages,
        transport: new DefaultChatTransport({ api: '/api/chat' }),
        onFinish: () => {
            router.refresh();
        },
    });

    function handleSend(messageContent) {
        if (!conversationId) return;

        sendMessage(
            { text: messageContent },
            {
                body: { conversationId },
            },
        );
    }

    const chatMessages = messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.parts
            .filter((part) => part.type === 'text')
            .map((part) => part.text)
            .join(''),
    }));

    const isLoading = status === 'submitted' || status === 'streaming';

    return (
        <div className="w-full min-w-0 flex min-h-0 flex-1 flex-col rounded-xl bg-slate-900/40 ring-1 ring-white/10">
            <div className="flex min-h-0 flex-1 flex-col">
                <ChatMessageList chatMessages={chatMessages}></ChatMessageList>
                <ChatForm sendMessage={handleSend}></ChatForm>
                {isLoading && <Loader />}
            </div>
            {error && <p className="px-5 py-3 text-sm text-rose-300">Failed to send message. Try again.</p>}
        </div>
    );
}
