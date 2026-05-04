import ChatMessage from '../ChatMessage/ChatMessage';

export default function ChatMessageList({ chatMessages }) {
    return (
        <section className="messages flex-1 min-h-0 space-y-4 overflow-y-auto px-5 py-4">
            {chatMessages.map((message) => (
                <ChatMessage key={message.id} role={message.role} text={message.content} />
            ))}
        </section>
    );
}
