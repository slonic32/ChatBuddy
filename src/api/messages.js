const messagesDataBase = [
    {
        id: 1,
        header: 'Chat about JavaScript',
        messages: [
            { id: 1, role: 'assistant', content: 'Hi! How can I help you?' },
            { id: 2, role: 'user', content: 'What is a closure?' },
            {
                id: 3,
                role: 'assistant',
                content:
                    "A closure is a function that has access to its own scope, the outer function's scope, and the global scope.",
            },
        ],
    },
    { id: 2, header: 'Help with CSS', messages: [{ id: 1, role: 'assistant', content: 'Hi! How can I help you?' }] },
];

export async function getMessageHistory() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return structuredClone(messagesDataBase);
}

export async function postNewChat(newChatHeader) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newChat = {
        id: messagesDataBase.length + 1,
        header: newChatHeader,
        messages: [{ id: 1, role: 'assistant', content: 'Hi! How can I help you?' }],
    };
    messagesDataBase.push(newChat);
    return newChat;
}

export async function postNewMessage(role, content, chatId) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const chat = messagesDataBase.find((chat) => chat.id === chatId);
    if (!chat) {
        return [];
    }
    const newMessage = {
        id: chat.messages.length + 1,
        role: role,
        content: content,
    };
    chat.messages.push(newMessage);
    return newMessage;
}
