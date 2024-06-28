import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/provider/authProvider"
import axios from 'axios';

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required",
    }).email({
        message: "Email is not valid",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    })
})

export default function LoginForm() {
    const navigate = useNavigate();
    const { setToken } = useAuth();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(import.meta.env)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, values);

            if (response.status === 200) {
                setToken(response.data.access_token);
                navigate("/")
            } else {
                console.error("Erreur lors de la connexion :", response.data);
            }
        } catch (error) {
            console.error("Erreur lors de la requête de connexion :", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                                <Input placeholder="myemail@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FormLabel>Password *</FormLabel>
                                <Link
                                    to="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">Se connecter</Button>
                <div className="mt-6 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    )
}