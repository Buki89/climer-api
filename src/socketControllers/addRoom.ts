import { Io, ISocket, redisRoom } from "global-types";
import { getRooms } from "../utils/getRooms";
import { redisClient } from "../redis";

export const addRoom = (io: Io, socket: ISocket) => async (room: redisRoom) => {
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
    socket.user.username
  );

  await redisClient.expire(roomId, expireTime);

  const rooms = await getRooms(io);

  socket.broadcast.emit("get_rooms", rooms);
};
