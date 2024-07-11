import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LayoutGame from "@/components/layout/game/LayoutGame";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useAuth } from "@/provider/authProvider";
import socket from "@/lib/socket";

const TicTacToeRoom = () => {
    const { roomName, roomId } = useParams<{ roomName: string, roomId: string }>();
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | null>(null);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [messages, setMessages] = useState<{ text: string, isOwnMessage: boolean }[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const { userInfo } = useAuth();
    const [players, setPlayers] = useState({
        player1: { username: "", avatarUrl: "", score: 0, id: "", symbol: "" },
        player2: { username: "", avatarUrl: "", score: 0, id: "", symbol: "" }
    });
    const { toast } = useToast();
    const navigate = useNavigate();
    const hasJoinedRoom = useRef(false);
    const playerSymbol = useRef("");

    const fetchPlayerData = async (userId, playerKey) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/${userId}`);
            const userData = response.data;
            setPlayers(prevPlayers => ({
                ...prevPlayers,
                [playerKey]: {
                    username: userData?.username,
                    avatarUrl: userData?.profile_picture,
                    score: 0,
                    id: userData?._id,
                    symbol: playerKey === 'player1' ? 'X' : 'O'  // Assign symbol based on player key
                }
            }));
            console.log("player playerKey", playerKey);
            if (playerKey === 'player1') {
                playerSymbol.current = 'X';
            } else {
                playerSymbol.current = 'O';
            }
        } catch (error) {
            console.error(`Failed to fetch player data for ${playerKey}:`, error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to fetch player data for ${playerKey}`,
            });
        }
    };

    const handlePlayerAssignment = async () => {
        if (!players.player1.id) {
            await fetchPlayerData(userInfo._id, 'player1');
        } else if (players.player1.id !== userInfo._id && !players.player2.id) {
            await fetchPlayerData(userInfo._id, 'player2');
        }
        if (!hasJoinedRoom.current) {
            socket.emit("join_room_morpion", { room: roomName, user_id: userInfo._id, room_id: roomId });
            hasJoinedRoom.current = true;
        }
    };

    useEffect(() => {
        if (!userInfo || !userInfo._id) {
            return;
        }

        socket.emit("connect_morpion");

        socket.on("connected_morpion", () => {
            if (userInfo._id) {
                toast({
                    description: `${userInfo.username} est connecté  !`,
                });
            }
        });

        handlePlayerAssignment();

        socket.on("game_started_morpion", () => {
            setBoard(Array(9).fill(null));
            setCurrentPlayer('X');
        });

        socket.on("update_state_morpion", (gameState) => {
            setBoard(gameState.board.flat());
            setCurrentPlayer(gameState.current_player);
        });

        socket.on("room_joined_morpion", (data) => {
            setPlayers(prevPlayers => {
                const updatedPlayers = { ...prevPlayers };
                data.players.forEach((player, index) => {
                    if (index === 0) {
                        updatedPlayers.player1.username = player.username;
                        updatedPlayers.player1.avatarUrl = player.avatarUrl;
                        updatedPlayers.player1.symbol = 'X';
                    } else if (index === 1) {
                        updatedPlayers.player2.username = player.username;
                        updatedPlayers.player2.avatarUrl = player.avatarUrl;
                        updatedPlayers.player2.symbol = 'O';
                    }
                });
                return updatedPlayers;
            });

            if (data.players.length === 2) {
                socket.emit("start_game_morpion", { room: roomId });
                toast({
                    title: "La partie commence !"
                });
            }
        });

        socket.on("new_message_morpion", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on("chat_history_morpion", (history) => {
            setMessages(history);
        });

        socket.on("game_over_morpion", (data) => {
            toast({ title: data.message });
        });

        socket.on("error_morpion", (error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        });

        return () => {
            socket.off("connected_morpion");
            socket.off("game_started_morpion");
            socket.off("update_state_morpion");
            socket.off("room_joined_morpion");
            socket.off("new_message_morpion");
            socket.off("chat_history_morpion");
            socket.off("game_over_morpion");
            socket.off("error_morpion");
        };
    }, [roomName, toast, userInfo]);

    const handleCardClick = (index) => {
        if (board[index] === null && currentPlayer === playerSymbol.current) {
            const row = Math.floor(index / 3);
            const col = index % 3;
            socket.emit("make_move_morpion", { row, col, player: playerSymbol.current, room: roomId });
        }
    };

    const handleSendMessage = (message) => {
        if (message.trim() !== "") {
            socket.emit("send_message_morpion", { room: roomId, message });
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
                            {!value && currentPlayer === playerSymbol.current && (
                                <span className="absolute inset-0 flex justify-center items-center text-4xl text-gray-400 opacity-0 hover:opacity-100">
                                    {playerSymbol.current}
                                </span>
                            )}
                        </Card>
                    ))}
                </div>
                <p>Je joue le {playerSymbol.current}</p>
                <p className="text-3xl font-bold text-center mt-8">TicTacToe Room: {roomName}</p>
            </div>
        </LayoutGame>
    );
};

export default TicTacToeRoom;
