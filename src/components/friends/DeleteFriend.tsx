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

interface DeleteFriendProps {
    friendId: string;
    friendName: string;
    onFriendDeleted: () => void; // Callback to refresh friend list after deletion
}

const DeleteFriend: React.FC<DeleteFriendProps> = ({ friendId, friendName, onFriendDeleted }) => {
    const { token } = useAuth();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDeleteFriend = async () => {
        setIsSubmitting(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/friend/remove`,
                { friend_id: friendId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast({ title: "Succès", description: `Ami ${friendName} supprimé avec succès !` });
            onFriendDeleted();
            setOpen(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Impossible de supprimer l'ami : ${(error.response?.data?.error || error.message)}`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive">Supprimer cet ami</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Es-tu sûr de vouloir supprimer cet ami ?</DialogTitle>
                        <DialogDescription>Cette action peut toujours être annulée. Nous ne voulons pas que tu perdes ton ami.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='mt-6'>
                        <Button onClick={() => setOpen(false)}>Annuler</Button>
                        <Button variant="destructive" onClick={handleDeleteFriend} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Supression...
                                </>
                            ) : (
                                "Supprimer cet ami"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteFriend;
