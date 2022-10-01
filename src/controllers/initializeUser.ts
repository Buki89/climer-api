import { redisClient } from "../redis";

export const initializeUser = async (socket: any) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.id);

  const userKey = `userid:${socket.user.username}`;

  const expireTime = 60 * 60 * 24; // 1 day

  await redisClient.hset(
    userKey,
    "userid",
    socket.user.id,
    "connected",
    1,
    "username",
    socket.user.username
  );
  await redisClient.expire(userKey, expireTime);
};
