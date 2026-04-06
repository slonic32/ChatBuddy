import { messagesDb } from './mockDb';

export async function getMessagesByConversation(conversationId) {
    const messages = messagesDb.filter((message) => message.conversationId === conversationId);

    return structuredClone(messages);
}

export async function postNewMessage(conversationId, role, content) {
    const ids = [...messagesDb.map((message) => message.id)];
    const newMessage = {
        id: Math.max(0, ...ids) + 1,
        conversationId,
        role,
        content,
    };

    messagesDb.push(newMessage);

    const conversationMessages = messagesDb.filter((message) => message.conversationId === conversationId);

    return structuredClone(conversationMessages);
}
