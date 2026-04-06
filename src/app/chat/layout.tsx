import Sidebar from '../../components/Sidebar/Sidebar';
export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-1 min-h-0 min-w-150 gap-8 py-6 max-h-[85vh]">
            <Sidebar
                conversations={conversations}
                setConversations={setConversations}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
            ></Sidebar>
            {children}
        </main>
    );
}
