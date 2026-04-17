import { getConversations, postNewConversation } from '../../hooks/conversations';

export async function GET() {
    const data = await getConversations();
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const newConversation = await postNewConversation(body.newConversationHeader);

    const newChatId = newConversation.id;

    const newConversations = await getConversations();

    return Response.json({ newConversations, newChatId });
}

export async function DELETE(request) {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
        return Response.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    try {
        const { deletedConversationId, nextConversationId } = await deleteConversation(conversationId);
    } catch {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return Response.json({
        deletedConversationId,
        nextConversationId,
    });
}
