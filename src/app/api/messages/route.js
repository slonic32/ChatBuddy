import { postMessage, getMessages } from '../../../server/messages';

export async function GET(request) {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get('conversationId');

    if (!conversationId) {
        return Response.json([]);
    }

    const data = await getMessages(conversationId);
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const conversationMessages = await postMessage(body.conversationId, body.role, body.content);
    return Response.json(conversationMessages);
}
