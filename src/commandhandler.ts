import {setUser, readConfig} from './config';
import * as db from "./db/queries/users"

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = { //Type to hold available commands
    name: string[],
    handler: Record<string, CommandHandler>
};

export async function handlerLogin(_cmdName: string, ...args: string[]): Promise<void>{
    try{
        if (await db.getUserByName(args[0]) == undefined){
            throw new Error("Failed to login. User wasn't found in the database!");
        };
        }catch(err){
            console.log(err);
            process.exit(1);
        };
    
    if (args.length == 0){
        console.log('You need to login using a username! login [USERNAME]');
        process.exit(1);
    };

    setUser(args[0]); //Sets the username

    console.log(`Username ${args[0]} has been set!`);
};

export async function handlerRegister(_cmdName: string, ...args: string[]): Promise<void>{

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
        console.log(`User ${args[0]} created sucessfully!`)
        
    }catch(err){
        console.log(err);
        process.exit(1);
    };
};

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void>{
                   
    const currentUser = readConfig().currentUserName;

    const usersInfo = await db.getUsers();

    if(usersInfo != undefined){

        for(let {eachName} of usersInfo){
            if(eachName == currentUser){
            console.log(`* ${eachName} (current)`);

            }else{
                console.log(`* ${eachName}`);
            };
        };

    }else{
        console.log("No users found in the database!");
    };
};


export async function handlerReset(_cmdName: string, ...args: string[]): Promise<void>{
    await db.resetDatabase()
};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){ //This function registers a new handler function for a command name.
  
    registry.name.push(cmdName);
    registry.handler[cmdName] = handler;
};

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){ //This function runs a given command with the provided state if it exists.

    for (let cmd of registry.name){
        if (cmdName == cmd){
            await registry.handler[cmdName](cmdName, ...args);
            return;
        };
    };
    console.log('Command not found!');
    process.exit(1);
};