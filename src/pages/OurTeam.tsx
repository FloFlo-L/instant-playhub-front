import Layout from '@/components/layout/main/LayoutMain';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeamAvatar from "@/assets/team-avatar.jpg"; // Importation de l'image en tant qu'URL

// Définir l'interface des membres de l'équipe
interface TeamMember {
    name: string;
    role: string;
    description: string;
    avatarUrl?: string; // Champ optionnel pour l'URL de l'avatar
}

// Créer les données de l'équipe
const teamMembers: TeamMember[] = [
    {
        name: "Steven",
        role: "Développeur Back End",
        description: "Steven est le chef de projet et un développeur back-end.",
        avatarUrl: TeamAvatar,
    },
    {
        name: "Nicolas",
        role: "Développeur Back End",
        description: "Nicolas est un développeur back-end spécialisé dans la gestion des bases de données et la logique côté serveur.",
        avatarUrl: TeamAvatar,
    },
    {
        name: "Lisa",
        role: "Développeuse Front End",
        description: "Lisa est une développeuse front-end avec un sens aigu du design et de l'expérience utilisateur.",
        avatarUrl: TeamAvatar,
    },
    {
        name: "Florian",
        role: "Développeur Front End",
        description: "Florian est un développeur front-end qui aime travailler avec les dernières technologies web.",
        avatarUrl: TeamAvatar,
    },
];

const OurTeam = () => {
    return (
        <Layout>
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold text-center mb-8">Notre Équipe</h1>
                <p className="text-center mb-12">
                    Notre équipe est composée de quatre personnes dévouées qui s'efforcent de vous offrir la meilleure expérience de jeu sur notre site. Nous mettons tout en œuvre pour que vous passiez un bon moment ici.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xxl:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="text-center">
                            <Avatar className="mx-auto mb-4 w-24 h-24">
                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{member.name}</h2>
                            <p className="text-muted-foreground">{member.role}</p>
                            <p className="mt-2">{member.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default OurTeam;
