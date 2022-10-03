import { Session, SessionData } from "express-session";
import { Server, Socket } from "socket.io";

type UserInfo = {
  user: {
    id: string;
    username: string;
  };
};

export type ISocket = Socket<
  ListeningEvents,
  EmitEvents,
  InterServerEvents,
  SocketData
>;

export interface EmitEvents {
  a_new_user_has_joined_the_room: () => void;
  updated_user_info: (updatedUser: User) => void;
  get_rooms: (rooms: Omit<Room, "locked">[]) => void;
  get_players: (users: User[]) => void;
  refresh: () => void;
  get_room_info: (room: Room) => void;
  players_in_room: (users: User[]) => void;
  leave_room: (done: boolean) => void;
  connect: (socket: ISocket) => Promise<void>;
}

export interface ListeningEvents {
  get_rooms: (id: string) => void;
  enter_room: () => void;
  add_room: (room: Room) => Promise<void>;
  change_ready_status: (username: string) => Promise<void>;
  leave_room: (roomId: string) => Promise<void>;
  players_in_room: (roomId: string) => Promise<void>;
  join_room: (roomId: string) => Promise<void>;
  get_room_info: (roomId: string) => Promise<void>;
  connect: (socket: ISocket) => Promise<void>;
}

export interface InterServerEvents {
  ping: () => void;
}

export type SocketData = {
  name: string;
  age: number;
} & UserInfo;

type Position = {
  x: number;
  y: number;
};

export type ClimerState = {
  id: string;
  position: Position;
  onMove: boolean;
  score: number;
};

export type Io = Server<
  ListeningEvents,
  EmitEvents,
  InterServerEvents,
  SocketData
>;

export interface ownSession {
  session: Session & Partial<SessionData>;
  // session: Session & Partial<SessionData> & { username: string };
}

export type User = {
  userid: string;
  connected: string;
  username: string;
  room?: string;
  ready?: string;
};

export type Room = {
  id: string;
  roomName: string;
  password?: string;
  maxPlayers: number;
  admin: string;
  locked?: boolean;
  gameStarted: boolean;
};
