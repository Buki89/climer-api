import "express-session";
import { SessionData } from "express-session";
import { Socket } from "socket.io";
import "socket.io";

type User = {
  username: string;
  id: string;
};

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

declare namespace Socket {
  export interface IncomingMessage {
    user: string;
  }
}

export class MyIncomingMessage extends IncomingMessage {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }
}
