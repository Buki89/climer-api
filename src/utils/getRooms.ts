import { Io, redisRoom, Room } from "global-types";
import { redisClient } from "../redis";

export const getRooms = async (io: Io): Promise<Omit<Room, "locked">[]> => {
  const roomsKeys = await redisClient.keys("room:*");

  const rooms = await Promise.all(
    roomsKeys.map(async (room) => {
      const clients = io.sockets.adapter.rooms.get(room.slice(5))?.size || 0;

      const result = (await redisClient.hgetall(room)) as unknown as redisRoom;
      return { ...result, playerCount: clients };
    })
  );
  return rooms;
};
