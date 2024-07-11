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
    const [friendsList, setFriendsList] = useState<User[]>([]);
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
            } catch (error) {
                setError('Failed to fetch users list');
            } finally {
                setLoading(false);
            }
        };

        fetchAllUsers();
    }, [token]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/friends-list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriendsList(friendsResponse.data.Friends);
            } catch (error) {
                setError('Failed to fetch friends list');
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [token]);

    const handleFriendAdded = (newFriend: User) => {
        setFriendsList((prevFriendsList) => [...prevFriendsList, newFriend]);
        console.log("Friend added:", newFriend);
    };

    return (
        <LayoutMain>
            <div className="container mx-auto py-12 min-h-screen">
                <h1 className='text-3xl font-bold mb-2'>Amis</h1>
                <div className="flex flex-col justify-between mb-4 gap-4 md:flex-row">
                    <FriendSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <AddFriend allUsers={allUsers} onFriendAdded={handleFriendAdded} loading={loading} />
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <FriendList searchTerm={searchTerm} friendsList={friendsList} />
            </div>
        </LayoutMain>
    );
};

export default Friends;
