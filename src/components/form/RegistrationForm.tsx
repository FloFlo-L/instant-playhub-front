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
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, HelpCircle } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Le peusdo est obligatoire",
    }).min(4, {
        message: "Le peudo doit comporter au moins 4 caractères",
    }),
    email: z.string().min(1, {
        message: "L'email est obligatoire",
    }).email({
        message: "L'email n'est pas valide",
    }),
    password: z.string().min(1, {
        message: "Le mot de passe est obligatoire",
    }).refine(value => {
        // Password rules: at least 8 characters, an uppercase letter, a number, and a special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;
        return passwordRegex.test(value);
    }, {
        message: "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial.",
    }),
    terms: z.boolean().refine(value => value === true, {
        message: "Tu dois accepter les termes et conditions pour continuer."
    }),
});

export const RegistrationForm = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            terms: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setErrorMessage(null);
        try {
            const { username, email, password } = values;
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password });

            if (response.status === 200) {
                navigate("/login");
                toast({
                    title: "Succès",
                    description: "Ton compte a été créé. Tu peux te connecter.",
                });
            } else {
                setErrorMessage("Erreur lors de l'inscription : " + response.data.message);
            }
        } catch (err) {
            console.error("Request error:", err);
            if (err instanceof AxiosError) {
                if (err.response?.data?.error_email) {
                    form.setError('email', { type: 'server', message: err.response.data.error_email });
                }
                setErrorMessage(err.response?.data?.error || err.message);
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
                            <FormLabel className="flex items-center">
                                Pseudo
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" className="hover:text-primary">
                                                <HelpCircle className="ml-2 inline" size={18} />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Le pseudo doit comporter au moins 4 caractères.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="MonPseudo" type="text" {...field} />
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
                            <FormLabel>Email</FormLabel>
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
                            <FormLabel className="flex items-center">
                                Mot de passe
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" className="hover:text-primary">
                                                <HelpCircle className="ml-2 inline" size={18} />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, un chiffre et un caractère spécial.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="********" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-y-0 space-x-1">
                            <FormControl>
                                <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="m-0 cursor-pointer">
                                Accepter les{" "}
                                <Link to="/terms-and-conditions" className="hover:text-primary hover:underline">termes et conditions</Link>
                            </FormLabel>
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
                            Chargement
                        </>
                    ) : (
                        "Créer un compte"
                    )}
                </Button>
                <div className="mt-6 text-center text-sm">
                    Tu as déjà un compte ?{" "}
                    <Link to="/login" className="underline">
                        Se connecter
                    </Link>
                </div>
            </form>
        </Form>
    );
};
