import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from 'axios';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
        // Password rules: at least 8 characters, an uppercase letter, a number, and a special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        return passwordRegex.test(value);
    }, {
        message: "Password must have at least 8 characters, an uppercase letter, a number and a special character.",
    }),
})

export const RegistrationForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    // Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, values);

            if (response.status === 200) {
                navigate("/login");
            } else {
                setErrorMessage("Error during registration: " + response.data.message);
            }
        } catch (err) {
            console.error("Request error:", err);
            if (err instanceof AxiosError) {
                if (err.response?.data?.error_email) {
                    form.setError('email', { type: 'server', message: err.response.data.error_email });
                }
                setErrorMessage(err.response?.data?.error || err.message);
            } else {
                setErrorMessage(err.message);
            }
        } finally {
            setLoading(false);
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
                            <FormLabel>Username *</FormLabel>
                            <FormControl>
                                <Input placeholder="MyAwesomeUsername" type="text" {...field} />
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
                                <Input placeholder="example@gmail.com" type="email" {...field} />
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
                {errorMessage && (
                    <div className="text-sm font-medium text-destructive">{errorMessage}</div>
                )}
                <Button className="w-full" type="submit" disabled={!form.formState.isValid || loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Create an account"
                    )}
                </Button>
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
