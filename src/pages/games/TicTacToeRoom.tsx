import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LayoutGame from "@/components/layout/game/LayoutGame";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

const socket = io("http://localhost:5000"); // Adjust the URL to your back-end server

const TicTacToeRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | null>(null);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [messages, setMessages] = useState<string[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        socket.emit("join_room", { room: roomId });

        socket.on("room_joined", (data) => {
            setCurrentPlayer(data.symbol);
        });

        socket.on("update_state", (gameState) => {
            setBoard(gameState.board);
        });

        socket.on("new_message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on("chat_history", (history) => {
            setMessages(history);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId]);

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
            setMessageInput("");
        }
    };

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <LayoutGame>
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
                <div className="border-t mt-4 w-full">
                    <ScrollArea className="h-32 p-4">
                        {messages.map((message, index) => (
                            <div key={index} className="mb-2">
                                {message}
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </ScrollArea>
                    <form
                        className="gap-3 grid grid-cols-[1fr_auto] mt-4 w-full"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage(messageInput);
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="Écrivez un message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            style={{ opacity: messageInput.trim() === "" ? 0.5 : 1 }}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </LayoutGame>
    );
};

export default TicTacToeRoom;
