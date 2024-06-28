import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from 'axios';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required",
    }).min(4, {
        message: "Username must be at least 4 characters long",
    }),
    email: z.string().min(1, {
        message: "Email is required",
    }).email({
        message: "Email is not valid",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }).refine(value => {
        // Règles du mot de passe : au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        return passwordRegex.test(value);
    }, {
        message: "Password must have at least 8 characters, an uppercase letter, a number and a special character.",
    }),
})

export const RegistrationForm = () => {
    const {
        setError
    } = useForm();
    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, values);

            if (response.status === 200) {
                navigate("/login");
            } else {
                console.error("Erreur lors de l'inscription :", response.data);
            }
        } catch (err) {
            console.log("oci")
            if (err instanceof AxiosError) {
                console.error("Erreur lors de la requête d'inscription :", err);
                console.log("ici    ")
                if (err.response?.data?.error_email) {
                    console.log('icic');
                    const errorMessage = err.response.data.error_email as string;
                    console.log(errorMessage)
                    form.setError('email', { type: 'server', message: errorMessage });
                }
            }

        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pseudo *</FormLabel>
                            <FormControl>
                                <Input placeholder="MonSuperbePseudo" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                                <Input placeholder="examle@gmail.com" type="email" {...field} />
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
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit">Create an account</Button>
                <div className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    )
}
