import { Separator } from "@/components/ui/separator";
import MenuLink from "@/components/menuLink";
import { FaCog, FaComments, FaHashtag, FaHome, FaTrophy, FaUsers } from "react-icons/fa";
import { useAuth } from '@/provider/authProvider';
import AvatarSideBar from "@/components/layout/main/AccountSideBar";

interface SidebarProps {
    isCollapsed: boolean
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
    const { token } = useAuth(); // Use the useAuth hook to get the token

    // Function to generate menu items based on the token
    const getMenuItems = (isAuthenticated: boolean) => {
        const items = [
            {
                title: "Home",
                items: [
                    {
                        title: "Home",
                        path: "/",
                        icon: <FaHome size={20} />
                    },
                ],
            },
            {
                title: "Score",
                items: [
                    {
                        title: "Scores",
                        path: "/scores",
                        icon: <FaTrophy size={20} />
                    },
                ],
            },
            {
                title: "Games",
                items: [
                    {
                        title: "Tic Tac Toe",
                        path: "/tic-tac-toe",
                        icon: <FaHashtag size={20} />
                    },
                    {
                        title: "Uno",
                        path: "/uno",
                        icon: <FaHashtag size={20} />
                    },
                    {
                        title: "Connect Four",
                        path: "/connect-four",
                        icon: <FaHashtag size={20} />
                    },
                    {
                        title: "Breakout",
                        path: "/breakout",
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
                        title: "Friends",
                        path: "/friends",
                        icon: <FaUsers size={20} />
                    },
                    {
                        title: "Chat",
                        path: "/chat",
                        icon: <FaComments size={20} />
                    },
                ],
            });
        }

        return items;
    };

    const menuItems = getMenuItems(Boolean(token));

    return (
        <nav>
            <div className="p-2">
                <AvatarSideBar isCollapsed={isCollapsed} />
            </div>
            {
                menuItems.map((category) => (
                    <div key={category.title}>
                        <Separator />
                        <ul className="flex flex-col gap-6 p-2">
                            <li key={category.title} className="flex flex-col gap-3">
                                {category.items.map((item) => (
                                    <MenuLink key={item.title} item={item} isCollapsed={isCollapsed} />
                                ))}
                            </li>
                        </ul>
                    </div>
                ))
            }
        </nav >
    )
};

export default Sidebar;
