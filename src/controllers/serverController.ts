import session from "express-session";
import RedisStore from "connect-redis";
import { NextFunction } from "express";
import { Socket } from "socket.io";
import * as dotenv from "dotenv";
import { redisClient } from "../redis";

dotenv.config();

const redisStore = RedisStore(session);

export const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET as string | string[],
  name: "sid",
  resave: false,
  saveUninitialized: false,
  store: new redisStore({ client: redisClient }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.ENVIRONMENT === "production",
    httpOnly: true,
    sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
  },
});

export const wrap =
  (expressMiddleware: any) => (socket: Socket, next: NextFunction) =>
    expressMiddleware(socket.request, {}, next);

export const corsConfig = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
