import { deleteConversation, getConversations, postNewConversation } from '../../../server/conversations';

export async function GET() {
    const data = await getConversations();
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const { newConversations, newChatId } = await postNewConversation(body.newConversationHeader);

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
        return Response.json({
            deletedConversationId,
            nextConversationId,
        });
    } catch {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }
}
