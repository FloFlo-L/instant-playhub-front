import Layout from '@/components/layout/main/LayoutMain';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCheck, FaUsers, FaChild, FaCrown, FaComments, FaDollarSign } from 'react-icons/fa';
import Logo from "../../public/vite.svg";
import Lottie from 'lottie-react';
import backgroundLottie from "@/assets/background.json";

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
        enabled: false,
        image: 'https://www.coolmathgames.com/sites/default/files/styles/mobile_game_image/public/Breakout_OG-logo.jpg?itok=5U0h7bVj' 
    },
    { 
        title: 'Puissance 4', 
        path: '/rooms/puissance-quatre', 
        enabled: false,
        image: 'https://store-images.s-microsoft.com/image/apps.41929.13910108538401625.dfad4587-dfb3-4aa4-8bed-b5d2dd8fc79f.54781100-f7e4-4c22-89bf-257118f9ac23?mode=scale&q=90&h=1080&w=1920' 
    },
];

const Home = () => {
    return (
        <Layout>
            <div className="relative">
                <div className="container mx-auto py-12 relative z-10">
                    <div className="relative flex gap-3 items-center justify-center mb-24">
                        <div className="absolute top-[-180px] right-0 left-16 md:left-32 z-0">
                            <Lottie animationData={backgroundLottie} loop={true} className='rotate-90 w-full h-[400px]'/>
                        </div>
                        <img src={Logo} className="relative z-10" />
                        <h1 className="relative z-10 text-3xl md:text-5xl font-bold mb-4">PlayHub</h1>
                    </div>
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
                        <h2 className="text-3xl font-bold mb-4">Une plateforme de jeu unique</h2>
                        <div className="flex justify-center items-center space-x-4">
                            <div className="flex items-center">
                                <FaCheck className="text-primary mr-2" />
                                <p>100% Gratuite</p>
                            </div>
                            <div className="flex items-center">
                                <FaUsers className="text-primary mr-2" />
                                <p>Multijoueurs</p>
                            </div>
                            <div className="flex items-center">
                                <FaChild className="text-primary mr-2" />
                                <p>Adapté à tout le monde</p>
                            </div>
                        </div>
                    </section>
                    <section className="mt-8 text-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4">
                                <FaCrown size={40} className="mb-2 text-primary mx-auto" />
                                <h3 className="text-lg font-bold">Classement mondial</h3>
                                <p>Défiez les meilleurs joueurs du monde grâce à notre système unique de tournois quotidiens et devenez le numéro un ! Êtes-vous prêt à relever le défi ?</p>
                            </div>
                            <div className="p-4">
                                <FaComments size={40} className="mb-2 text-primary mx-auto" />
                                <h3 className="text-lg font-bold">Jouez avec un ami et discutez</h3>
                                <p>Jouez avec n'importe qui dans le monde en temps réel en partageant un lien unique. En un clic, vous serez connectés ensemble.</p>
                            </div>
                            <div className="p-4">
                                <FaDollarSign size={40} className="mb-2 text-primary mx-auto" />
                                <h3 className="text-lg font-bold">Soutenez-nous</h3>
                                <p>Vous pouvez nous soutenir financièrement en faisant des dons.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}

export default Home;
