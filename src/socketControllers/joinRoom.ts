import { ISocket } from "../../types";
import { redisClient } from "../redis";
import { getUsersInRoom } from "../utils/getUsersInRoom";

export const joinRoom = (socket: ISocket) => async (roomId: string) => {
  console.log("roomId", roomId);
  socket.join(roomId);
  socket.broadcast.emit("refresh");

  await redisClient.hset(
    `userid:${socket.data.user?.username}`,
    "room",
    roomId
  );

  const players = await getUsersInRoom(roomId);
  socket.to(roomId).emit("players_in_room", players);
};
