import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutMain from "@/components/layout/main/LayoutMain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaShareAlt } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/provider/authProvider";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"; // Assurez-vous d'importer correctement les composants Table
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Score = () => {
    const [scores, setScores] = useState([]);
    const [userScores, setUserScores] = useState({});
    const [loading, setLoading] = useState(false); 
    const [userLoading, setUserLoading] = useState(false); 
    const [noScores, setNoScores] = useState(false); 
    const { token, userInfo } = useAuth();
    const [activeTab, setActiveTab] = useState("morpion"); // Nouvel état pour suivre l'onglet actif

    useEffect(() => {
        if (userInfo) {
            fetchUserScores(userInfo._id);
            fetchScores(activeTab); // Charger les scores du premier onglet par défaut
        }
    }, [userInfo, activeTab]);

    const fetchScores = async (gameType) => {
        setLoading(true);
        setNoScores(false);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores/game/${gameType}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const enrichedScores = await Promise.all(response.data.map(async (score) => {
                const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/${score.user_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return {
                    ...score,
                    username: userResponse.data.username,
                    avatarUrl: userResponse.data.profile_picture
                };
            }));
            setScores(enrichedScores);
            setNoScores(enrichedScores.length === 0);
        } catch (error) {
            console.error("Failed to fetch scores", error);
            setNoScores(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserScores = async (userId) => {
        setUserLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const scoresByGame = response.data.reduce((acc, score) => {
                acc[score.game_type] = score;
                return acc;
            }, {});
            setUserScores(scoresByGame);
        } catch (error) {
            console.error("Failed to fetch user scores", error);
        } finally {
            setUserLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchScores(tab);
    };

    return (
        <LayoutMain>
            <div className="container mx-auto py-12 min-h-screen">
                <h1 className="text-3xl mb-6 text-center">Scores</h1>
                <Tabs defaultValue="morpion" className="" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="morpion">Morpion</TabsTrigger>
                        <TabsTrigger value="uno">Uno</TabsTrigger>
                        <TabsTrigger disabled={true} value="breakout">Casse briques</TabsTrigger>
                        <TabsTrigger disabled={true} value="connect-four">Puissance 4</TabsTrigger>
                    </TabsList>
                    <TabsContent value="morpion">
                        <h2 className="text-center text-2xl my-3">Mes scores</h2>
                        {userLoading ? (
                            <div className="flex justify-center items-center w-full">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <>
                                {userScores.morpion ? (
                                    <div className="grid gap-8 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Nombre de Victoire</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.morpion?.wins || 0}</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Nombre d'égalité</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.morpion?.draws || 0}</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Nombre de défaite</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.morpion?.losses || 0}</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Mon score</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.morpion?.score || 0}</p>
                                            </CardContent>
                                            <CardFooter>
                                                <p className="mr-2">Je partage mon score à mes amis</p>
                                                <Button size={"icon"} asChild>
                                                    <Link target="blank" to={`http://twitter.com/share?text=J'ai actuellement ${userScores.morpion?.score} points sur le jeu morpion. Rejoint moi sur &url=http://localhost:5173/&hashtags=instantPlayHub et essaye de me battre`}>
                                                        <FaShareAlt />
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                ) : (
                                    <p className="text-center text-xl my-3">Vous n'avez aucun score associé à ce jeu</p>
                                )}
                            </>
                        )}
                        <h2 className="text-center text-2xl my-3">Scores généraux</h2>
                        {loading ? (
                            <div className="flex justify-center items-center w-full">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            </div>
                        ) : noScores ? (
                            <p className="text-center text-xl my-3">Aucun score général disponible pour ce jeu</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Joueur</TableHead>
                                        <TableHead>Victoires</TableHead>
                                        <TableHead>Égalités</TableHead>
                                        <TableHead>Défaites</TableHead>
                                        <TableHead>Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scores.map((score, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="flex items-center">
                                                <Avatar className="mr-2">
                                                    <AvatarImage src={score.avatarUrl} alt={score.username} />
                                                    <AvatarFallback>{score.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {score.username}
                                            </TableCell>
                                            <TableCell>{score.wins}</TableCell>
                                            <TableCell>{score.draws}</TableCell>
                                            <TableCell>{score.losses}</TableCell>
                                            <TableCell>{score.score}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TabsContent>
                    <TabsContent value="uno">
                        <h2 className="text-center text-2xl my-3">Mes scores</h2>
                        {userLoading ? (
                            <div className="flex justify-center items-center w-full">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <>
                                {userScores.uno ? (
                                    <div className="grid gap-8 w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Nombre de Victoire</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.uno?.wins || 0}</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Nombre d'égalité</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.uno?.draws || 0}</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Nombre de défaite</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.uno?.losses || 0}</p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <CardDescription className="">Mon score</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold">{userScores.uno?.score || 0}</p>
                                            </CardContent>
                                            <CardFooter>
                                                <p className="mr-2">Je partage mon score à mes amis</p>
                                                <Button size={"icon"} asChild>
                                                    <Link target="blank" to={`http://twitter.com/share?text=J'ai actuellement ${userScores.uno?.score} points sur le jeu uno. Rejoint moi sur &url=http://localhost:5173/&hashtags=instantPlayHub et essaye de me battre`}>
                                                        <FaShareAlt />
                                                    </Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                ) : (
                                    <p className="text-center text-xl my-3">Vous n'avez aucun score associé à ce jeu</p>
                                )}
                            </>
                        )}
                        <h2 className="text-center text-2xl my-3">Scores généraux</h2>
                        {loading ? (
                            <div className="flex justify-center items-center w-full">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            </div>
                        ) : noScores ? (
                            <p className="text-center text-xl my-3">Aucun score général disponible pour ce jeu</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Joueur</TableHead>
                                        <TableHead>Victoires</TableHead>
                                        <TableHead>Égalités</TableHead>
                                        <TableHead>Défaites</TableHead>
                                        <TableHead>Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scores.map((score, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="flex items-center">
                                                <Avatar className="mr-2">
                                                    <AvatarImage src={score.avatarUrl} alt={score.username} />
                                                    <AvatarFallback>{score.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {score.username}
                                            </TableCell>
                                            <TableCell>{score.wins}</TableCell>
                                            <TableCell>{score.draws}</TableCell>
                                            <TableCell>{score.losses}</TableCell>
                                            <TableCell>{score.score}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TabsContent>
                    <TabsContent value="breakout">
                        {/* Répétez pour chaque onglet */}
                    </TabsContent>
                    <TabsContent value="connect-four">
                        {/* Répétez pour chaque onglet */}
                    </TabsContent>
                </Tabs>
            </div>
        </LayoutMain>
    );
};

export default Score;
