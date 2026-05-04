export default function ChatListItem({ id, header, setActiveChat, isActive = false }) {
    return (
        <li>
            <a
                href="#"
                aria-current={isActive ? 'page' : undefined}
                className={
                    isActive
                        ? 'block rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium ring-1 ring-white/10'
                        : 'block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800/70'
                }
                onClick={() => {
                    setActiveChat(id);
                }}
            >
                {header}
            </a>
        </li>
    );
}
