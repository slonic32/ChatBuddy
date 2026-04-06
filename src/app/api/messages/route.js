import { messagesDb } from '../mockDb';
import { sendQuestion } from '../openrouter';

async function getMessagesByConversation(conversationId) {
    const messages = messagesDb.filter((message) => message.conversationId === conversationId);

    return structuredClone(messages);
}

async function postNewMessage(conversationId, role, content) {
    const ids = [...messagesDb.map((message) => message.id)];
    const newMessage = {
        id: Math.max(0, ...ids) + 1,
        conversationId,
        role,
        content,
    };

    messagesDb.push(newMessage);

    let conversationMessages = messagesDb.filter((message) => message.conversationId === conversationId);

    if (role === 'user') {
        const answer = await sendQuestion(
            conversationMessages.map((message) => ({ role: message.role, content: message.content })),
        );

        const assistantMessage = {
            id: Math.max(0, ...messagesDb.map((message) => message.id)) + 1,
            conversationId,
            role: 'assistant',
            content: answer,
        };

        messagesDb.push(assistantMessage);
        conversationMessages = messagesDb.filter((message) => message.conversationId === conversationId);
    }

    return structuredClone(conversationMessages);
}

export async function GET(request) {
    const url = new URL(request.url);
    const conversationIdString = url.searchParams.get('conversationId') ?? '0';
    const conversationId = Number.parseInt(conversationIdString);
    const data = await getMessagesByConversation(conversationId);
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const conversationMessages = await postNewMessage(body.conversationId, body.role, body.content);
    return Response.json(conversationMessages);
}
