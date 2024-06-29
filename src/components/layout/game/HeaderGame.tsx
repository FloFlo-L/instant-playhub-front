import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const HeaderGame = () => {
    return (
        <header className="flex justify-between items-center p-4 bg-muted text-secondary-foreground border-b">
            <div className="flex-grow flex gap-10 items-center justify-center">
                <div className="flex items-center gap-1">
                    <p className="font-bold">Player 1</p>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="Player 1" />
                        <AvatarFallback>P1</AvatarFallback>
                    </Avatar>
                    <Badge>0</Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Badge>0</Badge>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="Player 2" />
                        <AvatarFallback>P2</AvatarFallback>
                    </Avatar>
                    <p className="font-bold">Player 2</p>
                </div>
            </div>
        </header>
    );
};

export default HeaderGame;
