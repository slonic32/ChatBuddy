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
    {
        id: 2,
        header: 'Help with CSS',
        messages: [
            { id: 1, role: 'assistant', content: 'Hi! How can I help you?' },
            { id: 2, role: 'user', content: 'What is CSS?' },
            {
                id: 3,
                role: 'assistant',
                content: 'CSS - Cascading Style Sheets.',
            },
        ],
    },
];

export async function getMessageHistory() {
    return structuredClone(messagesDataBase);
}

export async function postNewChat(newChatHeader) {
    const newChat = {
        id: messagesDataBase.length + 1,
        header: newChatHeader,
        messages: [{ id: 1, role: 'assistant', content: 'Hi! How can I help you?' }],
    };
    messagesDataBase.push(newChat);
    return structuredClone(newChat);
}

export async function postNewMessage(role, content, chatId) {
    const chat = messagesDataBase.find((chat) => chat.id === chatId);
    if (!chat) {
        console.log('Chat not found!');
        return [];
    }
    const newMessage = {
        id: chat.messages.length + 1,
        role: role,
        content: content,
    };
    chat.messages.push(newMessage);
    return structuredClone(chat.messages);
}
