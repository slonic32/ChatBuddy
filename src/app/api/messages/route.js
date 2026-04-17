import { sendQuestion } from '../openrouter';
import { prisma } from '../db';

async function postNewMessage(conversationId, role, content) {
    await prisma.message.create({
        data: { role: role, content: content, conversationId: conversationId },
    });

    const oldConversationMessages = await prisma.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { createdAt: 'asc' },
    });

    if (role === 'user') {
        const answer = await sendQuestion(
            oldConversationMessages.map((message) => ({ role: message.role, content: message.content })),
        );

        await prisma.message.create({
            data: { role: 'assistant', content: answer, conversationId: conversationId },
        });
    }

    const conversationMessages = await prisma.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { createdAt: 'asc' },
    });

    return conversationMessages;
}

export async function GET(request) {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
        return Response.json([]);
    }

    const data = await prisma.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { createdAt: 'asc' },
    });
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const conversationMessages = await postNewMessage(body.conversationId, body.role, body.content);
    return Response.json(conversationMessages);
}
