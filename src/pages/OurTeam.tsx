import Layout from '@/components/layout/main/LayoutMain';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TeamAvatar from "@/assets/team-avatar.jpg"; // Importing the image as a URL

// Define the Team Member Interface
interface TeamMember {
    name: string;
    role: string;
    description: string;
    avatarUrl?: string; // Optional field for the avatar URL
}

// Create the Team Data
const teamMembers: TeamMember[] = [
    {
        name: "Steven",
        role: "Project Manager, Back End Developer",
        description: "Steven is the project manager and a backend developer.",
        avatarUrl: TeamAvatar,
    },
    {
        name: "Nicolas",
        role: "Back End Developer",
        description: "Nicolas is a backend developer specializing in database management and server-side logic.",
        avatarUrl: TeamAvatar,
    },
    {
        name: "Lisa",
        role: "Front End Developer",
        description: "Lisa is a front-end developer with a keen eye for design and user experience.",
        avatarUrl: TeamAvatar,
    },
    {
        name: "Florian",
        role: "Front End Developer",
        description: "Florian is a front-end developer who loves working with the latest web technologies.",
        avatarUrl: TeamAvatar,
    },
];

const OurTeam = () => {
    return (
        <Layout>
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold text-center mb-8">Our Team</h1>
                <p className="text-center mb-12">
                    Our team is composed of four dedicated individuals who strive to provide you with the best gaming experience on our site. We put everything in place to ensure you enjoy your time here.
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
