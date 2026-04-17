import ChatPanel from '../../../components/ChatPanel/ChatPanel';
import { getMessages } from '../../../server/messages';

export default async function ChatPage({ params }) {
    const { id } = await params;
    const messages = await getMessages(id);

    const initialMessages = messages.map((message) => ({
        id: message.id,
        role: message.role,
        parts: [{ type: 'text', text: message.content }],
    }));

    return <ChatPanel conversationId={id} initialMessages={initialMessages}></ChatPanel>;
}
