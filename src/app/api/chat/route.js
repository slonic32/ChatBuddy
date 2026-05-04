import { streamText } from 'ai';
import { createMessage, getMessages } from '../../../server/messages';
import { openrouter, OPENROUTER_MODEL } from '../../../server/openrouter';

function getMessageText(message) {
    if (!message?.parts) {
        return '';
    }

    return message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('');
}

export async function POST(request) {
    const body = await request.json();
    const conversationId = body.conversationId;
    const userMessage = body.messages?.at(-1);
    const userText = getMessageText(userMessage);

    if (!conversationId) {
        return Response.json({ error: 'Missing conversationId' }, { status: 400 });
    }

    if (!userText) {
        return Response.json({ error: 'Missing user message text' }, { status: 400 });
    }

    await createMessage(conversationId, 'user', userText);

    const history = await getMessages(conversationId);

    const result = streamText({
        model: openrouter(OPENROUTER_MODEL),
        messages: history.map((message) => ({ role: message.role, content: message.content })),
        onFinish: async ({ text }) => {
            await createMessage(conversationId, 'assistant', text);
        },
    });

    return result.toUIMessageStreamResponse();
}
