'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatForm from '../../../components/ChatForm/ChatForm';

import ChatMessageList from '../../../components/ChatMessagesList/ChatMessageList';
import Loader from '../../../components/Loader/Loader';
import { getMessagesByConversation, postNewMessage } from '../../../api/messages';

export default function ChatPage() {
    const params = useParams();
    const activeChat = Number(params?.id);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function fetchMessages() {
            if (!activeChat) {
                setMessages([]);
                return;
            }

            try {
                const chatMessages = await getMessagesByConversation(activeChat);
                setMessages(chatMessages ?? []);
            } catch (error) {
                console.error('Failed to get messages:', error);
            }
        }

        fetchMessages();
    }, [activeChat]);

    async function sendMessage(messageContent) {
        if (!activeChat) {
            return;
        }

        setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now(), conversationId: activeChat, role: 'user', content: messageContent },
        ]);

        setIsLoading(true);
        try {
            const updatedMessages = await postNewMessage(activeChat, 'user', messageContent);
            setMessages(updatedMessages);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-w-[800px] flex min-h-0 flex-1 flex-col rounded-xl bg-slate-900/40 ring-1 ring-white/10">
            <div className="flex min-h-0 flex-1 flex-col">
                <ChatMessageList chatMessages={messages}></ChatMessageList>
                <ChatForm sendMessage={sendMessage}></ChatForm>
                {isLoading && <Loader />}
            </div>
        </div>
    );
}
