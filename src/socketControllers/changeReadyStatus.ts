import { Io, redisUser } from "../../global-types";
import { redisClient } from "../redis";

export const changeReadyStatus = (io: Io) => async (username: string) => {
  const key = `userid:${username}`;

  const user = await redisClient.hgetall(key);

  await redisClient.hset(key, "ready", user.ready === "1" ? "0" : "1");

  const updatedUser = (await redisClient.hgetall(key)) as redisUser;

  // socket.broadcast.emit("updated_user_info", updatedUser);
  io.to(user.room).emit("updated_user_info", updatedUser);
};
