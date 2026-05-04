import { getConversations, postNewConversation } from '../../../server/conversations';

export async function GET() {
    const data = await getConversations();
    return Response.json(data);
}

export async function POST(request) {
    const body = await request.json();
    const { newConversations, newChatId } = await postNewConversation(body.newConversationHeader);

    return Response.json({ newConversations, newChatId });
}
