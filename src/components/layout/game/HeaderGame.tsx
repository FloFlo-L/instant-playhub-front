import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderGameProps {
  score1: number;
  score2: number;
}

const HeaderGame = ({ score1, score2 }: HeaderGameProps) => {
    return (
        <header className="flex justify-between items-center p-4 bg-muted text-secondary-foreground border-b">
            <div className="flex-grow flex gap-10 items-center justify-center">
                <div className="flex items-center gap-1">
                    <p className="font-bold">Player 1</p>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="Player 1" />
                        <AvatarFallback>P1</AvatarFallback>
                    </Avatar>
                    <Badge>{score1}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                    <Badge>{score2}</Badge>
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
