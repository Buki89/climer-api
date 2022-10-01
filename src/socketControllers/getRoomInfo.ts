import { ISocket } from "../../global-types";
import { redisClient } from "../redis";

export const getRoomInfo = (socket: ISocket) => async (roomId: string) => {
  const room = await redisClient.hgetall(`room:${roomId}`);

  socket.emit("get_room_info", room);
};
