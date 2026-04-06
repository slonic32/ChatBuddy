'use client';

export default function ChatForm({ sendMessage }) {
    const handleSubmit = (evt) => {
        evt.preventDefault();
        const form = evt.target;
        const newMessage = form.newMessage.value;
        sendMessage(newMessage);
        form.reset();
    };
    return (
        <form className="input-area flex items-end gap-3 border-t border-white/10 px-5 py-4" onSubmit={handleSubmit}>
            <textarea
                className="min-h-11 max-h-32 flex-1 resize-y rounded-xl bg-slate-800 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500/60"
                placeholder="Type a message..."
                required
                name="newMessage"
            ></textarea>

            <button
                type="submit"
                className="submit-button cursor-pointer h-11 rounded-xl bg-sky-600 px-4 text-sm font-semibold hover:bg-sky-500 active:bg-sky-700 disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed disabled:hover:bg-slate-600 disabled:active:bg-slate-600"
            >
                Send
            </button>
        </form>
    );
}
