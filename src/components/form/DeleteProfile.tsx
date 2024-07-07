import React, { useState } from 'react';
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
    const { token, setToken } = useAuth();
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
        } catch (error) {
            console.error("Failed to delete account", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Failed to delete account " + error.response.data.error,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                        <DialogDescription>This action can still be undone. We don't want to see you go 🥲</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='mt-6'>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Account"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteProfile;
