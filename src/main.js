import printMessages from './chat';
import sendMessage from './api';

const form = document.querySelector('.input-area');
const textarea = form?.querySelector('textarea');
const submitButton = form?.querySelector('button');
const messagesContainer = document.querySelector('.messages');

// chat history
const oldMessagesElements = document.querySelectorAll('.messages chat-message');
const chatMessages = Array.from(oldMessagesElements).map((element) => ({
    role: element.getAttribute('role'),
    content: element.textContent,
}));

async function addMessage(e) {
    e.preventDefault();

    if (!textarea || !messagesContainer || !submitButton) return;

    const messageText = textarea.value.trim();
    if (!messageText) return;

    textarea.value = '';

    submitButton.disabled = true; // Disable to prevent multiple submissions

    const msg = { role: 'user', content: messageText };
    chatMessages.push(msg);

    printMessages(messagesContainer, msg, true); // Print only the latest message

    const answerText = await sendMessage(messagesContainer, chatMessages);

    chatMessages.push({ role: 'assistant', content: answerText });

    submitButton.disabled = false; // Re-enable
}

form.addEventListener('submit', addMessage);
