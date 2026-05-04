export default function ChatMessage({ role, text }) {
    const isUser = role === 'user';
    return (
        <div className={isUser ? 'text-right' : 'text-left'}>
            <p
                className={
                    isUser
                        ? 'inline-block max-w-[70%] rounded-2xl bg-sky-600 px-3 py-2 text-left text-slate-50 break-words'
                        : 'inline-block max-w-[70%] rounded-2xl bg-slate-800 px-3 py-2 text-slate-100 break-words'
                }
            >
                {text}
            </p>
        </div>
    );
}
