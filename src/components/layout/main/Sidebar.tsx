import { Separator } from "@/components/ui/separator";
import { FaComments, FaHashtag, FaHome, FaTrophy, FaUsers } from "react-icons/fa";
import { useAuth } from '@/provider/authProvider';
import AvatarSideBar from "@/components/layout/main/AccountSideBar";
import { Link, useLocation } from "react-router-dom";
import { PanelLeftIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SwitchTheme } from "@/components/switch-theme";
import { cn } from "@/lib/utils";
import Logo from "../../../../public/vite.svg";

const Sidebar = () => {
    const { token } = useAuth(); // Use the useAuth hook to get the token
    const location = useLocation();

    // Function to generate menu items based on the token
    const getMenuItems = (isAuthenticated: boolean) => {
        const items = [
            {
                items: [
                    {
                        title: "Accueil",
                        path: "/",
                        icon: <FaHome size={20} />
                    },
                ],
            },
            {
                items: [
                    {
                        title: "Scores",
                        path: "/scores",
                        icon: <FaTrophy size={20} />
                    },
                ],
            },
            {
                title: "Jeux",
                items: [
                    {
                        title: "Morpion",
                        path: "/rooms/morpion",
                        icon: <FaHashtag size={20} />
                    },
                    {
                        title: "Uno",
                        path: "/rooms/uno",
                        icon: <FaHashtag size={20} />
                    },
                    {
                        title: "Puissance 4",
                        path: "/rooms/puissance-quatre",
                        icon: <FaHashtag size={20} />
                    },
                    {
                        title: "Casse-briques",
                        path: "/rooms/breakout",
                        icon: <FaHashtag size={20} />
                    },
                ],
            },
        ];

        if (isAuthenticated) {
            items.splice(1, 0, {
                title: "User",
                items: [
                    {
                        title: "Amis",
                        path: "/friends",
                        icon: <FaUsers size={20} />
                    },
                    {
                        title: "Messages",
                        path: "/chat/0",
                        icon: <FaComments size={20} />
                    },
                ],
            });
        }

        return items;
    };

    const menuItems = getMenuItems(Boolean(token));

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <div className="px-2 sm:py-4 flex justify-center">
                    <AvatarSideBar />
                </div>
                {menuItems.map((category, index) => (
                    <div key={index}>
                        <Separator />
                        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                            {category.items.map((item, index) => (
                                <TooltipProvider key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                to={item.path}
                                                className={cn(buttonVariants({ variant: location.pathname === item.path ? "default" : "ghost", size: "icon" }), "m-auto")}
                                            >
                                                {item.icon}
                                                <span className="sr-only">{item.title}</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">{item.title}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </nav>
                    </div>
                ))}
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <SwitchTheme />
                </nav>
            </aside>
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between sm:hidden border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <PanelLeftIcon className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="flex flex-col justify-between h-full text-lg font-medium">
                            <div>
                                <div className="flex gap-2 items-center mb-4">
                                    <img src={Logo} alt="Logo" className="w-12 pl-2.5" />
                                    <p>PlayHub</p>
                                </div>
                                {menuItems.map((category, index) => (
                                    <div key={index}>
                                        {category.items.map((item, index) => (
                                            <Link
                                                key={index}
                                                to={item.path}
                                                className={`flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground ${location.pathname === item.path ? 'text-primary' : ''}`}

                                            >
                                                {item.icon}
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <SwitchTheme />
                        </nav>
                    </SheetContent>
                </Sheet>
                <AvatarSideBar />
            </header>
        </>
    )
};

export default Sidebar;
