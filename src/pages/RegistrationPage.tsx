import { RegistrationForm } from "@/components/form/RegistrationForm";
import Layout from '@/components/layout/main/LayoutMain';
import RoomGaming from "@/assets/room_gaming.jpg";

export function RegistrationPage() {
    return (
        <Layout>
            <div className="w-full lg:grid lg:grid-cols-2 min-h-screen border-b">
                <div className="flex items-center justify-center py-12 px-4 sm:px-0">
                    <div className="mx-auto grid w-[400px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">S'inscrire</h1>
                            <p className="text-balance text-muted-foreground">
                                Entre les informations ci-dessous pour créer un compte
                            </p>
                        </div>
                        <RegistrationForm />
                    </div>
                </div>
                <div className="hidden bg-muted lg:flex items-center p-8">
                    <img src={RoomGaming} alt="room_gaming" className="object-contain w-full rounded-lg" />
                </div>
            </div>
        </Layout>
    );
}
