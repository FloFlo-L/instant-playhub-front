import { ReactNode } from "react";
import HeaderGame from "@/components/layout/game/HeaderGame";
import FooterGame from "@/components/layout/game/FooterGame";
import ChatGame from "@/components/layout/game/ChatGame";

interface LayoutProps {
    children: ReactNode;
}

const LayoutMain = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen flex">
            <main className="flex-grow flex">
                <div className="w-1/4 bg-muted border-r"></div>
                <div className="flex flex-grow flex-col">
                    <HeaderGame />
                    <div className="flex-grow flex justify-center items-center">
                        {children}
                    </div>
                    <FooterGame />
                </div>
                <ChatGame />
            </main>
        </div>
    );
}

export default LayoutMain;
