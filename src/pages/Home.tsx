import Layout from '@/components/layout/main/LayoutMain';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCheck, FaUsers, FaChild, FaCrown, FaComments, FaDollarSign } from 'react-icons/fa';

const games = [
    {
        title: 'Morpion',
        path: '/rooms/morpion',
        enabled: true,
        image: 'https://img.freepik.com/vecteurs-premium/jeu-morpion-croix-cercle-mini-jeu-illustration-vectorielle_199784-546.jpg'
    },
    { 
        title: 'Uno', 
        path: '/rooms/uno', 
        enabled: false, 
        image: 'https://cdn2.unrealengine.com/Diesel%2Fproductv2%2Funo%2Fhome%2FGameName_Store_Landscape_2560x1440-2560x1440-5195e8a3e06d672f97a1ee49ecea59027c14cae4.jpg' 
    },
    { 
        title: 'Casse-briques',  
        path: '/rooms/breakout',
        enabled: true, 
        image: 'https://www.coolmathgames.com/sites/default/files/styles/mobile_game_image/public/Breakout_OG-logo.jpg?itok=5U0h7bVj' 
    },
    { 
        title: 'Puisance 4', 
        path: '/rooms/puissance-quatre', 
        enabled: false, 
        image: 'https://store-images.s-microsoft.com/image/apps.41929.13910108538401625.dfad4587-dfb3-4aa4-8bed-b5d2dd8fc79f.54781100-f7e4-4c22-89bf-257118f9ac23?mode=scale&q=90&h=1080&w=1920' 
    },
];

const Home = () => {
    return (
        <Layout>
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold mb-4">PlayHub</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {games.map((game) => (
                        <div key={game.title} className="max-w-xs mx-auto w-full">
                            {game.enabled ? (
                                <Link to={game.path}>
                                    <Card className="transform transition-transform hover:scale-105">
                                        <div className="w-full h-32 overflow-hidden rounded-t-md">
                                            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                                        </div>
                                        <CardHeader className="flex justify-center items-center h-16">
                                            <CardTitle className="text-xl text-center">{game.title}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ) : (
                                <Card className="opacity-50 cursor-not-allowed">
                                    <div className="w-full h-32 overflow-hidden rounded-t-md">
                                        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                                    </div>
                                    <CardHeader className="flex justify-center items-center h-16">
                                        <CardTitle className="text-xl text-center">{game.title}</CardTitle>
                                    </CardHeader>
                                </Card>
                            )}
                        </div>
                    ))}
                </div>
                <section className="mt-16 text-center">
                    <h2 className="text-3xl font-bold mb-4">A unique gaming platform</h2>
                    <div className="flex justify-center items-center space-x-4">
                        <div className="flex items-center">
                            <FaCheck className="text-primary mr-2" />
                            <p>100% Free</p>
                        </div>
                        <div className="flex items-center">
                            <FaUsers className="text-primary mr-2" />
                            <p>Multiplayer</p>
                        </div>
                        <div className="flex items-center">
                            <FaChild className="text-primary mr-2" />
                            <p>Child friendly</p>
                        </div>
                    </div>
                </section>
                <section className="mt-8 text-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4">
                            <FaCrown size={40} className="mb-2 text-primary mx-auto" />
                            <h3 className="text-lg font-bold">Worldwide ranking</h3>
                            <p>Challenge the best players worldwide with our unique daily tournament system and become the Number One! Are you up to the challenge?</p>
                        </div>
                        <div className="p-4">
                            <FaComments size={40} className="mb-2 text-primary mx-auto" />
                            <h3 className="text-lg font-bold">Play with a friend and chat</h3>
                            <p>Play with anyone in the world in real time by sharing a unique link. In one click you'll be connected together.</p>
                        </div>
                        <div className="p-4">
                            <FaDollarSign size={40} className="mb-2 text-primary mx-auto" />
                            <h3 className="text-lg font-bold">Support us</h3>
                            <p>You can support us financially by subscribing to our premium membership.</p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default Home;
