import { conversationsDb } from './mockDb';

export async function getConversations() {
    return structuredClone(conversationsDb);
}

export async function postNewConversation(newConversationHeader) {
    const ids = [...conversationsDb.map((conversation) => conversation.id)];
    const newConversation = {
        id: Math.max(0, ...ids) + 1,
        header: newConversationHeader,
    };

    conversationsDb.push(newConversation);
    const newChatId = newConversation.id;

    return { newConversations: structuredClone(conversationsDb), newChatId: newChatId };
}
