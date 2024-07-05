import { useAuth } from "@/provider/authProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function LogoutPage() {
    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken();
        navigate("/login", { replace: true });
    };

    useEffect(() => {
        handleLogout();
    }, []);

    return (
        <div>LogoutPage</div>
    );
}
