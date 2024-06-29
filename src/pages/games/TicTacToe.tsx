import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaDoorOpen } from "react-icons/fa";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Layout from "@/components/layout/main/LayoutMain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const socket = io("http://localhost:5000"); // Adjust the URL to your back-end server

interface Player {
    name: string;
    avatarUrl: string;
    games: number;
    victories: number;
    draws: number;
    losses: number;
    score: number;
}

interface Room {
    name: string;
    playerCount: number;
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
    // ... (other players)
];

const TicTacToe = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit("get_rooms");

        socket.on("update_rooms", (rooms) => {
            const roomArray = Object.entries(rooms).map(([name, players]) => ({
                name,
                playerCount: (players as any[]).length,
            }));
            setRooms(roomArray);
        });

        socket.on("room_created", ({ room }) => {
            alert(`Room ${room} created`);
            navigate(`/tic-tac-toe/${room}`);
        });

        socket.on("room_joined", ({ room }) => {
            alert(`Joined room ${room}`);
            navigate(`/tic-tac-toe/${room}`);
        });

        return () => {
            socket.off("update_rooms");
            socket.off("room_created");
            socket.off("room_joined");
        };
    }, [navigate]);

    const createRoom = () => {
        if (roomName.trim() !== "") {
            socket.emit("create_room", { room: roomName });
            setRoomName("");
        }
    };

    const joinRoom = (roomName: string) => {
        socket.emit("join_room", { room: roomName });
    };

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold text-center mb-8">TicTacToe</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col h-[550px]">
                        <h2 className="text-2xl font-bold mb-4">Create a Room</h2>
                        <div className="flex items-center mb-8">
                            <Input
                                className="mr-2"
                                placeholder="Enter room name"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                            <Button onClick={createRoom}>
                                <FaPlus className="mr-2" />
                                Create Room
                            </Button>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
                        <Input
                            className="mb-4"
                            placeholder="Search rooms"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ScrollArea className="flex-grow">
                            {filteredRooms.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredRooms.map((room, index) => (
                                        <div
                                            key={index}
                                            className="block p-4 border rounded-lg shadow-sm hover:bg-muted transition cursor-pointer"
                                            onClick={() => joinRoom(room.name)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{room.name}</span>
                                                <span>{room.playerCount}/2</span>
                                                <FaDoorOpen />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="flex-grow">No rooms found</p>
                            )}
                        </ScrollArea>
                    </div>
                    <div className="flex flex-col h-[550px]">
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
                </div>
            </div>
        </Layout>
    );
};

export default TicTacToe;
