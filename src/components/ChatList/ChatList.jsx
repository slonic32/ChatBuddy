import ChatListItem from '../ChatListItem/ChatListItem';

export default function ChatList({ chatsList, activeChat, setActiveChat }) {
    return (
        <ul className="mt-3 space-y-2">
            {chatsList.map((chat) => (
                <ChatListItem
                    key={chat.id}
                    header={chat.header}
                    isActive={activeChat === chat.id}
                    id={chat.id}
                    setActiveChat={setActiveChat}
                ></ChatListItem>
            ))}
        </ul>
    );
}
