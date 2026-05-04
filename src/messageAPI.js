import './styles.css';

// custom element
class ChatMessage extends HTMLElement {
    connectedCallback() {
        const role = (this.getAttribute('role') || 'ai').toLowerCase();
        const text = (this.textContent || '').trim();
        const isUser = role === 'user';

        const wrapperClass = isUser ? 'text-right' : 'text-left';

        const bubbleClass = isUser
            ? 'inline-block max-w-[70%] rounded-2xl bg-sky-600 px-3 py-2 text-left text-slate-50 break-words'
            : 'inline-block max-w-[70%] rounded-2xl bg-slate-800 px-3 py-2 text-slate-100 break-words';

        this.innerHTML = `
      <div class="${wrapperClass}">
        <p class="${bubbleClass}">${text}</p>
      </div>
    `;
    }
}

customElements.define('chat-message', ChatMessage);

const form = document.querySelector('.input-area');
const textarea = form?.querySelector('textarea');
const messagesContainer = document.querySelector('.messages');

function addMessage(e) {
    e.preventDefault();
    if (!textarea || !messagesContainer) return;

    const messageText = textarea.value.trim();
    if (!messageText) return;

    const el = document.createElement('chat-message');
    el.setAttribute('role', 'user');
    el.textContent = messageText.trim();

    messagesContainer.appendChild(el);
    textarea.value = '';
}

form.addEventListener('submit', addMessage);
