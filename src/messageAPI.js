const form = document.querySelector('.input-area');
const input = form.querySelector('input');
const messagesContainer = document.querySelector('.messages');

function addMessage(event) {
    event.preventDefault();
    const messageText = input.value.trim();
    if (!messageText) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `<p class="bubble">${messageText}</p>`;

    messagesContainer.appendChild(messageDiv);
    input.value = '';
}

form.addEventListener('submit', addMessage);
