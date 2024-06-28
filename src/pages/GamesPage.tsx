import { useEffect, useState } from "react";
import axios from "axios";
import { GameInterface } from "@/interfaces/interfaces";


export default function GamesPage() {
    const [games, setGames] = useState<GameInterface[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios.get<{ games: GameInterface[] }>(`${process.env.REACT_APP_API_URL}/api/games`);
                setGames(response.data.games);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des jeux :", error);
                setLoading(false);
            }
        }
        fetchGames();
    }, []);

    return (
        <div>
            <h1 className="text-3xl mb-6">Liste des jeux</h1>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : games.length === 0 ? (
                <p>Aucun jeu trouvé.</p>
            ) : (
                <ul>
                    {games.map(game => (
                        <li className="mb-3" key={game._id}>
                            <h2>{game.title}</h2>
                            <p>Développeur : {game.developer}</p>
                            <p>Genre : {game.genre}</p>
                            <p>Rating : {game.rating}</p>
                            <p>Année de sortie : {game.releaseYear}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
