import Layout from "@/components/layout/main/LayoutMain"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <Layout>
            <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl">Désolé, la page que vous recherchez n'existe pas.</p>
                <p className="text-sm mt-6">
                    Vous pouvez revenir à notre{" "}
                    <Link to="/" className="text-primary hover:underline">
                        page d'accueil
                    </Link>
                    .
                </p>
            </main>
        </Layout>
    )
}
export default NotFound