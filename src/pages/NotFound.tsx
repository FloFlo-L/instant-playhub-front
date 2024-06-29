import Layout from "@/components/layout/main/LayoutMain"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <Layout>
            <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl">Sorry, the page you are looking for does not exist.</p>
                <p className="text-sm mt-6">
                    You can navigate back to our{" "}
                    <Link to="/" className="text-primary hover:underline">
                        Home Page
                    </Link>
                    .
                </p>
            </main>
        </Layout>
    )
}
export default NotFound