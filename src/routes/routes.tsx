import { createBrowserRouter, RouterProvider } from "react-router-dom"
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "./protectedRoute";
import LogoutPage from "@/pages/LogoutPage";
import ContactUs from "@/pages/ContactUs";
import OurTeam from "@/pages/OurTeam";
import TicTacToe from "@/pages/games/TicTacToe";
import TicTacToeRoom from "@/pages/games/TicTacToeRoom";
import MyProfile from "@/pages/MyProfile";
import Friends from "@/pages/Friends";
import Chat from "@/pages/Chat";
import TermsAndConditions from "@/pages/TermsAndConditions";
import BreakoutRoom from "@/pages/games/BreakoutRoom";
import Room from "@/pages/Room";


const routesPublic = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/register",
        element: <RegistrationPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/contact-us",
        element: <ContactUs />,
    },
    {
        path: "/our-team",
        element: <OurTeam />,
    },
    {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

const routesAuthenticatedOnly = [
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/my-profile",
                element: <MyProfile />,
            },
            {
                path: "/friends",
                element: <Friends />,
            },
            {
                path: "/chat/:id",
                element: <Chat />,
            },
            {
                path: "/morpion",
                element: <TicTacToe />,
            },
            {
                path: "/rooms/:gameType",
                element: <Room />,
            },
            {
                path: "/morpion/:roomId",
                element: <TicTacToeRoom />,
            },
            {
                path: "/breakout/:id",
                element: <BreakoutRoom />,
            },
            {
                path: "/logout",
                element: <LogoutPage />,
            },
        ],
    },
];

const router = createBrowserRouter([
    ...routesPublic,
    ...routesAuthenticatedOnly
]);

export default function Routes() {
    return (
        <RouterProvider router={router} />
    )
}