import { redisClient } from "../redis";

export const initializeUser = async (socket: any) => {
  socket.data.user = { ...socket.request.session.user };
  console.log("socket.data?.user", socket.data?.user);
  socket.join(socket.data.user?.id);

  const userKey = `userid:${socket.data?.user.username}`;

  const expireTime = 60 * 60 * 24; // 1 day

  await redisClient.hset(
    userKey,
    "userid",
    socket.data?.user.id,
    "connected",
    1,
    "username",
    socket.data?.user.username
  );
  await redisClient.expire(userKey, expireTime);
};
