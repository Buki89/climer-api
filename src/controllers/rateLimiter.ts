import { NextFunction, Request, Response } from "express";
import { RedisKey } from "ioredis";
import { redisClient } from "../redis";

export const rateLimiter =
  (secondsLimit: number = 60, limitAmount: number = 10) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const ip =
      (req.headers["x-forwarded-for"] as RedisKey) ||
      (req.socket.remoteAddress as RedisKey);
    const response = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();

    if (response && (response[0][1] as number) > limitAmount)
      res.json({
        loggedIn: false,
        status: "Slow down!! Try again in a minute.",
      });
    else next();
  };
