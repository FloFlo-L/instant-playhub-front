import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";

const ConnectFourRoom = () => {
    const [currentPlayer, setCurrentPlayer] = useState<"X" | "O" | null>(null);
    const [board, setBoard] = useState<(string | null)[][]>(Array(6).fill(Array(7).fill(null)));
    const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
    const [waitingForOpponent, setWaitingForOpponent] = useState(true);
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const hasJoinedRoom = useRef(false);

    const handlePlayerAssignment = () => {
        if (!hasJoinedRoom.current) {
            socket.emit("join_room_connect4");
            hasJoinedRoom.current = true;
        }
    };

    const handlePlayAgain = () => {
        socket.emit("play_again_connect4");
        setWaitingForOpponent(true);
    };

    const handleQuit = () => {
        socket.emit("disconnect_connect4");
    };

    const handleCopyLink = () => {
        const roomLink = `${window.location.origin}/rooms/connect4`;
        navigator.clipboard.writeText(roomLink).then(() => {
            setCopySuccess("Lien copié dans le presse-papiers !");
        }).catch(() => {
            setCopySuccess("Erreur lors de la copie du lien.");
        });
    };

    useEffect(() => {
        socket.emit("connect_connect4");

        socket.on("connected_connect4", () => {
            handlePlayerAssignment();
        });

        socket.on("game_started_connect4", () => {
            setBoard(Array(6).fill(Array(7).fill(null)));
            setCurrentPlayer('X');
            setGameOverMessage(null);
            setWaitingForOpponent(false);
        });

        socket.on("update_state_connect4", (gameState) => {
            setBoard(gameState.board);
            setCurrentPlayer(gameState.current_player);
        });

        socket.on("room_joined_connect4", () => {
            setNumberOfPlayers((prev) => prev + 1);
            if (numberOfPlayers + 1 >= 2) {
                setWaitingForOpponent(false);
            }
        });

        socket.on("game_over_connect4", (data) => {
            setGameOverMessage(data.message);
        });

        socket.on("waiting_for_opponent", () => {
            setWaitingForOpponent(true);
        });

        socket.on("opponent_left", () => {
            setGameOverMessage(null);
        });

        socket.on("error_connect4", (error) => {
            alert(error.message);
        });

        return () => {
            socket.off("connected_connect4");
            socket.off("game_started_connect4");
            socket.off("update_state_connect4");
            socket.off("room_joined_connect4");
            socket.off("game_over_connect4");
            socket.off("waiting_for_opponent");
            socket.off("opponent_left");
            socket.off("error_connect4");
        };
    }, [numberOfPlayers]);

    const handleCellClick = (colIndex: number) => {
        socket.emit("make_move_connect4", { column: colIndex });
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center h-full">
                <div className="grid grid-cols-7 gap-1 w-full h-full">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="cell"
                                    onClick={() => handleCellClick(colIndex)}
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <p>Current Player: {currentPlayer}</p>
            </div>
            {gameOverMessage && (
                <Dialog open={true}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Game Over</DialogTitle>
                            <DialogDescription>{gameOverMessage}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={handlePlayAgain} disabled={waitingForOpponent}>
                                {waitingForOpponent ? "Waiting for opponent..." : "Play Again"}
                            </Button>
                            <Button onClick={handleQuit}>Quit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            <Dialog open={waitingForOpponent}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Waiting for an opponent</DialogTitle>
                        <DialogDescription>
                            Please wait until a second player joins the room.
                            <Button onClick={handleCopyLink} className="mt-4">Copy Room Link</Button>
                            {copySuccess && <p className="mt-2">{copySuccess}</p>}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ConnectFourRoom;
