import { redisClient } from "../redis";

export const onDisconnect = async (socket: any) => {
  await redisClient.hset(`userid:${socket.user.username}`, "connected", 0);
};
