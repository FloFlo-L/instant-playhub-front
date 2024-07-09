import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import LayoutGame from "@/components/layout/game/LayoutGame";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const socket = io(import.meta.env.VITE_API_URL);

const TicTacToeRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | null>(null);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [messages, setMessages] = useState<{ text: string, isOwnMessage: boolean }[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [players, setPlayers] = useState({
        player1: { username: "", avatarUrl: "", score: 0 },
        player2: { username: "", avatarUrl: "", score: 0 }
    });
    const { toast } = useToast();

    useEffect(() => {
        socket.emit("join_room", { room: roomId, user_id: "123" });

        socket.on("game_started", (data) => {
            setBoard(Array(9).fill(null));
        });

        socket.on("update_state", (gameState) => {
            setBoard(gameState.board.flat());
            setCurrentPlayer(gameState.current_player);
        });

        socket.on("room_joined", (data) => {
            setCurrentPlayer(data.symbol);
        });

        socket.on("new_message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on("chat_history", (history) => {
            setMessages(history);
        });

        socket.on("game_over", (data) => {
            toast({ title: data.message });
        });

        socket.on("error", (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        });

        axios.get(`${import.meta.env.VITE_API_URL}/user/26321341f0fd4791a6be439374622c8e`).then((response) => {
            console.log(response)
            setPlayers((prevPlayers) => ({
                ...prevPlayers,
                player1: {
                    username: response.data.user_data.username,
                    avatarUrl: response.data.user_data.profile_picture,
                    score: 0
                }
            }));
        });

        axios.get(`${import.meta.env.VITE_API_URL}/user/244b7859a7f24949b9f442431c575e43`).then((response) => {
            setPlayers((prevPlayers) => ({
                ...prevPlayers,
                player2: {
                    username: response.data.user_data.username,
                    avatarUrl: response.data.user_data.profile_picture,
                    score: 0
                }
            }));
        });

        return () => {
            socket.off("game_started");
            socket.off("update_state");
            socket.off("room_joined");
            socket.off("new_message");
            socket.off("chat_history");
            socket.off("game_over");
            socket.off("error");
        };
    }, [roomId, toast]);

    const handleCardClick = (index: number) => {
        if (board[index] === null && currentPlayer) {
            const row = Math.floor(index / 3);
            const col = index % 3;
            socket.emit("make_move", { row, col, player: currentPlayer, room: roomId });
        }
    };

    const handleSendMessage = (message: string) => {
        if (message.trim() !== "") {
            socket.emit("send_message", { room: roomId, message });
            setMessages((prevMessages) => [...prevMessages, { text: message, isOwnMessage: true }]);
            setMessageInput("");
        }
    };

    return (
        <LayoutGame messages={messages} onSendMessage={handleSendMessage} messageInput={messageInput} setMessageInput={setMessageInput} players={players}>
            <div className="flex flex-col justify-center items-center h-full">
                <div className="grid grid-cols-3 gap-4 w-64 h-64">
                    {board.map((value, index) => (
                        <Card
                            key={index}
                            className={`border border-primary flex justify-center items-center hover:cursor-pointer relative`}
                            onClick={() => handleCardClick(index)}
                        >
                            {value && (
                                <span className="absolute inset-0 flex justify-center items-center text-4xl">
                                    {value}
                                </span>
                            )}
                            {!value && currentPlayer && (
                                <span className="absolute inset-0 flex justify-center items-center text-4xl text-gray-400 opacity-0 hover:opacity-100">
                                    {currentPlayer}
                                </span>
                            )}
                        </Card>
                    ))}
                </div>
                <p className="text-3xl font-bold text-center mt-8">TicTacToe Room: {roomId}</p>
            </div>
        </LayoutGame>
    );
};

export default TicTacToeRoom;
