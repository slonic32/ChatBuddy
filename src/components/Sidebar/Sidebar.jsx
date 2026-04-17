import { getConversations } from '../../server/conversations';
import SidebarClient from '../SidebarClient/SidebarClient';

export default async function Sidebar() {
    const conversations = await getConversations();

    return <SidebarClient conversations={conversations}></SidebarClient>;
}
