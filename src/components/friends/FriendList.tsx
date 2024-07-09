import { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { FaComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/provider/authProvider";

interface Friend {
    _id: string;
    username: string;
    profile_picture: string;
}

interface FriendListProps {
    searchTerm: string;
}

const FriendList = ({ searchTerm }: FriendListProps) => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [friendsList, setFriendsList] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/friends-list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriendsList(friendsResponse.data.Friends);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch friends list');
                setLoading(false);
            }
        };

        fetchFriends();
    }, [token]);

    const filteredFriends = friendsList.filter(friend =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div>
            {loading ? (
                <p>Loading friends...</p>
            ) : error ? (
                <p className="text-destructive">{error}</p>
            ) : (
                <div className="space-y-4">
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend, index) => (
                            <Card key={index} className="p-4 flex items-center justify-between bg-card text-card-foreground">
                                <div className="flex items-center w-full">
                                    <Avatar className="w-10 h-10 mr-4">
                                        <AvatarImage src={friend.profile_picture} alt={friend.username} />
                                        <AvatarFallback className='uppercase'>{friend.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex w-full justify-between items-center'>
                                        <p className="font-bold">{friend.username}</p>
                                        <FaComment size={20} className='hover:cursor-pointer hover:text-primary' onClick={() => handleChatClick(friend._id)} />
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground">You have no friends at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FriendList;
