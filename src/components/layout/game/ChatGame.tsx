import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaComment, FaEdit, FaEllipsisV, FaTrash } from 'react-icons/fa';
import { useAuth } from "@/provider/authProvider";
import { io, Socket } from 'socket.io-client';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ChatGameProps {
    messages: { text: string, isOwnMessage: boolean }[];
    onSendMessage: (message: string) => void;
    messageInput: string;
    setMessageInput: (input: string) => void;
}

const ChatGame: React.FC<ChatGameProps> = ({ messages, onSendMessage, messageInput, setMessageInput }) => {
    const { userInfo } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    return (
        <div className="w-1/4 flex flex-col h-full border-l">
            <div className="flex-grow h-full overflow-hidden flex flex-col">
                <div className="bg-background text-foreground py-4 pl-4 pr-2 h-full flex flex-col justify-end">
                    {messages.length === 0 && (
                        <div className="flex flex-col justify-center items-center h-full">
                            <FaComment size={75} className='text-primary' />
                            <p>Commence la conversation</p>
                        </div>
                    )}
                    {messages.length > 0 && (
                        <ScrollArea className="mb-4 pr-4 items-center" ref={scrollRef}>
                            <div className="flex flex-col space-y-4 w-full">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start ${message.isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <Avatar className={`w-8 h-8 ${message.isOwnMessage ? "ml-3" : "mr-3"}`}>
                                            <AvatarImage className='object-cover' src={userInfo.profile_picture} alt={userInfo.username} />
                                            <AvatarFallback>{userInfo.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className={`flex flex-col ${message.isOwnMessage ? "items-end" : "items-start"}`}>
                                            <Card className={`p-2 mb-2 ${message.isOwnMessage ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                                                {message.text}
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </div>
            <form className="gap-3 grid grid-cols-[1fr_auto] mt-4 w-full p-4 border-t border-border" onSubmit={(e) => { e.preventDefault(); onSendMessage(messageInput); }}>
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
        </div>
    );
};

export default ChatGame;
