import { ISocket } from "../../types";
import { getUsersInRoom } from "../utils/getUsersInRoom";

export const onDisconnect = (socket: ISocket) => async () => {
  console.log("disconnect", socket.data.user?.username);
  onDisconnect(socket);

  const onlineUsers = await getUsersInRoom();
  socket.broadcast.emit("get_players", onlineUsers);
  socket.broadcast.emit("refresh");
};
