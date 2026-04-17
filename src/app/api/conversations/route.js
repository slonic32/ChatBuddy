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
