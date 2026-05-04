export async function getConversations() {
    const response = await fetch('/api/conversations');

    return response.json();
}

export async function postNewConversation(newConversationHeader) {
    const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newConversationHeader }),
    });

    return response.json();
}

export async function deleteConversation(conversationId) {
    const response = await fetch(`/api/conversations?conversationId=${conversationId}`, {
        method: 'DELETE',
    });

    return response.json();
}
