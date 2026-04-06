import { conversationsDb } from '../mockDb';

async function getConversations() {
    return structuredClone(conversationsDb);
}

async function postNewConversation(newConversationHeader) {
    const ids = [...conversationsDb.map((conversation) => conversation.id)];
    const newConversation = {
        id: Math.max(0, ...ids) + 1,
        header: newConversationHeader,
    };

    conversationsDb.push(newConversation);
    const newChatId = newConversation.id;

    return { newConversations: structuredClone(conversationsDb), newChatId: newChatId };
}

export async function GET() {
    const data = await getConversations();
    return Response.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { newConversations, newChatId } = await postNewConversation(body.newConversationHeader);
    return Response.json({ newConversations, newChatId });
}
