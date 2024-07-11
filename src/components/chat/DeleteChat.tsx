import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface DeleteChatDialogProps {
    chatId: string | undefined;
    onChatDeleted: () => void;
}

const DeleteChat: React.FC<DeleteChatDialogProps> = ({ chatId, onChatDeleted }) => {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleDeleteChat = async () => {
        console.log(chatId)
        if (!chatId) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "ID de chat invalide.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/chat/delete/${chatId}`);
            toast({
                title: "Chat supprimé",
                description: "Le chat a été supprimé avec succès.",
            });
            setOpen(false);
            onChatDeleted();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de la suppression du chat : "${error.response?.data?.error || error.message}"`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className='hover:cursor-pointer'>
                <FaTimes size={15} />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Es-tu sûr de vouloir supprimer ce chat ?</DialogTitle>
                    <DialogDescription>Cette action peut toujours être annulée. Cette conversation sera également supprimée pour ton ami.</DialogDescription>
                </DialogHeader>
                <DialogFooter className='mt-6'>
                    <Button onClick={() => setOpen(false)}>Annuler</Button>
                    <Button variant="destructive" onClick={handleDeleteChat} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            "Supprimer le chat"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChat;
