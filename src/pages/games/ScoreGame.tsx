import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/provider/authProvider";

const ScoreGame = () => {
    const { gameType } = useParams();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        fetchScores(gameType);
    }, [gameType]);

    const fetchScores = async (gameType) => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores/game/${gameType}`, {
                headers: { Authorization: `Bearer ${token}` } // Assurez-vous de fournir le token
            });
            const enrichedScores = await Promise.all(response.data.map(async (score) => {
                const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/${score.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return {
                    ...score,
                    username: userResponse.data.username,
                    avatarUrl: userResponse.data.profile_picture
                };
            }));
            setPlayers(enrichedScores);
        } catch (error) {
            console.error("Failed to fetch scores", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col max-h-[750px]">
            <h2 className="text-2xl font-bold mb-4">Meilleurs joueurs</h2>
            {loading ? (
                <div className="flex justify-center items-center w-full">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </div>
            ) : (
                <ScrollArea className="flex-grow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Joueur</TableHead>
                                <TableHead>Jeu</TableHead>
                                <TableHead>V/D/E</TableHead>
                                <TableHead>Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map((player, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="flex items-center">
                                        <Avatar className="mr-2">
                                            <AvatarImage src={player.avatarUrl} alt={player.username} />
                                            <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {player.username}
                                    </TableCell>
                                    <TableCell>{gameType}</TableCell>
                                    <TableCell>{player.wins}/{player.draws}/{player.losses}</TableCell>
                                    <TableCell>{player.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            )}
            <div className="mt-4 text-center">
                <Button asChild>
                    <Link to="/scores">
                        Voir plus
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default ScoreGame;
