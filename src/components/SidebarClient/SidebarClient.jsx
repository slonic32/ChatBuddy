'use client';

import { useParams, useRouter } from 'next/navigation';
import ChatList from '../ChatList/ChatList';
import NewChatButton from '../NewChatButton/NewChatButton';
import { deleteConversation, postNewConversation } from '../../app/hooks/conversations';
import { postNewMessage } from '../../app/hooks/messages';
import Loader from '../Loader/Loader';
import { useMutation } from '@tanstack/react-query';

export default function SidebarClient({ conversations }) {
    const router = useRouter();
    const params = useParams();

    const activeChat = typeof params?.id === 'string' ? params.id : '';

    const createChatMutation = useMutation({
        mutationFn: async (newChatHeader) => {
            const { newConversations, newChatId } = await postNewConversation(newChatHeader);

            await postNewMessage(newChatId, 'assistant', 'Hi! How can I help you?');

            return { newConversations, newChatId };
        },
        onSuccess: ({ newChatId }) => {
            router.push(`/chat/${newChatId}`);
            router.refresh();
        },
        onError: (error) => {
            console.error('Failed to create new chat:', error);
        },
    });

    const deleteChatMutation = useMutation({
        mutationFn: async (conversationId) => deleteConversation(conversationId),
        onSuccess: ({ deletedConversationId, nextConversationId }) => {
            if (activeChat === deletedConversationId) {
                router.push(nextConversationId ? `/chat/${nextConversationId}` : '/');
            }

            router.refresh();
        },
        onError: (error) => {
            console.error('Failed to delete chat:', error);
        },
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

            <ChatList chatsList={conversations} activeChat={activeChat} onDeleteConversation={deleteChat}></ChatList>
            {isLoading && <Loader />}
        </aside>
    );
}
