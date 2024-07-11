import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useAuth } from "@/provider/authProvider";

interface User {
    _id: string;
    username: string;
    profile_picture: string;
}

interface AddFriendProps {
    allUsers: User[];
    onFriendAdded: (newFriend: User) => void;
    loading: boolean; // Ajoutez le prop loading ici
}

const AddFriend = ({ allUsers, onFriendAdded, loading }: AddFriendProps) => {
    const { token } = useAuth();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newFriendName, setNewFriendName] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

    const handleAddFriend = async () => {
        if (!selectedFriend) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/${selectedFriend._id}/add_friend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast({
                title: "Succès",
                description: `Nouvel ami ajouté : ${selectedFriend.username}`,
            });
            setDialogOpen(false);
            setNewFriendName("");
            setSelectedFriend(null);
            onFriendAdded(selectedFriend); // Passer le nouvel ami ajouté à la fonction de rappel
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de l'ajout d'un nouvel ami : "${error.response?.data?.error || error.message}"`,
            });
        }
    };

    const handleSearchChange = (value: string) => {
        setNewFriendName(value);
        if (value.trim() === "") {
            setSearchResults([]);
            setSelectedFriend(null);
        } else {
            const results = allUsers.filter(user =>
                user.username.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(results);
            const exactMatch = results.find(user => user.username === value);
            setSelectedFriend(exactMatch || null);
        }
    };

    const handleSelectFriend = (name: string) => {
        setNewFriendName(name);
        const exactMatch = allUsers.find(user => user.username === name);
        setSelectedFriend(exactMatch || null);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={loading}>Ajouter un ami</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un ami</DialogTitle>
                    <DialogDescription>
                        Recherce et ajoute un ami par son pseudo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput
                            placeholder="MonAmi"
                            value={newFriendName}
                            onValueChange={handleSearchChange}
                        />
                        <CommandList>
                            {newFriendName.trim() === "" ? (
                                <CommandEmpty>Tape quelque chose pour rechercher.</CommandEmpty>
                            ) : (
                                searchResults.length > 0 ? (
                                    <CommandGroup heading="Search Results">
                                        {searchResults.map((result, index) => (
                                            <CommandItem className='hover:cursor-pointer' key={index} onSelect={() => handleSelectFriend(result.username)}>
                                                <Avatar className="w-6 h-6 mr-2">
                                                    <AvatarImage className='object-cover' src={result.profile_picture} alt={result.username} />
                                                    <AvatarFallback className="uppercase">{result.username.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{result.username}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ) : (
                                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                                )
                            )}
                        </CommandList>
                    </Command>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddFriend} disabled={!selectedFriend}>Ajouter</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriend;
