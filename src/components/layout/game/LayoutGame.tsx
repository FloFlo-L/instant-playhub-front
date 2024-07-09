import { ReactNode } from "react";
import HeaderGame from "@/components/layout/game/HeaderGame";
import FooterGame from "@/components/layout/game/FooterGame";
import ChatGame from "@/components/layout/game/ChatGame";

interface LayoutProps {
  children: ReactNode;
  score1: number;
  score2: number;
}

const LayoutMain = ({ children, score1, score2 }: LayoutProps) => {
    return (
        <div className="min-h-screen flex">
            <main className="flex-grow flex">
                <div className="w-1/4 bg-muted border-r"></div>
                <div className="flex flex-grow flex-col">
                    <HeaderGame score1={score1} score2={score2} />
                    <div className="flex-grow flex justify-center items-center">
                        {children}
                    </div>
                    <FooterGame />
                </div>
                <ChatGame />
            </main>
        </div>
    );
};

export default LayoutMain;
