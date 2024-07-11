import React, { useEffect, useState } from "react";
import { FaPlus, FaDoorOpen } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Layout from "@/components/layout/main/LayoutMain";
import ScoreGame from "./games/ScoreGame";
import { useAuth } from "@/provider/authProvider";

const socket = io(import.meta.env.VITE_API_URL);

interface Room {
  _id: string;
  room_name: string;
  game_type: string;
  creator_id: string;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userInfo } = useAuth();
  const { gameType } = useParams<{ gameType: string }>();
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchRooms();

    function onUpdateRooms(updatedRooms: Room[]) {
      setRooms(updatedRooms);
    }

    socket.on('room_created', (data: {room: string, creator_id: string, game_type: string}) => {
      console.log(data);
      console.log("JE suis la");
      if (userInfo._id === data.creator_id) {
        console.log("user_id : ", userInfo._id);
        console.log("creator_id : ", data.creator_id);
        toast({
          description: `Room ${data.room} a été crée !`,
        })
        socket.emit("join_room_" + data.game_type,  { room: data.room, user_id: userInfo._id });
      }
    });



    function onRoomJoined({ room }: { room: Room }) {
      toast.success(`Joined room ${room.room_name}`);
      //navigate(`/${gameType}/${room._id}`);
    }

    function onError(error: { message: string }) {
      toast.error(error.message);
    }

    socket.on("update_rooms", onUpdateRooms);
    //socket.on("room_joined", onRoomJoined);
    socket.on("error", onError);

    return () => {
      socket.off("update_rooms", onUpdateRooms);
      socket.off("room_created");
      //socket.off("room_joined", onRoomJoined);
      socket.off("error", onError);
    };
  }, [navigate, gameType]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms?game_type=${gameType}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.rooms) {
        setRooms(response.data.rooms);
      } else {
        setRooms([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch rooms", error);
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() !== "" && userInfo) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/create_room`, {
          room_name: newRoomName,
          game_type: gameType,
          creator_id: userInfo._id
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setNewRoomName("");
        fetchRooms();
      } catch (error: any) {
        console.error("Failed to create room", error);
      }
    }
  };

  const handleJoin = (roomId: string) => {
    if (userInfo) {
      socket.emit("join_room_" + roomId, { room: roomId, user_id: userInfo._id });
    }
  };

  const handleDelete = async (roomName: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/delete_room`, {
        room_name: roomName,
        creator_id: userInfo._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      fetchRooms();
    } catch (error: any) {
      console.error("Failed to delete room", error);
    }
  };

  const filteredRooms = rooms.filter((room) =>
      room.room_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <Layout>
        <div className="container mx-auto py-12 min-h-screen">
          <h1 className="text-4xl font-bold text-center mb-8">{gameType}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col max-h-[750px]">
              <h2 className="text-2xl font-bold mb-4">Create a Room</h2>
              <div className="flex gap-5 items-center mb-8">
                <div className="w-1/2">
                  <Input
                      className="mr-2"
                      placeholder="Enter room name"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateRoom}>
                  <FaPlus className="mr-2" />
                  Create Room
                </Button>
              </div>
              <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
              <Input
                  className="mb-4"
                  placeholder="Search rooms"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ScrollArea className="flex-grow">
                {filteredRooms.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRooms.map((room) => (
                          <div
                              key={room?._id}
                              className="block p-4 border rounded-lg shadow-sm hover:bg-muted transition cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <span>{room?.room_name}</span>
                              <FaDoorOpen onClick={() => handleJoin(room?._id)} />
                              {room?.creator_id === userInfo?._id && (
                                  <Button onClick={() => handleDelete(room?.room_name)}>Delete</Button>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <p className="flex-grow">No rooms found</p>
                )}
              </ScrollArea>
            </div>
            <ScoreGame />
          </div>
        </div>
      </Layout>
  );
};

export default RoomList;
