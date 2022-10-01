import { Io, ISocket } from "../../global-types";
import { redisClient } from "../redis";
import { getOnlinePlayer } from "../utils/getOnlinePlayers";
import { getRooms } from "../utils/getRooms";

export const leaveRoom =
  (io: Io, socket: ISocket) => async (roomId: string) => {
    socket.leave(roomId);
    await redisClient.hset(
      `userid:${socket.user.username}`,
      "room",
      "",
      "ready",
      "0"
    );

    const rooms = await getRooms(io);

    const players = await getOnlinePlayer(roomId);
    socket.broadcast.emit("get_players_in_same_room", players);

    io.emit("get_rooms", rooms);
  };
