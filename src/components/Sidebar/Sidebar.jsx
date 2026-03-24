import ChatList from '../ChatList/ChatList';
import NewChatButton from '../NewChatButton/NewChatButton';

export default function Sidebar({ chatsList, activeChat, setActiveChat, createNewChat }) {
    return (
        <aside className="w-64 shrink-0 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/10 overflow-y-auto">
            <NewChatButton createNewChat={createNewChat}></NewChatButton>

            <h2 className="mt-4 text-sm font-semibold text-slate-300">Conversations</h2>

            <ChatList chatsList={chatsList} activeChat={activeChat} setActiveChat={setActiveChat}></ChatList>
        </aside>
    );
}
