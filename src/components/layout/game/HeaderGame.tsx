import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderGameProps {
    players: {
        player1: { username: string, avatarUrl: string, score: number },
        player2: { username: string, avatarUrl: string, score: number }
    };
}

const HeaderGame = ({ players }: HeaderGameProps) => {
    const player1Initial = players.player1.username ? players.player1.username.charAt(0) : "";
    const player2Initial = players.player2.username ? players.player2.username.charAt(0) : "";

    return (
        <header className="flex justify-between items-center p-4 bg-muted text-secondary-foreground border-b">
            <div className="flex-grow flex gap-10 items-center justify-center">
                <div className="flex items-center gap-1">
                    <p className="font-bold">{players.player1.username || "Player 1"}</p>
                    <Avatar>
                        <AvatarImage src={players.player1.avatarUrl} alt={players.player1.username} />
                        <AvatarFallback>{player1Initial}</AvatarFallback>
                    </Avatar>
                    <Badge>{players.player1.score}</Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Badge>{players.player2.score}</Badge>
                    <Avatar>
                        <AvatarImage src={players.player2.avatarUrl} alt={players.player2.username} />
                        <AvatarFallback>{player2Initial}</AvatarFallback>
                    </Avatar>
                    <p className="font-bold">{players.player2.username || "Player 2"}</p>
                </div>
            </div>
        </header>
    );
};

export default HeaderGame;
