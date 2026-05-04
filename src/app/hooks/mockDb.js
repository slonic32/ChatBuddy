export const conversationsDb = [
    { id: 1, header: 'Chat about JavaScript' },
    { id: 2, header: 'Help with CSS' },
];

export const messagesDb = [
    { id: 1, conversationId: 1, role: 'assistant', content: 'Hi! How can I help you?' },
    { id: 2, conversationId: 1, role: 'user', content: 'What is a closure?' },
    {
        id: 3,
        conversationId: 1,
        role: 'assistant',
        content:
            "A closure is a function that has access to its own scope, the outer function's scope, and the global scope.",
    },
    { id: 4, conversationId: 2, role: 'assistant', content: 'Hi! How can I help you?' },
    { id: 5, conversationId: 2, role: 'user', content: 'What is CSS?' },
    { id: 6, conversationId: 2, role: 'assistant', content: 'CSS means Cascading Style Sheets.' },
];
