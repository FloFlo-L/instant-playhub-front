import { Input } from "@/components/ui/input";
import { FaTimes, FaSearch } from 'react-icons/fa';

interface FriendSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const FriendSearch = ({ searchTerm, setSearchTerm }: FriendSearchProps) => {
    const clearSearch = () => {
        setSearchTerm("");
    };

    return (
        <div className='relative w-2/4'>
            <Input
                className="w-full pr-10"
                placeholder="Search friends..."
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
    );
};

export default FriendSearch;
