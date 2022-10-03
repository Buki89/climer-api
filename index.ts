import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import { authorizeUser } from "./src/controllers/authorizeUser";
import { initializeUser } from "./src/controllers/initializeUser";
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
import { onDisconnect } from "./src/socketControllers/onDisconnect";
import { getUsersInRoom } from "./src/utils/getUsersInRoom";
import { getRooms } from "./src/utils/getRooms";
import {
  EmitEvents,
  InterServerEvents,
  ISocket,
  ListeningEvents,
  SocketData,
} from "./types";

const app = express();

const server = http.createServer(app);

const io = new Server<
  ListeningEvents,
  EmitEvents,
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
io.on("connect", async (socket: ISocket) => {
  initializeUser(socket);
  console.log(
    "player connected",
    socket.data.user?.username,
    socket.data.user?.id
  );
  const playersInLobby = await getUsersInRoom("lobby");
  console.log("playersInLobby", playersInLobby);

  socket.broadcast.emit("get_players", playersInLobby);

  socket.on("add_room", addRoom(io, socket));

  socket.on("change_ready_status", changeReadyStatus(io));

  socket.on("get_rooms", async () => {
    const rooms = await getRooms(io);

    socket.emit("get_rooms", rooms);
  });

  socket.on("join_room", joinRoom(socket));

  socket.on("leave_room", leaveRoom(socket));

  socket.on("players_in_room", async (roomId: string) => {
    const players = await getUsersInRoom(roomId);
    socket.emit("players_in_room", players);
  });

  socket.on("get_room_info", getRoomInfo(socket));

  socket.on("disconnect", onDisconnect(socket));
});

server.listen(process.env.PORT || 4000, () => {
  console.log("The application is listening on port 4000!");
});
