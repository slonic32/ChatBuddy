import Link from 'next/link';

export default function ChatListItem({ id, header, isActive = false, onDelete }) {
    return (
        <li className="flex items-center gap-2">
            <Link
                href={`/chat/${id}`}
                aria-current={isActive ? 'page' : undefined}
                className={
                    isActive
                        ? 'min-w-0 flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium ring-1 ring-white/10'
                        : 'min-w-0 flex-1 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/70'
                }
            >
                {header}
            </Link>
            {onDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(id)}
                    className="rounded-lg px-2 py-2 text-sm text-slate-400 hover:bg-slate-800/70 hover:text-rose-300"
                    aria-label={`Delete ${header}`}
                    title="Delete conversation"
                >
                    Delete
                </button>
            )}
        </li>
    );
}
