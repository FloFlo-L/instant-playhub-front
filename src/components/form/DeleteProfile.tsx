import { useState } from 'react';
import axios from 'axios';
import { useAuth } from "@/provider/authProvider";
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const DeleteProfile = () => {
    const { setToken } = useAuth();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsSubmitting(true);
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/user/delete`
            );
            toast({ title: "Account deleted successfully!" });
            setToken(null);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to delete account " + (error.response?.data?.error || error.message),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive">Supprimer mon compte</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Es-tu sûr de vouloir supprimer ton compte ?</DialogTitle>
                        <DialogDescription>Cette action peut toujours être annulée. Nous ne voulons pas te voir partir.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='mt-6'>
                        <Button onClick={() => setOpen(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Supression...
                                </>
                            ) : (
                                "Supprimer mon compte"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteProfile;
