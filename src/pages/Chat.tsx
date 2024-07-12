import { useState } from 'react';
import LayoutMain from "@/components/layout/main/LayoutMain";
import ChatList from "@/components/chat/ChatList";
import ChatMessages from '@/components/chat/ChatMessages';
import { useParams } from 'react-router-dom';

interface User {
    _id: string;
    username: string;
    profile_picture: string;
}

interface Conversation {
    chat_id: string;
    other_user: User;
    created_at: string;
}

const Chat = () => {
    const { id } = useParams<{ id: string }>();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    return (
        <LayoutMain>
            <div className={`flex flex-col md:flex-row h-screen border-b ${id === "0" && "h-auto md:h-screen"}`}>
                <ChatList
                    conversations={conversations}
                    setConversations={setConversations}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                />
                <ChatMessages selectedConversation={selectedConversation} />
            </div>
        </LayoutMain>
    );
};

export default Chat;
