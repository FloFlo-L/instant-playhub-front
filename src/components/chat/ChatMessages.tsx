import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaComment } from 'react-icons/fa';
import { useAuth } from "@/provider/authProvider";
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Card } from '../ui/card';

interface User {
    _id: string;
    username: string;
    profile_picture: string;
}

interface Message {
    _id: string;
    Sender: string;
    content: string;
    created_at: string;
}

interface Conversation {
    chat_id: string;
    other_user: User;
    created_at: string;
}

interface ChatMessagesProps {
    selectedConversation: Conversation | null;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ selectedConversation }) => {
    const { token, userInfo } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const fetchMessages = async (chatId: string) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/chat/messages/${chatId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data.messages || []);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        if (selectedConversation) {
            fetchMessages(selectedConversation.chat_id);
        }
    }, [selectedConversation, token]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL, {
            query: { token }  // Envoie le token JWT comme argument de requête
        });
        socketRef.current = socket;
    
        socket.on('connect', () => {
            if (selectedConversation) {
                socket.emit('join', { chat_id: selectedConversation.chat_id });
                console.log("Connected to socket server");
            }
        });
    
        socket.on('message', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
            console.log("Received message", message);
        });
    
        return () => {
            if (selectedConversation) {
                socket.emit('leave', { chat_id: selectedConversation.chat_id });
            }
            socket.disconnect();
        };
    }, [selectedConversation, token]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handleSendMessage = async (message: string) => {
        if (message.trim() !== "" && selectedConversation) {
            const newMessage = {
                chat_id: selectedConversation.chat_id,
                content: message,
                Sender: userInfo._id,
                created_at: new Date().toISOString(),
                token  // Ajout du token JWT dans le message
            };

            if (socketRef.current) {
                socketRef.current.emit('message', newMessage);
            }

            setMessageInput("");
            scrollToBottom();
        }
    };

    return (
        <div className="w-full md:w-3/4 flex flex-col h-full border-l">
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
                    <div className="flex-grow h-full overflow-hidden flex flex-col">
                        <div className="bg-background text-foreground py-4 pl-4 pr-2 h-full flex flex-col justify-end">
                            {messages.length === 0 && (
                                <div className="flex flex-col justify-center items-center h-full">
                                    <FaComment size={75} className='text-primary' />
                                    <p>Commence la conversation avec ton ami</p>
                                </div>
                            )}
                            {messages.length > 0 && (
                                <ScrollArea className="mb-4 pr-4 items-center" ref={scrollRef}>
                                    <div className="flex flex-col space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message._id}
                                                className={`flex items-start ${message.Sender === userInfo._id ? "flex-row-reverse" : "flex-row"}`}
                                            >
                                                <Avatar className={`w-8 h-8 ${message.Sender === userInfo._id ? "ml-3" : "mr-3"}`}>
                                                    <AvatarImage src={message.Sender === userInfo._id ? userInfo.profile_picture : selectedConversation.other_user.profile_picture} alt={message.Sender === userInfo._id ? "You" : selectedConversation.other_user.username} />
                                                    <AvatarFallback>{message.Sender === userInfo._id ? userInfo.username.charAt(0) : selectedConversation.other_user.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className={`flex flex-col max-w-[75%] md:max-w-[45%] ${message.Sender === userInfo._id ? "items-end" : "items-start"}`}>
                                                    <Card className={`p-2 mb-2 ${message.Sender === userInfo._id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                                                        {message.content}
                                                    </Card>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {new Date(message.created_at).toLocaleString()}
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
    );
};

export default ChatMessages;