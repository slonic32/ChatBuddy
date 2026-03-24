import { useState, useEffect } from 'react';
import './App.css';
import ChatPanel from './components/ChatPanel/ChatPanel';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
import { getMessageHistory, postNewChat, postNewMessage } from './api/messages';
import { sendQuestion } from './api/api';
import Loader from './components/Loader/Loader';

function App() {
    const [messageHistory, setMessageHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    useEffect(() => {
        async function fetchMessageHistory() {
            try {
                setIsLoading(true);
                const history = await getMessageHistory();

                setMessageHistory(history ?? []);
                if (history && history.length) {
                    setActiveChat(history[0].id);
                }
            } catch (error) {
                console.log('Error fetching message history:', error);
                setMessageHistory([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMessageHistory();
    }, []);

    async function createNewChat(newChatHeader) {
        setIsLoading(true);
        const newChat = await postNewChat(newChatHeader);

        setMessageHistory((prevHistory) => [...structuredClone(prevHistory), newChat]);

        setActiveChat(newChat.id);
        setIsLoading(false);
    }

    async function sendMessage(messageContent, chatId = activeChat) {
        setIsLoading(true);

        // update chat
        const chatWithNewMessage = await postNewMessage('user', messageContent, chatId);

        setMessageHistory((prevHistory) =>
            prevHistory.map((chat) => (chat.id === chatId ? { ...chat, messages: chatWithNewMessage } : chat)),
        );

        // get answer
        const answer = await sendQuestion(
            chatWithNewMessage.map((message) => ({ role: message.role, content: message.content })),
        );

        // update chat
        const chatWithAnswer = await postNewMessage('assistant', answer, chatId);

        setMessageHistory((prevHistory) =>
            prevHistory.map((chat) => (chat.id === chatId ? { ...chat, messages: chatWithAnswer } : chat)),
        );

        setIsLoading(false);
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 mx-auto flex max-w-5xl flex-col px-4">
            <main className="flex flex-1 min-h-0 min-w-150 gap-8 py-6 max-h-[85vh]">
                <Sidebar
                    chatsList={messageHistory.map((chat) => {
                        return { id: chat.id, header: chat.header };
                    })}
                    activeChat={activeChat}
                    setActiveChat={setActiveChat}
                    createNewChat={createNewChat}
                ></Sidebar>
                <ChatPanel
                    chatHeader={messageHistory.find((chat) => chat.id === activeChat)?.header || ''}
                    chatMessages={messageHistory.find((chat) => chat.id === activeChat)?.messages || []}
                    sendMessage={sendMessage}
                ></ChatPanel>
            </main>

            <Footer></Footer>
            {isLoading && <Loader />}
        </div>
    );
}

export default App;
