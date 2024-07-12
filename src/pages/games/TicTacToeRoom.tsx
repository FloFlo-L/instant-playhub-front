import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LayoutGame from "@/components/layout/game/LayoutGame";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/provider/authProvider";
import socket from "@/lib/socket";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TicTacToeRoom = () => {
    const { roomName, roomId } = useParams<{ roomName: string, roomId: string }>();
    const navigate = useNavigate();
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | null>(null);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [messages, setMessages] = useState<{ text: string, isOwnMessage: boolean }[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
    const { userInfo } = useAuth();
    const [player, setPlayer] = useState<{ username: string, avatarUrl: string, score: number, id: string, symbol: string }>({
        username: "",
        avatarUrl: "",
        score: 0,
        id: "",
        symbol: ""
    });
    const { toast } = useToast();
    const hasJoinedRoom = useRef(false);

    const handlePlayerAssignment = () => {
        if (!hasJoinedRoom.current) {
            socket.emit("join_room_morpion", { room: roomName, user_id: userInfo._id, room_id: roomId });
            hasJoinedRoom.current = true;
        }
    };

    const handlePlayAgain = () => {
        socket.emit("play_again_morpion", { room: roomId, user_id: userInfo._id });
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setGameOverMessage(null);
    };

    const handleQuit = () => {
        socket.emit("disconnect_morpion");
        navigate('/');
    };

    const handleCopyLink = () => {
        const roomLink = `${window.location.origin}/rooms/morpion/${roomName}/${roomId}`;
        navigator.clipboard.writeText(roomLink).then(() => {
            setCopySuccess("Lien copié dans le presse-papiers !");
        }).catch(() => {
            setCopySuccess("Erreur lors de la copie du lien.");
        });
    };

    useEffect(() => {
        if (!userInfo || !userInfo._id) {
            return;
        }

        socket.emit("connect_morpion");

        socket.on("connected_morpion", () => {
            toast({
                description: `${userInfo.username} est connecté !`,
            });
        });

        handlePlayerAssignment();

        socket.on("game_started_morpion", () => {
            setBoard(Array(9).fill(null));
            setCurrentPlayer('X');
            setGameOverMessage(null);
            toast({
                title: "La partie commence !",
            });
        });

        socket.on("update_state_morpion", (gameState) => {
            setBoard(gameState.board.flat());
            setCurrentPlayer(gameState.current_player);
        });

        socket.on("room_joined_morpion", (data) => {
            const { player } = data;
            setPlayer(player);
            toast({
                title: `Vous jouez en tant que ${player.symbol}`,
            });
        });

        socket.on("new_message_morpion", (message) => {
            setMessages((prevMessages) => [...prevMessages, { text: `${message.user}: ${message.message}`, isOwnMessage: message.user === userInfo.username }]);
        });

        socket.on("chat_history_morpion", (history) => {
            const formattedHistory = history.map((msg: any) => ({ text: `${msg.user}: ${msg.message}`, isOwnMessage: msg.user === userInfo.username }));
            setMessages(formattedHistory);
        });

        socket.on("game_over_morpion", (data) => {
            setGameOverMessage(data.message);
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

    const handleCardClick = (index: number) => {
        if (board[index] === "" && currentPlayer === player.symbol) {
            const row = Math.floor(index / 3);
            const col = index % 3;
            socket.emit("make_move_morpion", { row, col, player: player.symbol, room: roomId });
        }
    };

    const handleSendMessage = (message: string) => {
        if (message.trim() !== "") {
            socket.emit("send_message_morpion", { room: roomId, message });
            setMessageInput("");
        }
    };

    return (
        <>
            <LayoutGame messages={messages} onSendMessage={handleSendMessage} messageInput={messageInput} setMessageInput={setMessageInput} player={player}>
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
                                {!value && (
                                    <span className="absolute inset-0 flex justify-center items-center text-4xl text-gray-400 opacity-0 hover:opacity-100">
                                        {currentPlayer === player.symbol ? player.symbol : ""}
                                    </span>
                                )}
                            </Card>
                        ))}
                    </div>
                    <p>Je joue le {player.symbol}</p>
                    <p className="text-3xl font-bold text-center mt-8">TicTacToe Room: {roomName}</p>
                </div>
            </LayoutGame>
            {gameOverMessage && (
                <Dialog open={gameOverMessage !== null} onOpenChange={open => !open && setGameOverMessage(null)}>
                    <DialogContent
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>Fin de la partie</DialogTitle>
                            <DialogDescription>{gameOverMessage}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={handlePlayAgain}>
                                Rejouer
                            </Button>
                            <Button variant="destructive" onClick={handleQuit}>Quitter</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default TicTacToeRoom;
