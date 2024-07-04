import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useAuth } from "@/provider/authProvider";
import axios from 'axios';
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required",
    }).email({
        message: "Email is not valid",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    })
});

export default function LoginForm() {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMessage(null);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, values);

            if (response.status === 200) {
                setToken(response.data.access_token);
                navigate("/");
            } else {
                setErrorMessage("Error during login: " + response.data.message);
            }
        } catch (error) {
            console.error("Request error:", );
            setErrorMessage(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
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
                        "Se connecter"
                    )}
                </Button>
                <div className="mt-6 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline">
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    );
}
