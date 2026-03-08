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

export default function printMessage(root, msg, newMsg = false) {
    if (newMsg) {
        const el = document.createElement('chat-message');
        el.setAttribute('role', msg.role);
        el.textContent = msg.content.trim();
        root.appendChild(el);
    } else {
        const el = root.lastElementChild;
        if (el && el.tagName.toLowerCase() === 'chat-message') {
            const currentText = el.textContent || '';
            const nextText = msg.content.trim();

            const noSpaceBefore = /^[,.;:!?)]/;
            const needsSpace = currentText && nextText && !/\s$/.test(currentText) && !noSpaceBefore.test(nextText);
            el.textContent = currentText + (needsSpace ? ' ' : '') + msg.content.trim();
        }
    }
}
