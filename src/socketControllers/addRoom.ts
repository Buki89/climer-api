import { getRooms } from "../utils/getRooms";
import { redisClient } from "../redis";
import { Io, ISocket, Room } from "../../types";

export const addRoom = (io: Io, socket: ISocket) => async (room: Room) => {
  const roomId = `room:${room.id}`;

  const expireTime = 60 * 60 * 24;

  await redisClient.hset(
    roomId,
    "roomName",
    room.roomName,
    "id",
    room.id,
    "password",
    room.password || "",
    "maxPlayers",
    room.maxPlayers,
    "admin",
    socket.data.user?.username || "",
    "gameStarted",
    0
  );

  await redisClient.expire(roomId, expireTime);

  const rooms = await getRooms(io);

  socket.broadcast.emit("get_rooms", rooms);
};
