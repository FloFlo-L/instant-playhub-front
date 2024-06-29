import { Button } from "@/components/ui/button";
import { SwitchTheme } from "@/components/switch-theme";
import { Link } from "react-router-dom";

const FooterGame = () => {
    return (
        <footer className="flex gap-4 justify-center p-4 bg-muted text-secondary-foreground border-t">
            <Button asChild>
                <Link to="/tic-tac-toe">Exit Game</Link>
            </Button>
            <SwitchTheme />
        </footer>
    );
};

export default FooterGame;