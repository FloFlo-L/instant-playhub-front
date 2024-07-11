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
import { Link, useLocation } from "react-router-dom";
import { MdLogin, MdLogout } from "react-icons/md";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";

const AvatarSideBar = () => {
    const { token, userInfo, logout } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const renderAvatar = () => (
        <Avatar className={`w-11 h-11 text-xl`}>
            <AvatarImage className='object-cover' src={userInfo?.profile_picture} alt={userInfo?.username} />
            <AvatarFallback className="uppercase">{userInfo?.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
    );

    const renderLoginTooltip = () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild className="flex">
                    <Button variant="ghost" size="icon" className={`${isLoginPage ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`} asChild>
                        <Link to="/login">
                            <MdLogin size={20} />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Se connecter</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <>
            {token ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className={`flex gap-4 items-center hover:cursor-pointer rounded-sm`}>
                                {renderAvatar()}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align={`end`}>
                            <DropdownMenuItem>
                                <Link to="/my-profile" className="flex w-full">
                                    <FaUser size={18} className="mr-2" /> Mon compte
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:cursor-pointer" onClick={logout}>
                                <div className="flex w-full">
                                    <MdLogout size={18} className="mr-2" /> Déconnexion
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
            ) : (
                renderLoginTooltip()
            )}
        </>
    );
};

export default AvatarSideBar;
