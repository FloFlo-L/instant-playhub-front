import Layout from '@/components/layout/main/LayoutMain';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

// Schéma de validation
const formSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    email: z.string().email({ message: "Adresse e-mail invalide." }),
    phone: z.string().min(10, { message: "Le numéro de téléphone doit contenir au moins 10 chiffres." }),
    message: z.string().min(5, { message: "Le message doit contenir au moins 5 caractères." }),
    agreement: z.literal(true, {
        errorMap: () => ({ message: "Vous devez accepter les termes et conditions." }),
    }),
})

const ContactUs = () => {
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
            agreement: false,
        }
    })

    const onSubmit = () => {
        form.reset();
        toast({
            title: "Succès",
            description: "Votre message a été envoyé.",
        })
    }

    return (
        <Layout>
            <div className="container min-h-screen justify-center">
                <div className="flex items-center justify-center py-12 px-4 sm:px-0">
                    <div className="mx-auto grid w-[700px] gap-6">
                        <div className="">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold">Contactez-nous</h2>
                                <p className="text-muted-foreground">
                                    Veuillez remplir le formulaire ci-dessous et nous vous répondrons dès que possible.
                                </p>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
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
                                                    <Input placeholder="monemail@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Numéro de téléphone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0606060606" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Tapez votre message ici." {...field}/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="agreement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id="agreement"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                        <Label htmlFor="agreement" className="text-sm font-normal">
                                                            J'accepte les{" "}
                                                            <Link to="/" className="underline underline-offset-2">
                                                                termes et conditions
                                                            </Link>
                                                        </Label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Soumettre
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ContactUs