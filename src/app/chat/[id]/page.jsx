import ChatForm from '../../../components/ChatForm/ChatForm';
import ChatHeader from '../../../components/ChatHeader/ChatHeader';
import ChatMessageList from '../../../components/ChatMessagesList/ChatMessageList';

export default function ChatPanel({ chatHeader, chatMessages, sendMessage }) {
    return (
        <div className="min-w-[800px] flex min-h-0 flex-1 flex-col rounded-xl bg-slate-900/40 ring-1 ring-white/10">
            <ChatHeader chatHeader={chatHeader}></ChatHeader>

            <div className="flex min-h-0 flex-1 flex-col">
                <ChatMessageList chatMessages={chatMessages}></ChatMessageList>
                <ChatForm sendMessage={sendMessage}></ChatForm>
            </div>
        </div>
    );
}
