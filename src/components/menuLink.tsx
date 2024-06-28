import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface MenuLinkProps {
    item: {
        title: string;
        path: string;
        icon: JSX.Element;
    };
    isCollapsed: boolean;
}

const MenuLink = ({ item, isCollapsed }: MenuLinkProps) => {
    const { path, title, icon } = item;
    const location = useLocation();
    const linkIsActive = location.pathname === path;

    return (
        <>
            {isCollapsed ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <RouterLink
                                to={path}
                                className={cn(buttonVariants({ variant: linkIsActive ? "default" : "ghost", size: "icon" }), "m-auto")}
                            >
                                {icon}
                            </RouterLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{title}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                <RouterLink
                    to={path}
                    className={cn(buttonVariants({ variant: linkIsActive ? "default" : "ghost" }), "justify-start gap-2")}
                >
                    {icon} {title}
                </RouterLink>
            )}
        </>
    );
};

export default MenuLink;
