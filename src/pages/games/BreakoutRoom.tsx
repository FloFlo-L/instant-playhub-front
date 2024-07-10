import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import LayoutGame from "@/components/layout/game/LayoutGame";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMediaQuery from "@/hooks/useMediaQuery";
import axios from "axios";

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
    const isMobile = useMediaQuery("(max-width: 768px)");
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
    const [winner, setWinner] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [player2Joined, setPlayer2Joined] = useState(false);

    const [userId, setUserId] = useState("");
    const [players, setPlayers] = useState({
        player1: { username: "Player 1", avatarUrl: "url1", score: 0 },
        player2: { username: "Player 2", avatarUrl: "url2", score: 0 },
    });

    const [messages, setMessages] = useState<
        { text: string; isOwnMessage: boolean }[]
    >([]);
    const [messageInput, setMessageInput] = useState("");

    const handleSendMessage = (message: string) => {
        const newMessage = { text: message, isOwnMessage: true };
        setMessages([...messages, newMessage]);
        setMessageInput("");
        socket.emit("send_message", { room: roomId, message });
    };

    useEffect(() => {
        const fetchPlayerData = async () => {
        try {
            const response1 = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/info`
            );
            console.log("-----response1", response1);

            setPlayers((prevPlayers) => ({
            ...prevPlayers,
            player1: {
                username: response1.data.username,
                avatarUrl: response1.data.profile_picture,
                score: 0,
            },
            }));

            setUserId(response1.data._id);

            const response2 = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/info`
            );
            setPlayers((prevPlayers) => ({
            ...prevPlayers,
            player2: {
                username: response2.data.username,
                avatarUrl: response2.data.profile_picture,
                score: 0,
            },
            }));
        } catch (error) {
            console.error("Error fetching player data:", error);
        }
        };

    fetchPlayerData();

    console.log("Connecting to socket...");
    socket.emit("join_room", { room: roomId, user_id: userId });

    console.log("--------ICI---------", socket);

    socket.on("room_joined", ({ room }) => {
      alert(`Joined room ${room}`);
      setPlayer2Joined(true);
    });

    socket.on("update_state", ({ ball, paddle1, paddle2, score1, score2 }) => {
        setBall(ball);
        setPaddle1(paddle1);
        setPaddle2(paddle2);
        setScore1(score1);
        setScore2(score2);
        setPlayers((prevPlayers) => ({
            ...prevPlayers,
            player1: { ...prevPlayers.player1, score: score1 },
            player2: { ...prevPlayers.player2, score: score2 },
        }));
    });

    socket.on("message_received", ({ message, isOwnMessage }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isOwnMessage },
      ]);
    });

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

    const moveBall = () => {
        let newX = ball.x + ball.dx;
        let newY = ball.y + ball.dy;

        if (
            newX + ball.radius > (canvas?.width || 300) ||
            newX - ball.radius < 0
        ) {
            ball.dx = -ball.dx;
        }

        if (newY - ball.radius < 0) {
            setScore1((prevScore) => prevScore + 1);
            resetBall();
            return;
        }

        if (newY + ball.radius > (canvas?.height || 500)) {
            setScore2((prevScore) => prevScore + 1);
            resetBall();
            return;
        }

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

        setBall({ ...ball, x: newX, y: newY });
    };

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

    if (score1 === 10 || score2 === 10) {
        setGameOver(true);
        setWinner(score1 === 10 ? "Player 1" : "Player 2");
        setGameStarted(false);
    }

    return () => {
        socket.off("room_joined");
        socket.off("update_state");
        socket.off("message_received");
        if (!isMobile) {
            window.removeEventListener("keydown", handleKeyDown);
        }
        clearInterval(interval);
    };
    }, [
        ball,
        paddle1,
        paddle2,
        gameOver,
        player2Joined,
        roomId,
        score1,
        score2,
        isMobile,
        gameStarted,
    ]
    );

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
    socket.emit("make_move", { room: roomId, player: "player1", direction });
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setWinner("");
    resetBall();
    socket.emit("start_game", { room: roomId });
  };

  const handleRestartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setWinner("");
    setScore1(0);
    setScore2(0);
    resetBall();
    socket.emit("start_game", { room: roomId });
  };

  return (
    <LayoutGame
      messages={messages}
      onSendMessage={handleSendMessage}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      players={players}
    >
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
            <Button className="mr-2" onClick={() => handlePaddleMove("left")}>
              Gauche
            </Button>
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
