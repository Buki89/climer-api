import { Io, ISocket } from "../../global-types";
import { redisClient } from "../redis";
import { getOnlinePlayer } from "../utils/getOnlinePlayers";

export const joinRoom = (io: Io, socket: ISocket) => async (roomId: string) => {
  console.log("roomId", roomId);
  socket.join(roomId);
  socket.broadcast.emit("refresh");

  await redisClient.hset(`userid:${socket.user.username}`, "room", roomId);

  const players = await getOnlinePlayer(roomId);
  socket.broadcast.emit("get_players_in_same_room", players);

  io.to(roomId).emit("a_new_user_has_joined_the_room");
};
