import { ISocket } from "../../types";
import { redisClient } from "../redis";

export const leaveRoom = (socket: ISocket) => async (roomId: string) => {
  console.log("roomId - leave", roomId);
  socket.leave(roomId);
  try {
    await redisClient.hset(
      `userid:${socket.data?.user.username}`,
      "room",
      "",
      "ready",
      "0"
    );
    socket.emit("leave_room", true);
    socket.to(roomId).emit("refresh");
  } catch (err) {
    socket.emit("leave_room", false);
  }
};
