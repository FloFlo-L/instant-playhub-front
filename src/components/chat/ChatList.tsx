import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "@/provider/authProvider";
import DeleteChat from '@/components/chat/DeleteChat';
import CreateChat from './CreateChat';
import { Loader2 } from 'lucide-react';

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

interface ChatListProps {
    conversations: Conversation[];
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    selectedConversation: Conversation | null;
    setSelectedConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

const ChatList: React.FC<ChatListProps> = ({ conversations, setConversations, selectedConversation, setSelectedConversation }) => {
    const { id } = useParams<{ id: string }>();
    const { token, userInfo } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const chatDetails: Conversation[] = response.data.chats;
                setConversations(chatDetails);
                if (id) {
                    const selectedConv = chatDetails.find((conv) => conv.chat_id === id) || null;
                    setSelectedConversation(selectedConv);
                } else if (chatDetails.length > 0) {
                    setSelectedConversation(chatDetails[0]);
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [token, userInfo, setConversations, setSelectedConversation]);

    const handleConversationClick = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        navigate(`/chat/${conversation.chat_id}`);
    };

    const handleChatDeleted = (deletedChatId: string) => {
        setConversations((prevConversations) => prevConversations.filter((conversation) => conversation.chat_id !== deletedChatId));
        setSelectedConversation(null);
    };

    const handleChatCreated = (newChat: Conversation) => {
        setConversations((prevConversations) => [...prevConversations, newChat]);
        setSelectedConversation(newChat);
    };

    return (
        <div className={`w-full md:w-1/4 bg-secondary p-4 flex flex-col ${id !== "0" && "hidden md:block"}`}>
            <div className='flex align-center justify-between mb-4'>
                <h2 className="text-xl font-bold text-foreground">Messages</h2>
                <CreateChat onChatCreated={handleChatCreated} />
            </div>
            <ScrollArea className="flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="text-center text-muted-foreground">Vous n'avez pas de messages avec vos amis.</p>
                ) : (
                    conversations.map((conversation) => (
                        <div key={conversation.chat_id} className="relative mb-2">
                            <Link to={`/chat/${conversation.chat_id}`} className="block">
                                <Card
                                    className={`p-4 flex items-center justify-between cursor-pointer ${selectedConversation && selectedConversation.chat_id === conversation.chat_id ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"}`}
                                    onClick={() => handleConversationClick(conversation)}
                                >
                                    <div className='flex items-center gap-4'>
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={conversation.other_user.profile_picture} alt={conversation.other_user.username} />
                                            <AvatarFallback className='text-foreground uppercase'>{conversation.other_user.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p>{conversation.other_user.username}</p>
                                    </div>
                                </Card>
                            </Link>
                            <div className="absolute right-0 top-0 mt-4 mr-4" onClick={(e) => e.stopPropagation()}>
                                <DeleteChat chatId={conversation.chat_id} onChatDeleted={() => handleChatDeleted(conversation.chat_id)} />
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    );
};

export default ChatList;
