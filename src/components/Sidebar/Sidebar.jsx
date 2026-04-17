'use client';

import { useParams, useRouter } from 'next/navigation';
import ChatList from '../ChatList/ChatList';
import NewChatButton from '../NewChatButton/NewChatButton';
import { getConversations, postNewConversation } from '../../api/conversations';
import { postNewMessage } from '../../api/messages';
import Loader from '../Loader/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function Sidebar() {
    const router = useRouter();
    const params = useParams();

    const activeChat = Number(params?.id);

    const {
        data: conversations = [],
        isPending: isConversationsLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['conversations'],
        queryFn: getConversations,
    });

    const createChatMutation = useMutation({
        mutationFn: async (newChatHeader) => {
            const { newConversations, newChatId } = await postNewConversation(newChatHeader);

            await postNewMessage(newChatId, 'assistant', 'Hi! How can I help you?');

            return { newConversations, newChatId };
        },
        onSuccess: ({ newConversations, newChatId }) => {
            queryClient.setQueryData(['conversations'], newConversations);
            router.push(`/chat/${newChatId}`);
        },
        onError: (error) => {
            console.error('Failed to create new chat:', error);
        },
    });

    function createNewChat(newChatHeader) {
        createChatMutation.mutate(newChatHeader);
    }

    const isLoading = isConversationsLoading || createChatMutation.isPending;

    if (isError) {
        console.error('Failed to get conversations:', error);
    }

    return (
        <aside className="w-64 shrink-0 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/10 overflow-y-auto">
            <NewChatButton createNewChat={createNewChat}></NewChatButton>

            <h2 className="mt-4 text-sm font-semibold text-slate-300">Conversations</h2>

            <ChatList chatsList={conversations} activeChat={activeChat}></ChatList>
            {isLoading && <Loader />}
        </aside>
    );
}
