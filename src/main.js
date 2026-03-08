import printMessages from './chat';
import sendMessage from './api';

const form = document.querySelector('.input-area');
const textarea = form?.querySelector('textarea');
const submitButton = form?.querySelector('button');
const messagesContainer = document.querySelector('.messages');

const chatMessages = [];

async function addMessage(e) {
    e.preventDefault();
    submitButton.disabled = true; // Disable to prevent multiple submissions
    if (!textarea || !messagesContainer) return;

    const messageText = textarea.value.trim();
    if (!messageText) return;
    const msg = { role: 'user', text: messageText };
    chatMessages.push(msg);

    printMessages(messagesContainer, msg, true); // Print only the latest message

    const answerText = await sendMessage(messagesContainer, messageText);

    chatMessages.push({ role: 'ai', text: answerText });

    textarea.value = '';
    submitButton.disabled = false; // Re-enable
}

form.addEventListener('submit', addMessage);
