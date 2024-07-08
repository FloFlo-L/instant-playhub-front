import { useState, useEffect } from 'react';
import axios from 'axios';
import LayoutMain from "@/components/layout/main/LayoutMain";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaComment } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from "@/provider/authProvider";

interface User {
    _id: string;
    username: string;
    profile_picture: string;
}

interface Message {
    _id: string;
    text: string;
    isOwnMessage: boolean;
    timestamp: string;
}

interface Conversation {
    chat_id: string;
    other_user: User;
    created_at: string;
}

const Chat = () => {
    const { id } = useParams<{ id: string }>();
    const { token, userInfo } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/chats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const chatDetails: Conversation[] = response.data.chats;
                setConversations(chatDetails);
                if (id) {
                    const selectedConv = chatDetails.find((conv) => conv.chat_id === id) || null;
                    setSelectedConversation(selectedConv);
                    if (selectedConv) fetchMessages(selectedConv.chat_id);
                } else if (chatDetails.length > 0) {
                    setSelectedConversation(chatDetails[0]);
                    fetchMessages(chatDetails[0].chat_id);
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            }
        };

        fetchConversations();
    }, [token, userInfo, id]);

    const fetchMessages = async (chatId: string) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/messages/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (message.trim() !== "" && selectedConversation) {
            const newMessage: Message = { _id: `${Date.now()}`, text: message, isOwnMessage: true, timestamp: new Date().toISOString() };
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/chat/send_message`, {
                    chat_id: selectedConversation.chat_id,
                    message: newMessage.text,
                    user_id: userInfo._id,
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages([...messages, newMessage]);
                setMessageInput("");
            } catch (error) {
                console.error("Failed to send message", error);
            }
        }
    };

    const handleConversationClick = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation.chat_id);
    };

    return (
        <LayoutMain>
            <div className="flex h-screen border-b">
                <div className="w-1/4 bg-secondary p-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-foreground">Messages</h2>
                    <ScrollArea className="flex-grow">
                        {conversations.length === 0 ? (
                            <p className="text-center text-muted-foreground">Vous n'avez pas de conversations avec des amis.</p>
                        ) : (
                            conversations.map((conversation) => (
                                <Link to={`/chat/${conversation.chat_id}`} key={conversation.chat_id}>
                                    <Card
                                        className={`p-4 mb-2 flex items-center cursor-pointer ${selectedConversation && selectedConversation.chat_id === conversation.chat_id ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"}`}
                                        onClick={() => handleConversationClick(conversation)}
                                    >
                                        <Avatar className="w-10 h-10 mr-4">
                                            <AvatarImage src={conversation.other_user.profile_picture} alt={conversation.other_user.username} />
                                            <AvatarFallback className='text-foreground uppercase'>{conversation.other_user.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p>{conversation.other_user.username}</p>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </ScrollArea>
                </div>
                <div className="w-3/4 flex flex-col h-full border-l">
                    {selectedConversation && (
                        <>
                            <div className='p-4 border-b'>
                                <div className='flex items-center'>
                                    <Avatar className="w-10 h-10 mr-4">
                                        <AvatarImage src={selectedConversation.other_user.profile_picture} alt={selectedConversation.other_user.username} />
                                        <AvatarFallback className="uppercase">{selectedConversation.other_user.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p>{selectedConversation.other_user.username}</p>
                                </div>
                            </div>
                            <div className="flex-grow h-full overflow-hidden">
                                <div className="bg-background text-foreground py-4 pl-4 pr-2 h-full flex flex-col justify-end">
                                    {messages.length === 0 && (
                                        <div className="flex flex-col justify-center items-center h-full">
                                            <FaComment size={75} className='text-primary' />
                                            <p>Commence la conversation avec ton ami</p>
                                        </div>
                                    )}
                                    {messages.length > 0 && (
                                        <ScrollArea className="mb-4 pr-4 flex-grow">
                                            <div className="flex flex-col space-y-4">
                                                {messages.map((message) => (
                                                    <div
                                                        key={message._id}
                                                        className={`flex items-start ${message.isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                                                    >
                                                        <Avatar className={`w-8 h-8 ${message.isOwnMessage ? "ml-3" : "mr-3"}`}>
                                                            <AvatarImage src={message.isOwnMessage ? "https://github.com/shadcn.png" : selectedConversation.other_user.profile_picture} alt={message.isOwnMessage ? "You" : selectedConversation.other_user.username} />
                                                            <AvatarFallback>{message.isOwnMessage ? "Y" : selectedConversation.other_user.username.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className={`flex flex-col  max-w-[45%]  ${message.isOwnMessage ? "items-end" : "items-start"}`}>
                                                            <Card
                                                                className={`p-2 mb-2 ${message.isOwnMessage ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                                                    }`}
                                                            >
                                                                {message.text}
                                                            </Card>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                {new Date(message.timestamp).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                            <form className="gap-3 grid grid-cols-[1fr_auto] mt-4 w-full p-4 border-t border-border" onSubmit={(e) => { e.preventDefault(); handleSendMessage(messageInput); }}>
                                <Input
                                    type="text"
                                    placeholder="Écrivez un message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    className=""
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    style={{ opacity: messageInput.trim() === "" ? 0.5 : 1 }}
                                    className=""
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </LayoutMain>
    );
};

export default Chat;
