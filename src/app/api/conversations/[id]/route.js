import { deleteConversation } from '../../../../server/conversations';

export async function DELETE(_request, { params }) {
    const { id } = await params;

    if (!id) {
        return Response.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    try {
        const { deletedConversationId, nextConversationId } = await deleteConversation(id);

        return Response.json({
            deletedConversationId,
            nextConversationId,
        });
    } catch {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }
}
