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
    players: {
        player1: { username: string, avatarUrl: string, score: number },
        player2: { username: string, avatarUrl: string, score: number }
    };
}

const LayoutGame = ({ children, messages, onSendMessage, messageInput, setMessageInput, players }: LayoutProps) => {

    console.log(players)
    return (
        <div className="min-h-screen flex">
            <main className="flex-grow flex">
                <div className="w-1/4 bg-muted border-r"></div>
                <div className="flex flex-grow flex-col">
                    <HeaderGame players={players} />
                    <div className="flex-grow flex justify-center items-center">
                        {children}
                    </div>
                    <FooterGame />
                </div>
                <ChatGame messages={messages} onSendMessage={onSendMessage} messageInput={messageInput} setMessageInput={setMessageInput} />
            </main>
        </div>
    );
}

export default LayoutGame;