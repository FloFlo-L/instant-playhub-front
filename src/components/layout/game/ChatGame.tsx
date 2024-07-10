import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { FaComment } from "react-icons/fa";

interface ChatGameProps {
    messages: { text: string, isOwnMessage: boolean }[];
    onSendMessage: (message: string) => void;
    messageInput: string;
    setMessageInput: (input: string) => void;
}

const ChatGame = ({ messages, onSendMessage, messageInput, setMessageInput }: ChatGameProps) => {
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="border-l bg-muted text-card-foreground py-4 pl-4 pr-2 w-1/4 flex flex-col h-screen justify-end">
            {messages.length === 0 && (
                <div className="flex justify-center items-center h-full">
                    <FaComment />
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
                        <div ref={chatEndRef} />
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
                    onClick={(e) => {
                        e.preventDefault();
                        onSendMessage(messageInput);
                    }}
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
