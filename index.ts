import cors from "cors";
import express from "express";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./global-types";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import { authorizeUser } from "./src/controllers/authorizeUser";
import { initializeUser } from "./src/controllers/initializeUser";
import { onDisconnect } from "./src/controllers/onDisconnect";
import {
  corsConfig,
  sessionMiddleware,
} from "./src/controllers/serverController";
import { router as authRouter } from "./src/routers/authRouter";
import { addRoom } from "./src/socketControllers/addRoom";
import { changeReadyStatus } from "./src/socketControllers/changeReadyStatus";
import { getRoomInfo } from "./src/socketControllers/getRoomInfo";
import { joinRoom } from "./src/socketControllers/joinRoom";
import { leaveRoom } from "./src/socketControllers/leaveRoom";
import { getOnlinePlayer } from "./src/utils/getOnlinePlayers";
import { getRooms } from "./src/utils/getRooms";

const app = express();

const server = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: corsConfig,
});

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);

app.use("/auth", authRouter);
app.set("trust proxy", 1);

const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware as any));
io.use(authorizeUser);
io.on("connect", async (socket: any) => {
  initializeUser(socket);
  console.log("player connected", socket.user.username);
  const onlineUsers = await getOnlinePlayer();

  socket.broadcast.emit("get_players", onlineUsers);

  socket.on("get_players", async () => {
    const onlineUsers = await getOnlinePlayer();

    socket.emit("get_players", onlineUsers);
  });

  socket.on("add_room", addRoom(io, socket));

  socket.on("change_ready_status", changeReadyStatus(io));

  socket.on("get_rooms", async () => {
    const rooms = await getRooms(io);

    socket.emit("get_rooms", rooms);
  });

  socket.on("join_room", joinRoom(io, socket));

  socket.on("leave_room", leaveRoom(io, socket));

  socket.on("get_players_in_same_room", async (roomId: string) => {
    const players = await getOnlinePlayer(roomId);
    socket.emit("get_players_in_same_room", players);
  });

  socket.on("get_room_info", getRoomInfo(socket));

  socket.on("disconnect", async () => {
    console.log("disconnect", socket.user.username);
    onDisconnect(socket);

    const onlineUsers = await getOnlinePlayer();
    socket.broadcast.emit("get_players", onlineUsers);
    socket.broadcast.emit("refresh");
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("process.env.PORT", process.env.PORT);
  console.log("The application is listening on port 4000!");
});
