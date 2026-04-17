'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NewChatButton from '../components/NewChatButton/NewChatButton';
import { postNewConversation } from './hooks/conversations';
import { postNewMessage } from './hooks/messages';

export default function Home() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createChatMutation = useMutation({
        mutationFn: async () => {
            const { newChatId } = await postNewConversation('New Chat');

            await postNewMessage(newChatId, 'assistant', 'Hi! How can I help you?');

            return newChatId;
        },
        onSuccess: async (newChatId) => {
            await queryClient.invalidateQueries({ queryKey: ['conversations'] });
            router.push(`/chat/${newChatId}`);
        },
    });

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
            <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl shadow-slate-950/40 ring-1 ring-white/5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">ChatBuddy</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Start a new chat</h1>

                <div className="mt-8">
                    <NewChatButton createNewChat={() => createChatMutation.mutate()} />
                </div>

                {createChatMutation.isPending && <p className="mt-4 text-sm text-slate-400">Creating chat...</p>}
            </section>
        </main>
    );
}
