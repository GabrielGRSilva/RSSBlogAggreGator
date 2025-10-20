import {readConfig} from './config';
import {getUserByName} from './db/queries/users'

export type User = {
  id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
};

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>; //Signature for commands requiring user login

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type middlewareLogged = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler) {

 return async (cmdName: string, ...args: string[]) => {
    const userName = readConfig().currentUserName;
    if (!userName) throw new Error("No user logged in");

    const user = await getUserByName(userName);
    if (!user) throw new Error(`User ${userName} not found`);

    return handler(cmdName, user, ...args);
  };
};