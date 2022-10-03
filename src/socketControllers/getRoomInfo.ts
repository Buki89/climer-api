import { ISocket, Room } from "../../types";
import { redisClient } from "../redis";

export const getRoomInfo = (socket: ISocket) => async (roomId: string) => {
  const room = (await redisClient.hgetall(`room:${roomId}`)) as unknown as Room;

  socket.emit("get_room_info", room);
};
