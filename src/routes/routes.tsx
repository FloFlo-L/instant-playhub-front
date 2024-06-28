import { createBrowserRouter, RouterProvider } from "react-router-dom"
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProtectedRoute } from "./protectedRoute";
import LogoutPage from "@/pages/LogoutPage";
import GamesPage from "@/pages/GamesPage";


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