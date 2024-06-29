import LoginForm from "@/components/form/LoginForm"
import Layout from '@/components/layout/main/LayoutMain';

export function LoginPage() {
    return (
        <Layout>
            <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
                <div className="flex items-center justify-center py-12 px-4 sm:px-0">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Sign In</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email below to login to your account
                            </p>
                        </div>
                        <LoginForm />
                    </div>
                </div>
                <div className="hidden bg-muted lg:block">
                    {/* <img
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                /> */}
                    <div className="bg-primary h-full w-full flex justify-center items-center">
                        <p className="text-3xl text-secondary">Mettre une image à la place ??!!</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}