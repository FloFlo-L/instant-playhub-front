import { createBrowserRouter, RouterProvider } from "react-router-dom"
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "./protectedRoute";
import LogoutPage from "@/pages/LogoutPage";
import GamesPage from "@/pages/GamesPage";
import ContactUs from "@/pages/ContactUs";
import OurTeam from "@/pages/OurTeam";
import TicTacToe from "@/pages/games/TicTacToe";
import TicTacToeRoom from "@/pages/games/TicTacToeRoom";


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
                path: "/games",
                element: <GamesPage />,
            },
            {
                path: "/tic-tac-toe",
                element: <TicTacToe />,
            },
            {
                path: "/tic-tac-toe/:roomId",
                element: <TicTacToeRoom />,
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