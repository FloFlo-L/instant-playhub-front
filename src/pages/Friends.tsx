import { useState, useEffect } from 'react';
import axios from 'axios';
import LayoutMain from "@/components/layout/main/LayoutMain";
import FriendList from '@/components/friends/FriendList';
import AddFriend from '@/components/friends/AddFriend';
import FriendSearch from '@/components/friends/FriendSearch';
import { useAuth } from "@/provider/authProvider";

interface User {
    _id: string;
    username: string;
    profile_picture: string;
}

const Friends = () => {
    const { token } = useAuth();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllUsers(usersResponse.data.users);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch users list');
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, [token]);

    const handleFriendAdded = () => {
        console.log("Friend added");
    };

    return (
        <LayoutMain>
            <div className="container mx-auto py-12 min-h-screen">
                <h1 className='text-3xl font-bold mb-2'>Amis</h1>
                <div className="flex flex-col justify-between mb-4 gap-4 md:flex-row">
                    <FriendSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-destructive">{error}</p>
                    ) : (
                        <AddFriend allUsers={allUsers} onFriendAdded={handleFriendAdded} />
                    )}
                </div>
                <FriendList searchTerm={searchTerm} />
            </div>
        </LayoutMain>
    );
};

export default Friends;
