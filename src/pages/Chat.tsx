import { useState } from 'react';
import LayoutMain from "@/components/layout/main/LayoutMain";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaComment } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { conversationsList } from '@/fakeData';

const Chat = () => {
    const { id } = useParams();
    const initialConversation = conversationsList.find(conv => conv.id === parseInt(id, 10)) || conversationsList[0];
    const [selectedConversation, setSelectedConversation] = useState(initialConversation);
    const [messages, setMessages] = useState(initialConversation.messages);
    const [messageInput, setMessageInput] = useState("");

    const handleSendMessage = (message) => {
        if (message.trim() !== "") {
            const newMessage = { id: messages.length + 1, text: message, isOwnMessage: true, timestamp: new Date().toISOString(), user: { avatarUrl: "https://github.com/shadcn.png", name: "You" } };
            setMessages([...messages, newMessage]);
            setMessageInput("");
        }
    };

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
        setMessages(conversation.messages);
    };

    return (
        <LayoutMain>
            <div className="flex h-screen border-b">
                <div className="w-1/4 bg-secondary p-4 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-foreground">Conversations</h2>
                    <ScrollArea className="flex-grow">
                        {conversationsList.map((conversation) => (
                            <Link to={`/chat/${conversation.id}`} key={conversation.id}>    
                                <Card
                                    className={`p-4 mb-2 flex items-center cursor-pointer ${selectedConversation.id === conversation.id ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"}`}
                                    onClick={() => handleConversationClick(conversation)}
                                >
                                    <Avatar className="w-10 h-10 mr-4">
                                        <AvatarImage src={conversation.avatarUrl} alt={conversation.name} />
                                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p>{conversation.name}</p>
                                </Card>
                            </Link>
                        ))}
                    </ScrollArea>
                </div>
                <div className="w-3/4 flex flex-col h-full border-l">
                    <div className='p-4 border-b'>
                        <div className='flex items-center'>
                            <Avatar className="w-10 h-10 mr-4">
                                <AvatarImage src={selectedConversation.avatarUrl} alt={selectedConversation.name} />
                                <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                            </Avatar> 
                            <p>{selectedConversation.name}</p>
                        </div>
                    </div>
                    <div className="flex-grow h-full overflow-hidden">
                        <div className="bg-background text-foreground py-4 pl-4 pr-2 h-full flex flex-col justify-end">
                            {messages.length === 0 && (
                                <div className="flex flex-col justify-center items-center h-full">
                                    <FaComment size={75} className='text-primary'/>
                                    <p>Start conversation with your friend</p>
                                </div>
                            )}
                            {messages.length > 0 && (
                                <ScrollArea className="mb-4 pr-4 flex-grow">
                                    <div className="flex flex-col space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex items-start ${message.isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                                            >
                                                <Avatar className={`w-8 h-8 ${message.isOwnMessage ? "ml-3" : "mr-3"}`}>
                                                    <AvatarImage src={message.isOwnMessage ? "https://github.com/shadcn.png" : selectedConversation.avatarUrl} alt={message.isOwnMessage ? "You" : selectedConversation.name} />
                                                    <AvatarFallback>{message.isOwnMessage ? "Y" : selectedConversation.name.charAt(0)}</AvatarFallback>
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
                    <form className="gap-3 grid grid-cols-[1fr_auto] mt-4 w-full p-4 border-t border-border">
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
                            onClick={(e) => {
                                e.preventDefault();
                                handleSendMessage(messageInput);
                            }}
                            style={{ opacity: messageInput.trim() === "" ? 0.5 : 1 }}
                            className=""
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </LayoutMain>
    );
};

export default Chat;
