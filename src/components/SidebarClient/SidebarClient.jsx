'use client';

import { useParams, useRouter } from 'next/navigation';
import ChatList from '../ChatList/ChatList';
import NewChatButton from '../NewChatButton/NewChatButton';
import { deleteConversation, postNewConversation } from '../../app/hooks/conversations';
import { postNewMessage } from '../../app/hooks/messages';
import Loader from '../Loader/Loader';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function SidebarClient({ conversations }) {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();

    const { data: chatsList = [] } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => queryClient.getQueryData(['conversations']) ?? conversations,
        enabled: false,
        initialData: conversations,
    });

    const activeChat = typeof params?.id === 'string' ? params.id : '';

    const createChatMutation = useMutation({
        mutationFn: async (newChatHeader) => {
            const { newConversations, newChatId } = await postNewConversation(newChatHeader);

            await postNewMessage(newChatId, 'assistant', 'Hi! How can I help you?');

            return { newConversations, newChatId };
        },
        onMutate: async (newChatHeader) => {
            await queryClient.cancelQueries({ queryKey: ['conversations'] });
            const previous = queryClient.getQueryData(['conversations']) ?? chatsList;
            const optimistic = [
                {
                    id: `temp-${Date.now()}`,
                    header: newChatHeader,
                },
                ...previous,
            ];

            queryClient.setQueryData(['conversations'], optimistic);

            return { previous };
        },
        onSuccess: ({ newConversations, newChatId }) => {
            queryClient.setQueryData(['conversations'], newConversations);
            router.push(`/chat/${newChatId}`);
            router.refresh();
        },
        onError: (error, _newChatHeader, context) => {
            queryClient.setQueryData(['conversations'], context?.previous ?? conversations);
            console.error('Failed to create new chat:', error);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['conversations'], refetchType: 'none' }),
    });

    const deleteChatMutation = useMutation({
        mutationFn: async (conversationId) => deleteConversation(conversationId),
        onMutate: async (conversationId) => {
            await queryClient.cancelQueries({ queryKey: ['conversations'] });
            const previous = queryClient.getQueryData(['conversations']) ?? chatsList;
            const optimistic = previous.filter((chat) => chat.id !== conversationId);

            queryClient.setQueryData(['conversations'], optimistic);

            return { previous };
        },
        onSuccess: ({ deletedConversationId, nextConversationId }) => {
            if (activeChat === deletedConversationId) {
                router.push(nextConversationId ? `/chat/${nextConversationId}` : '/');
            }

            router.refresh();
        },
        onError: (error, _conversationId, context) => {
            queryClient.setQueryData(['conversations'], context?.previous ?? conversations);
            console.error('Failed to delete chat:', error);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['conversations'], refetchType: 'none' }),
    });

    function createNewChat(newChatHeader) {
        createChatMutation.mutate(newChatHeader);
    }

    function deleteChat(conversationId) {
        deleteChatMutation.mutate(conversationId);
    }

    const isLoading = createChatMutation.isPending || deleteChatMutation.isPending;

    return (
        <aside className="w-64 shrink-0 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/10 overflow-y-auto">
            <NewChatButton createNewChat={createNewChat}></NewChatButton>

            <h2 className="mt-4 text-sm font-semibold text-slate-300">Conversations</h2>

            <ChatList chatsList={chatsList} activeChat={activeChat} onDeleteConversation={deleteChat}></ChatList>
            {isLoading && <Loader />}
        </aside>
    );
}
