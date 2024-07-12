import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderGameProps {
    player: {
        username: string;
        avatarUrl: string;
        score: number;
        id: string;
        symbol: string;
    };
}

const HeaderGame = ({ player }: HeaderGameProps) => {
    console.log(player);
    return (
        <header className="flex justify-between items-center p-4 bg-muted text-secondary-foreground border-b">
            <div className="flex-grow flex gap-10 items-center justify-center">
                <div className="flex items-center gap-1">
                    <p className="font-bold">{player.username}</p>
                    <Avatar>
                        <AvatarImage src={player.avatarUrl} alt={player.username} />
                        <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Badge>{player.score}</Badge>
                    <p className="font-bold">({player.symbol})</p>
                </div>
            </div>
        </header>
    );
};

export default HeaderGame;
