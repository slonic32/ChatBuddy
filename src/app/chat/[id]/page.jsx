'use client';

import { useParams } from 'next/navigation';
import ChatForm from '../../../components/ChatForm/ChatForm';

import ChatMessageList from '../../../components/ChatMessagesList/ChatMessageList';
import Loader from '../../../components/Loader/Loader';
import { getMessagesByConversation, postNewMessage } from '../../../api/messages';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function ChatPage() {
    const params = useParams();
    const activeChat = Number(params?.id);

    const queryClient = useQueryClient();

    const {
        data: messages = [],
        isPending: isMessagesLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['messages', activeChat],
        queryFn: () => getMessagesByConversation(activeChat),
        enabled: !!activeChat,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (messageContent) => {
            return await postNewMessage(activeChat, 'user', messageContent);
        },
        onSuccess: (updatedMessages) => {
            queryClient.setQueryData(['messages', activeChat], updatedMessages);
        },
        onError: (error) => {
            console.error('Failed to send message:', error);
        },
    });

    function sendMessage(messageContent) {
        if (!activeChat) return;
        sendMessageMutation.mutate(messageContent);
    }

    const isLoading = isMessagesLoading || sendMessageMutation.isPending;

    if (isError) {
        console.error('Failed to get messages:', error);
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
