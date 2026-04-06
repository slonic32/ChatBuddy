import { useEffect } from 'react';
import ChatList from '../ChatList/ChatList';
import NewChatButton from '../NewChatButton/NewChatButton';
import { getConversations, postNewConversation } from '../../api/conversations';
import { postNewMessage } from '../../api/messages';
import Loader from '../Loader/Loader';

export default function Sidebar() {
    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        async function fetchConversations() {
            try {
                setIsLoading(true);

                const fetchedConversations = await getConversations();
                setConversations(fetchedConversations);
                setActiveChat((current) => current ?? fetchedConversations[0]?.id ?? null);
            } catch (error) {
                console.error('Failed to get conversations:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchConversations();
    }, [setConversations, setActiveChat]);

    async function createNewChat(newChatHeader) {
        try {
            const { newConversations, newChatId } = await postNewConversation(newChatHeader);
            await postNewMessage(newChatId, 'assistant', 'Hi! How can I help you?');

            setConversations(newConversations);

            setActiveChat(newChatId);
        } catch (error) {
            console.error('Failed to create new chat:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <aside className="w-64 shrink-0 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/10 overflow-y-auto">
            <NewChatButton createNewChat={createNewChat}></NewChatButton>

            <h2 className="mt-4 text-sm font-semibold text-slate-300">Conversations</h2>

            <ChatList chatsList={conversations} activeChat={activeChat} setActiveChat={setActiveChat}></ChatList>
            {isLoading && <Loader />}
        </aside>
    );
}
