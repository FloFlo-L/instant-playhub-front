import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageCircle from "@/assets/icon/chat-messages-svgrepo-com.svg";
import { Send } from "lucide-react";

const ChatGame = () => {
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
        <div className="border-l bg-muted text-card-foreground py-4 pl-4 pr-2 w-1/4 flex flex-col h-screen justify-end">
            {messages.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <img
                        src={MessageCircle}
                        alt="Message"
                        className="w-1/2 mx-auto"
                    />
                </div>
            )}
            {messages.length > 0 && (
                <ScrollArea className="mb-4 pr-4">
                    <div className="flex flex-col space-y-2">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                                <Card
                                    className={`p-2 mb-2 ${message.isOwnMessage ? "bg-primary text-primary-foreground" : "text-muted text-muted-foreground"
                                        }`}
                                >
                                    {message.text}
                                </Card>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            <form className="gap-3 grid grid-cols-[1fr_auto] mt-4 w-full">
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
                    onClick={() => handleSendMessage(messageInput)}
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
