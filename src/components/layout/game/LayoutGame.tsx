import { ReactNode } from "react";
import HeaderGame from "@/components/layout/game/HeaderGame";
import FooterGame from "@/components/layout/game/FooterGame";
import ChatGame from "@/components/layout/game/ChatGame";

interface LayoutProps {
    children: ReactNode;
    messages: { text: string, isOwnMessage: boolean }[];
    onSendMessage: (message: string) => void;
    messageInput: string;
    setMessageInput: (input: string) => void;
    player: {
        username: string;
        avatarUrl: string;
        score: number;
        id: string;
        symbol: string;
    };
}

const LayoutGame = ({ children, messages, onSendMessage, messageInput, setMessageInput, player }: LayoutProps) => {
    console.log("player layout game", player);
    return (
        <div className="min-h-screen flex">
            <main className="flex-grow flex">
                <div className="flex flex-grow flex-col">
                    <HeaderGame player={player} />
                    <div className="flex-grow flex justify-center items-center">
                        {children}
                    </div>
                    <FooterGame />
                </div>
                <ChatGame messages={messages} onSendMessage={onSendMessage} messageInput={messageInput} setMessageInput={setMessageInput} />
            </main>
        </div>
    );
};

export default LayoutGame;
