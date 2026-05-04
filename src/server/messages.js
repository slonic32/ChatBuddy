import { sendQuestion } from './openrouter';
import { prisma } from './db';

export async function getMessages(conversationId) {
    const data = await prisma.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { createdAt: 'asc' },
    });
    return data;
}

export async function createMessage(conversationId, role, content) {
    await prisma.message.create({
        data: { role: role, content: content, conversationId: conversationId },
    });
}

export async function postMessage(conversationId, role, content) {
    await createMessage(conversationId, role, content);
    const oldConversationMessages = await getMessages(conversationId);

    if (role === 'user') {
        const answer = await sendQuestion(
            oldConversationMessages.map((message) => ({ role: message.role, content: message.content })),
        );

        await createMessage(conversationId, 'assistant', answer);
    }

    const conversationMessages = await getMessages(conversationId);

    return conversationMessages;
}
