import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { FaComment, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/provider/authProvider";
import { Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteFriend from './DeleteFriend';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Friend {
    _id: string;
    username: string;
    profile_picture: string;
}

interface FriendListProps {
    searchTerm: string;
    friendsList: Friend[];
}

const FriendList = ({ searchTerm, friendsList }: FriendListProps) => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>(friendsList);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/friends-list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFilteredFriends(friendsResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch friends list');
                setLoading(false);
            }
        };

        fetchFriends();
    }, [token]);

    useEffect(() => {
        setFilteredFriends(
            friendsList.filter(friend =>
                friend.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, friendsList]);

    const handleChatClick = async (friendId: string) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat/check_or_create/${friendId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const chatId = response.data.chat_id;
            navigate(`/chat/${chatId}`);
        } catch (error) {
            console.error("Failed to check or create chat", error);
        }
    };

    const handleFriendDeleted = (deletedFriendId: string) => {
        setFilteredFriends(filteredFriends.filter(friend => friend._id !== deletedFriendId));
    };

    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </div>
            ) : error ? (
                <p className="text-destructive">{error}</p>
            ) : (
                <div className="space-y-4">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <Card key={index} className="p-4 flex items-center justify-between bg-card text-card-foreground w-1/2">
                                <div className="flex items-center justify-between w-full">
                                    <div className='flex items-center'>
                                        <Avatar className="w-10 h-10 mr-4">
                                            <AvatarImage src={friend.profile_picture} alt={friend.username} />
                                            <AvatarFallback className='uppercase'>{friend.username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-bold">{friend.username}</p>
                                    </div>

                                    <div className='flex items-center gap-4'>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <FaEllipsisV />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align={`center`}>
                                                            <DropdownMenuItem className='' onClick={() => handleChatClick(friend._id)}>
                                                                <div className='flex gap-2 items-center hover:cursor-pointer text-primary'>
                                                                    <FaComment size={20} />
                                                                    <p>Envoyer MP</p>
                                                                </div>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <DeleteFriend friendId={friend._id} friendName={friend.username} onFriendDeleted={() => handleFriendDeleted(friend._id)} />
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Plus</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground">Tu n'as aucun ami pour le moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FriendList;
