import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";

interface Player {
    name: string;
    avatarUrl: string;
    games: number;
    victories: number;
    draws: number;
    losses: number;
    score: number;
}

const players: Player[] = [
    {
        name: "Player 1",
        avatarUrl: "https://github.com/shadcn.png",
        games: 100,
        victories: 60,
        draws: 20,
        losses: 20,
        score: 200,
    },
];

const ScoreGame = () => {
    return (
        <div className="flex flex-col max-h-[750px]">
        <h2 className="text-2xl font-bold mb-4">Top Players</h2>
        <ScrollArea className="flex-grow">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Games</TableHead>
                        <TableHead>V/D/L</TableHead>
                        <TableHead>Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {players.map((player, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="flex items-center">
                                <Avatar className="mr-2">
                                    <AvatarImage src={player.avatarUrl} alt={player.name} />
                                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {player.name}
                            </TableCell>
                            <TableCell>{player.games}</TableCell>
                            <TableCell>{player.victories}/{player.draws}/{player.losses}</TableCell>
                            <TableCell>{player.score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ScrollArea>
        <div className="mt-4 text-center">
            <Button>See More</Button>
        </div>
    </div>
    )
}
export default ScoreGame