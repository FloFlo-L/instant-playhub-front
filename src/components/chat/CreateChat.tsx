import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/provider/authProvider";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigate, useNavigate } from "react-router-dom";

interface User {
    _id: string;
    username: string;
    profile_picture: string;
}

interface CreateChatProps {
    onChatCreated: (newChat: any) => void;
}

const CreateChat: React.FC<CreateChatProps> = ({ onChatCreated }) => {
    const { token, userInfo } = useAuth();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [friendName, setFriendName] = useState("");
    const [friends, setFriends] = useState<User[]>([]);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // État de chargement
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/friends-list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriends(response.data.Friends);
                setLoading(false); // Terminer le chargement après la récupération des amis
            } catch (error) {
                console.error("Failed to fetch friends", error);
                setLoading(false);
            }
        };

        fetchFriends();
    }, [token]);

    useEffect(() => {
        if (friendName.trim() === "") {
            setSearchResults([]);
        } else {
            const results = friends.filter(friend =>
                friend.username.toLowerCase().includes(friendName.toLowerCase())
            );
            setSearchResults(results);
        }
    }, [friendName, friends]);

    const handleSearchChange = (value: string) => {
        setFriendName(value);
        if (value.trim() === "") {
            setSearchResults([]);
            setSelectedFriend(null);
        } else {
            const results = friends.filter(friend =>
                friend.username.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(results);
            const exactMatch = results.find(friend => friend.username === value);
            setSelectedFriend(exactMatch || null);
        }
    };

    const handleSelectFriend = (name: string) => {
        setFriendName(name);
        const exactMatch = friends.find(friend => friend.username === name);
        setSelectedFriend(exactMatch || null);
    };

    const handleCreateChat = async () => {
        if (!selectedFriend) return;

        try {
            const newChat = {
                Users: [selectedFriend._id, userInfo._id]
            };
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat/create`, newChat, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const chatId = response.data.chat_id[0]._id; // Extraction de l'ID du chat
            toast({
                title: "Chat créé",
                description: `Chat créé avec ${selectedFriend.username}`,
            });
            setDialogOpen(false);
            setFriendName("");
            setSelectedFriend(null);

            // Appeler la fonction de rappel pour mettre à jour l'état des conversations
            onChatCreated({ chat_id: chatId, other_user: selectedFriend, created_at: new Date().toISOString() });
            navigate(`/chat/${chatId}`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: `Échec de la création du chat : "${error.response?.data?.error || error.message}"`,
            });
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={loading}>Créer un chat</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Créer un chat</DialogTitle>
                    <DialogDescription>
                        Recherce et ajoute un ami par son pseudo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput
                            placeholder="MonAmi"
                            value={friendName}
                            onValueChange={handleSearchChange}
                            disabled={loading} // Désactiver la saisie pendant le chargement
                        />
                        <CommandList>
                            {loading ? (
                                <CommandEmpty>Chargement...</CommandEmpty>
                            ) : friendName.trim() === "" ? (
                                <CommandEmpty>Tape quelque chose pour rechercher.</CommandEmpty>
                            ) : (
                                searchResults.length > 0 ? (
                                    <CommandGroup heading="Résultats de recherche">
                                        {searchResults.map((result) => (
                                            <CommandItem className='hover:cursor-pointer' key={result._id} onSelect={() => handleSelectFriend(result.username)}>
                                                <Avatar className="w-6 h-6 mr-2">
                                                    <AvatarImage src={result.profile_picture} alt={result.username} />
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
                    <Button onClick={handleCreateChat} disabled={!selectedFriend}>Créer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChat;
