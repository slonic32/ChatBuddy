import { useState, useEffect } from 'react';
import './App.css';
import ChatPanel from './components/ChatPanel/ChatPanel';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';

import { getMessagesByConversation, postNewMessage } from './api/messages';
import { sendQuestion } from './api/api';
import Loader from './components/Loader/Loader';

function App() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);

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
        <div className="min-h-screen bg-slate-950 text-slate-100 mx-auto flex max-w-5xl flex-col px-4">
            <main className="flex flex-1 min-h-0 min-w-150 gap-8 py-6 max-h-[85vh]">
                <Sidebar
                    conversations={conversations}
                    setConversations={setConversations}
                    activeChat={activeChat}
                    setActiveChat={setActiveChat}
                ></Sidebar>
                <ChatPanel
                    chatHeader={conversations.find((conversation) => conversation.id === activeChat)?.header || ''}
                    chatMessages={messages}
                    sendMessage={sendMessage}
                ></ChatPanel>
            </main>

            <Footer></Footer>
            {isLoading && <Loader />}
        </div>
    );
}

export default App;
