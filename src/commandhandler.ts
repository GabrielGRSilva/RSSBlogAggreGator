import {setUser} from './config.js';
import * as db from "./db/queries/users.js"

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = { //Type to hold available commands
    name: string[],
    handler: Record<string, CommandHandler>
};

export async function handlerLogin(_cmdName: string, ...args: string[]): Promise<void>{
    if (args.length == 0){
        console.log('You need to login using a username! login [USERNAME]');
        process.exit(1);
    };

    setUser(args[0]); //Sets the username

    console.log(`Username ${args[0]} has been set!`);
};

export async function handlerUser(_cmdName: string, ...args: string[]): Promise<void>{

    if (args.length == 0){
        console.log('No username has been given! register [USERNAME]');
        process.exit(1);
    };

    try{
        if (await db.getUserByName(args[0]) != undefined){
            throw new Error("Failed to create user. Maybe it already exists in the database?");
        };
        await db.createUser(args[0]);
        setUser(args[0]); //set user in the config file
    }catch(err){
        console.log(err);
        process.exit(1);
    };

    console.log(`User ${args[0]} sucessfully created!`);
    console.log(`DEBUG ${args[0]} data:\n`);
    console.log(`DEBUG ${db.getUserByName(args[0])}`);

};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){ //This function registers a new handler function for a command name.
    registry.name.push(cmdName);
    registry.handler[cmdName] = handler;
};

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){ //This function runs a given command with the provided state if it exists.
    for (let cmd of registry.name){
        if (cmdName == cmd){
            registry.handler[cmdName](cmdName, ...args);
            return;
        };
    };
    console.log('Command not found!');
    process.exit(1);
};