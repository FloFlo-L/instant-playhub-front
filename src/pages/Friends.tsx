import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import LayoutMain from "@/components/layout/main/LayoutMain";
import { Card } from "@/components/ui/card";
import { FaComment, FaSearch, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useToast } from '@/components/ui/use-toast';
import { friendsList } from '@/fakeData';

interface Friend {
    id: number;
    name: string;
    avatarUrl: string;
}

const Friends = () => {
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newFriendName, setNewFriendName] = useState("");
    const [searchResults, setSearchResults] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

    const filteredFriends = friendsList.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddFriend = () => {
        setNewFriendName("");
        setDialogOpen(false);
        if (selectedFriend) {
            toast({
                title: "Request sent",
                description: `Friend request sent to ${selectedFriend.name}`,
            });
        }
    };

    const handleSearchChange = (value: string) => {
        setNewFriendName(value);
        if (value.trim() === "") {
            setSearchResults([]);
            setSelectedFriend(null);
        } else {
            const results = friendsList.filter(friend =>
                friend.name.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(results);
            const exactMatch = results.find(friend => friend.name === value);
            setSelectedFriend(exactMatch || null);
        }
    };

    const handleSelectFriend = (name: string) => {
        setNewFriendName(name);
        const exactMatch = friendsList.find(friend => friend.name === name);
        setSelectedFriend(exactMatch || null);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    return (
        <LayoutMain>
            <div className="container mx-auto py-12 min-h-screen">
                <h1 className='text-3xl font-bold mb-2'>Friends</h1>
                <div className="flex items-center justify-between mb-4">
                    <div className='relative w-1/2'>
                        <Input
                            className="w-full pr-10"
                            placeholder="Rechercher des amis"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm ? (
                            <FaTimes
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={clearSearch}
                            />
                        ) : (
                            <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                        )}
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Add Friend</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Friend</DialogTitle>
                                <DialogDescription>
                                    Search and add a friend by their username
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Command className="rounded-lg border shadow-md">
                                    <CommandInput
                                        placeholder="Type a command or search..."
                                        value={newFriendName}
                                        onValueChange={handleSearchChange}
                                    />
                                    <CommandList>
                                        {newFriendName.trim() === "" ? (
                                            <CommandEmpty>Type something to search.</CommandEmpty>
                                        ) : (
                                            searchResults.length > 0 ? (
                                                <CommandGroup heading="Search Results">
                                                    {searchResults.map((result, index) => (
                                                        <CommandItem className='hover:cursor-pointer' key={index} onSelect={() => handleSelectFriend(result.name)}>
                                                            <Avatar className="w-6 h-6 mr-2">
                                                                <AvatarImage src={result.avatarUrl} alt={result.name} />
                                                                <AvatarFallback>{result.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <span>{result.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            ) : (
                                                <CommandEmpty>No results found.</CommandEmpty>
                                            )
                                        )}
                                    </CommandList>
                                </Command>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddFriend} disabled={!selectedFriend}>Envoyer la demande</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="space-y-4">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <Card key={index} className="p-4 flex items-center justify-between bg-card text-card-foreground">
                                <div className="flex items-center w-full">
                                    <Avatar className="w-10 h-10 mr-4">
                                        <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex w-full justify-between items-center'>
                                        <p className="font-bold">{friend.name}</p>
                                        <Link to={`/chat/${friend.id}`} className='hover:cursor-pointer hover:text-primary'>
                                            <FaComment size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground">You have no friends at the moment.</p>
                    )}
                </div>
            </div>
        </LayoutMain>
    );
};

export default Friends;
