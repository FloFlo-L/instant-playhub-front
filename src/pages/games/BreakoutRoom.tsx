import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import LayoutGame from "@/components/layout/game/LayoutGame";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMediaQuery from '@/hooks/useMediaQuery'; // Adjust the import path as necessary

const socket = io(import.meta.env.VITE_API_URL);

interface Ball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
}

interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
}

const BreakoutRoom = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const isMobile = useMediaQuery("(max-width: 768px)"); // Change the breakpoint as necessary
    const [ball, setBall] = useState<Ball>({
        x: 150,
        y: 200,
        dx: 2,
        dy: -2,
        radius: 10,
    });
    const [paddle1, setPaddle1] = useState<Paddle>({
        x: 100,
        y: 450,
        width: 100,
        height: 20,
    });
    const [paddle2, setPaddle2] = useState<Paddle>({
        x: 100,
        y: 30,
        width: 100,
        height: 20,
    });
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const chatEndRef = useRef<null | HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(""); // Can be "Player 1" or "Player 2"
    const [gameStarted, setGameStarted] = useState(false); // Track if the game has started

    // AI related states and constants
    const aiUpdateInterval = 30; // Interval for AI movement update (milliseconds)
    const paddleSpeed = 5; // Speed of the AI paddle movement
    const [player2Joined, setPlayer2Joined] = useState(false); // Track if a real player has joined

    useEffect(() => {
        socket.emit("join_room", { room: roomId, user_id: "123" });

        socket.on("room_joined", ({ room }) => {
        alert(`Joined room ${room}`);
        setPlayer2Joined(true); // Set player 2 joined when a real player joins
        });

        socket.on(
        "update_game_state",
        ({ ball, paddle1, paddle2, score1, score2 }) => {
            setBall(ball);
            setPaddle1(paddle1);
            setPaddle2(paddle2);
            setScore1(score1);
            setScore2(score2);
        }
        );

        const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowLeft") {
            handlePaddleMove("left");
        } else if (event.key === "ArrowRight") {
            handlePaddleMove("right");
        }
        };

        if (!isMobile) {
        window.addEventListener("keydown", handleKeyDown);
        }

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        const drawBall = () => {
        if (context) {
            context.beginPath();
            context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            context.fillStyle = "purple";
            context.fill();
            context.closePath();
        }
        };

        const drawPaddle = (paddle: Paddle) => {
        if (context) {
            context.beginPath();
            context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
            context.fillStyle = "#0095DD";
            context.fill();
            context.closePath();
        }
        };

        const moveBall = () => {
        let newX = ball.x + ball.dx;
        let newY = ball.y + ball.dy;

        // Collision with walls
        if (
            newX + ball.radius > (canvas?.width || 300) ||
            newX - ball.radius < 0
        ) {
            ball.dx = -ball.dx;
        }

        // Collision with top wall (score for Player 1)
        if (newY - ball.radius < 0) {
            setScore1((prevScore) => prevScore + 1);
            resetBall();
            return;
        }

        // Collision with bottom wall (score for Player 2)
        if (newY + ball.radius > (canvas?.height || 500)) {
            setScore2((prevScore) => prevScore + 1);
            resetBall();
            return;
        }

        // Collision with paddles
        if (
            (newY + ball.radius > paddle1.y &&
            newX > paddle1.x &&
            newX < paddle1.x + paddle1.width) ||
            (newY - ball.radius < paddle2.y + paddle2.height &&
            newX > paddle2.x &&
            newX < paddle2.x + paddle2.width)
        ) {
            ball.dy = -ball.dy;
        }

        // Update ball position
        setBall({ ...ball, x: newX, y: newY });
        };

        const draw = () => {
        if (context && canvas) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
            drawPaddle(paddle1);
            drawPaddle(paddle2);
        }
        };

        const interval = setInterval(() => {
        if (!gameOver && gameStarted) {
            draw();
            moveBall();
        }
        }, 10);

        const aiMovementInterval = setInterval(() => {
        if (!player2Joined && !gameOver && gameStarted) {
            const newPaddle = { ...paddle2 };
            const ballCenterX = ball.x + ball.radius;
            const paddleCenterX = newPaddle.x + newPaddle.width / 2;

            if (ballCenterX < paddleCenterX - 10) {
            newPaddle.x -= paddleSpeed;
            } else if (ballCenterX > paddleCenterX + 10) {
            newPaddle.x += paddleSpeed;
            }

            // Ensure paddle stays within canvas bounds
            if (newPaddle.x < 0) {
            newPaddle.x = 0;
            } else if (newPaddle.x > (canvas?.width || 300) - newPaddle.width) {
            newPaddle.x = (canvas?.width || 300) - newPaddle.width;
            }

            setPaddle2(newPaddle);
        }
        }, aiUpdateInterval);

        if (score1 === 10 || score2 === 10) {
        setGameOver(true);
        setWinner(score1 === 10 ? "Player 1" : "Player 2");
        setGameStarted(false); // Stop the game if it's over
        }

        return () => {
        socket.off("room_joined");
        socket.off("update_game_state");
        if (!isMobile) {
            window.removeEventListener("keydown", handleKeyDown);
        }
        clearInterval(interval);
        clearInterval(aiMovementInterval);
        };
    }, [ball, paddle1, paddle2, gameOver, player2Joined, roomId, score1, score2, isMobile, gameStarted]);

    const resetBall = () => {
        setBall({ x: 150, y: 200, dx: 2, dy: -2, radius: 10 });
    };

    const handlePaddleMove = (direction: string) => {
        const newPaddle = { ...paddle1 };
        if (direction === "left" && newPaddle.x > 0) {
        newPaddle.x -= 20;
        } else if (
        direction === "right" &&
        newPaddle.x < (canvasRef.current?.width || 300) - newPaddle.width
        ) {
        newPaddle.x += 20;
        }
        setPaddle1(newPaddle);
        socket.emit("make_move", {
        room: roomId,
        ball,
        paddle1: newPaddle,
        paddle2,
        score1,
        score2,
        });
    };

    const handleStartGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setWinner("");
        resetBall();
    };

    const handleRestartGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setWinner("");
        setScore1(0);
        setScore2(0);
        resetBall();
    };

    return (
        <LayoutGame score1={score1} score2={score2}>
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-4xl font-bold text-center mb-4">Breakout</h1>
            <canvas
            ref={canvasRef}
            width="300"
            height="500"
            className="border mb-4"
            />
            {!gameStarted && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center text-black">
                <Button onClick={handleStartGame}>Commencer</Button>
                </div>
            </div>
            )}
            {gameOver && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center text-black">
                <h2 className="text-3xl font-bold mb-4">Game Over !</h2>
                <p className="text-xl mb-4">
                    {winner === "Player 1"
                    ? "Vous avez gagné"
                    : "Vous avez perdu, Joueur 2 gagne"}
                </p>
                <Button onClick={handleRestartGame}>Rejouer</Button>
                </div>
            </div>
            )}
            {isMobile && (
            <div className="w-full flex justify-center">
                <Button className="mr-2" onClick={() => handlePaddleMove("left")}>Gauche</Button>
                <Button onClick={() => handlePaddleMove("right")}>Droite</Button>
            </div>
            )}
            <div className="border-t mt-4 w-full">
            <ScrollArea className="h-32 p-4">
                <div ref={chatEndRef} />
            </ScrollArea>
            </div>
        </div>
        </LayoutGame>
    );
};

export default BreakoutRoom;
