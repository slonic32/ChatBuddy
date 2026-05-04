export async function getMessagesByConversation(conversationId) {
    const response = await fetch(`/api/messages?conversationId=${conversationId}`);

    return response.json();
}

export async function postNewMessage(conversationId, role, content) {
    const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, role, content }),
    });

    return response.json();
}
