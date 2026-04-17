'use client';

export default function NewChatButton({ createNewChat }) {
    return (
        <button
            type="button"
            className="cursor-pointer w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-500 active:bg-rose-700"
            onClick={() => createNewChat('New Chat')}
        >
            New Chat
        </button>
    );
}
