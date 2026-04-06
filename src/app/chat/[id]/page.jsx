import ChatForm from '../../../components/ChatForm/ChatForm';

import ChatMessageList from '../../../components/ChatMessagesList/ChatMessageList';
import { useState } from 'react';
import Loader from '../../../components/Loader/Loader';

export default function ChatPanel() {
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

    async function sendMessage(messageContent, chatId = activeChat) {
        if (!chatId) {
            return;
        }

        try {
            setIsLoading(true);

            const messagesWithUserQuestion = await postNewMessage(chatId, 'user', messageContent);
            setMessages(messagesWithUserQuestion);

            const answer = await sendQuestion(
                messagesWithUserQuestion.map((message) => ({ role: message.role, content: message.content })),
            );

            const messagesWithAssistantAnswer = await postNewMessage(chatId, 'assistant', answer);
            setMessages(messagesWithAssistantAnswer);
        } catch (error) {
            console.error('Failed to post message:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="min-w-[800px] flex min-h-0 flex-1 flex-col rounded-xl bg-slate-900/40 ring-1 ring-white/10">
            <div className="flex min-h-0 flex-1 flex-col">
                <ChatMessageList chatMessages={chatMessages}></ChatMessageList>
                <ChatForm sendMessage={sendMessage}></ChatForm>
                {isLoading && <Loader />}
            </div>
        </div>
    );
}
