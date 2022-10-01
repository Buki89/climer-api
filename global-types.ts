import { Session, SessionData } from "express-session";
import { Server, Socket } from "socket.io";

type Data = any;

export type ISocket = Socket & {
  user: {
    id: string;
    username: string;
  };
};

export interface ServerToClientEvents {
  receive_message: (data: Data) => void;
  receive_state: (data: ClimerState) => void;
  receive_climb: (data: ClimerState) => void;
  receive_members: (clients: string[] | undefined) => void;
  send_rooms: (data: any) => void;
  a_new_user_has_joined_the_room: () => void;
  updated_user_info: (updatedUser: redisUser) => void;
  get_rooms: (rooms: Omit<Room, "locked">[]) => void;
}

export interface ClientToServerEvents {
  join_room: (data: string) => void;
  send_message: (data: Data) => void;
  send_state: (data: ClimerState) => void;
  send_climb: (data: ClimerState) => void;
  send_members: (clients: Set<string> | undefined) => void;
  get_rooms: (id: string) => void;
  enter_room: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

type Position = {
  x: number;
  y: number;
};

export type Room = {
  id: string;
  roomName: string;
  playerCount: number;
  maxPlayers: number;
  locked: boolean;
  password?: string;
};

export type ClimerState = {
  id: string;
  position: Position;
  onMove: boolean;
  score: number;
};

export type Io = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export interface ownSession {
  session: Session & Partial<SessionData>;
  // session: Session & Partial<SessionData> & { username: string };
}

export type redisUser = {
  userid: string;
  connected: string;
  username: string;
  room?: string;
  ready?: string;
};

export type redisRoom = {
  id: string;
  roomName: string;
  password?: string;
  maxPlayers: number;
  admin: string;
};
