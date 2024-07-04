import { useState } from 'react';
import LayoutMain from "@/components/layout/main/LayoutMain";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaComment } from 'react-icons/fa';

const conversationsList = [
    { id: 1, name: "Bjorn Le Chauve", avatarUrl: "https://github.com/shadcn.png" },
    { id: 2, name: "Bob Javat", avatarUrl: "https://github.com/shadcn.png" },
    { id: 3, name: "Cocolasticaut", avatarUrl: "https://github.com/shadcn.png" },
    { id: 4, name: "Gifter", avatarUrl: "https://github.com/shadcn.png" },
    { id: 5, name: "NICO", avatarUrl: "https://github.com/shadcn.png" },
    { id: 6, name: "Marsoulin", avatarUrl: "https://github.com/shadcn.png" },
    { id: 7, name: "Soupe2Legume", avatarUrl: "https://github.com/shadcn.png" },
    { id: 8, name: "Lysahi", avatarUrl: "https://github.com/shadcn.png" },
];

const Chat = () => {
    const [selectedConversation, setSelectedConversation] = useState(conversationsList[0]);
    const [messages, setMessages] = useState([
        { text: "Hello!", isOwnMessage: true },
        { text: "Hi there!", isOwnMessage: false },
        { text: "How are you?", isOwnMessage: true },
        { text: "I'm good, thanks!", isOwnMessage: false },
        { text: "Hello!", isOwnMessage: true },
        { text: "Hi there!", isOwnMessage: false },
        { text: "How are you?", isOwnMessage: true },
        { text: "I'm good, thanks!", isOwnMessage: false },
        { text: "Hello!", isOwnMessage: true },
        { text: "Hi there!", isOwnMessage: false },
        { text: "How are you?", isOwnMessage: true },
        { text: "I'm good, thanks!", isOwnMessage: false },
        { text: "Hello!", isOwnMessage: true },
        { text: "Hi there!", isOwnMessage: false },
        { text: "How are you?", isOwnMessage: true },
        { text: "I'm good, thanks!", isOwnMessage: false },
    ]);

    const [messageInput, setMessageInput] = useState("");

    const handleSendMessage = (message) => {
        if (message.trim() !== "") {
            setMessages([...messages, { text: message, isOwnMessage: true }]);
            setMessageInput("");
        }
    };

    return (
        <LayoutMain>
            <div className="flex h-screen">
                <div className="w-1/4 bg-secondary p-4 border-r border-border flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-foreground">Conversations</h2>
                    <ScrollArea className="flex-grow">
                        {conversationsList.map((conversation) => (
                            <Card
                                key={conversation.id}
                                className={`p-4 mb-2 flex items-center cursor-pointer ${selectedConversation.id === conversation.id ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"}`}
                                onClick={() => setSelectedConversation(conversation)}
                            >
                                <Avatar className="w-10 h-10 mr-4">
                                    <AvatarImage src={conversation.avatarUrl} alt={conversation.name} />
                                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p>{conversation.name}</p>
                            </Card>
                        ))}
                    </ScrollArea>
                </div>
                <div className="w-3/4 flex flex-col h-full">
                    <div className="flex-grow h-full overflow-hidden">
                        <div className="border-l border-border bg-background text-foreground py-4 pl-4 pr-2 h-full flex flex-col justify-end">
                            {messages.length === 0 && (
                                <div className="flex flex-col justify-center items-center h-full">
                                    <FaComment size={75} className='text-primary'/>
                                    <p>Start conversation with ur friend</p>
                                </div>
                            )}
                            {messages.length > 0 && (
                                <ScrollArea className="mb-4 pr-4 flex-grow">
                                    <div className="flex flex-col space-y-2">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${message.isOwnMessage ? "justify-end" : "justify-start"}`}
                                            >
                                                <Card
                                                    className={`p-2 mb-2 ${message.isOwnMessage ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                                                        }`}
                                                >
                                                    {message.text}
                                                </Card>
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
