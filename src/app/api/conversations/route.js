import { prisma } from '../db';

export async function GET() {
    const data = await prisma.conversation.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const newConversation = await prisma.conversation.create({
        data: { header: body.newConversationHeader },
    });

    const newChatId = newConversation.id;

    const newConversations = await prisma.conversation.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return Response.json({ newConversations, newChatId });
}

export async function DELETE(request) {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
        return Response.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    try {
        await prisma.$transaction([
            prisma.message.deleteMany({ where: { conversationId } }),
            prisma.conversation.delete({ where: { id: conversationId } }),
        ]);
    } catch {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const nextConversation = await prisma.conversation.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    return Response.json({
        deletedConversationId: conversationId,
        nextConversationId: nextConversation?.id ?? null,
    });
}
