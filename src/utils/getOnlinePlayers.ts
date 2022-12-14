import { redisUser } from "../../global-types";
import { redisClient } from "../redis";

export const getOnlinePlayer = async (roomId?: string) => {
  const usersKeys = await redisClient.keys("userid:*");

  const users = (await Promise.all(
    usersKeys.map(async (user) => {
      return await redisClient.hgetall(user);
    })
  )) as unknown as redisUser[];

  if (roomId) {
    return users.filter(
      (user) => user.room === roomId && user.connected === "1"
    );
  }

  return users.filter((user) => user.connected === "1");
};
