import { prisma } from './db';

export async function getConversations() {
    const data = await prisma.conversation.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return data;
}

export async function postNewConversation(newConversationHeader) {
    const newConversation = await prisma.conversation.create({
        data: { header: newConversationHeader },
    });

    const newChatId = newConversation.id;

    const newConversations = await getConversations();

    return { newConversations, newChatId };
}

export async function deleteConversation(conversationId) {
    await prisma.message.deleteMany({ where: { conversationId } });
    await prisma.conversation.delete({ where: { id: conversationId } });

    const nextConversation = await prisma.conversation.findFirst({
        orderBy: { createdAt: 'desc' },
    });

    return Response.json({
        deletedConversationId: conversationId,
        nextConversationId: nextConversation?.id ?? null,
    });
}
