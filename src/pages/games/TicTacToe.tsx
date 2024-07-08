import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaDoorOpen } from "react-icons/fa";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "@/components/layout/main/LayoutMain";
import ScoreGame from "./ScoreGame";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/provider/authProvider";

const socket = io("http://localhost:5000");

interface Room {
    name: string;
    playerCount: number;
}

const TicTacToe = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomName, setRoomName] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const { userInfo } = useAuth();

    useEffect(() => {
        socket.emit("get_rooms");

        socket.on("update_rooms", (updatedRooms: Record<string, any>[]) => {
            const formattedRooms = Object.entries(updatedRooms).map(([name, players]) => ({
                name,
                playerCount: players.length
            }));
            setRooms(formattedRooms);
        });

        socket.on("room_created", ({ room }) => {
            toast({ title: `Room ${room} created successfully!` });
            navigate(`/tic-tac-toe/${room}`);
        });

        socket.on("room_joined", ({ room }) => {
            toast({ title: `Joined room ${room}` });
            navigate(`/tic-tac-toe/${room}`);
        });

        socket.on("error", (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        });

        return () => {
            socket.off("update_rooms");
            socket.off("room_created");
            socket.off("room_joined");
            socket.off("error");
        };
    }, [navigate, toast]);

    const createRoom = () => {
        if (roomName.trim() !== "" && userInfo) {
            socket.emit("create_room", { room: roomName, user_id: userInfo._id });
            setRoomName("");
        }
    };

    const joinRoom = (roomName: string) => {
        if (userInfo) {
            socket.emit("join_room", { room: roomName, user_id: userInfo._id });
        }
    };

    const filteredRooms = rooms.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <div className="container mx-auto py-12 min-h-screen">
                <h1 className="text-4xl font-bold text-center mb-8">TicTacToe</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col max-h-[750px]">
                        <h2 className="text-2xl font-bold mb-4">Create a Room</h2>
                        <div className="flex gap-5 items-center mb-8">
                            <div className="w-1/2">
                                <Input
                                    className="mr-2"
                                    placeholder="Enter room name"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                />
                            </div>
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
                    <ScoreGame />
                </div>
            </div>
        </Layout>
    );
};

export default TicTacToe;
