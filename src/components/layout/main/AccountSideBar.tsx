import { useAuth } from "@/provider/authProvider";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MdLogin, MdLogout } from "react-icons/md";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUser } from "react-icons/fa";

interface AvatarSidebarProps {
    isCollapsed: boolean;
}

const AvatarSideBar = ({ isCollapsed }: AvatarSidebarProps) => {
    const { token } = useAuth();

    const renderAvatar = () => (
        <Avatar className={`w-11 h-11 ${isCollapsed ? 'm-auto' : ''}`}>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>US</AvatarFallback>
        </Avatar>
    );

    const renderLoginButton = () => (
        <Button className="w-full justify-start gap-2" variant="ghost" asChild>
            <Link to="/login">
                <MdLogin size={20} />Login
            </Link>
        </Button>
    );

    const renderLoginTooltip = () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className="flex">
                    <Button variant="ghost" size="icon" className="m-auto" asChild>
                        <Link to="/login">
                            <MdLogin size={20} />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Login</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <>
            {token ? (
                <div className="w-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className={`flex gap-4 items-center hover:cursor-pointer hover:bg-muted rounded-sm ${isCollapsed ? '' : 'p-2'}`}>
                                {renderAvatar()}
                                {!isCollapsed && (
                                    <p className="font-bold">Username</p>
                                )}
                            </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={`${isCollapsed ? "start" : "center"}`}>
                        <DropdownMenuItem>
                            <Link to="/" className="flex w-full">
                                <FaUser size={18} className="mr-2" /> My Account
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/logout" className="flex w-full">
                                <MdLogout size={18} className="mr-2" /> Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div >
            ) : (
    !isCollapsed ? renderLoginButton() : renderLoginTooltip()
)}
        </>
    );
};

export default AvatarSideBar;
