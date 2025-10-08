import {setUser} from './config.js';

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = { //Type to hold available commands
    name: string[],
    handler: Record<string, CommandHandler>
};

export function handlerLogin(_cmdName: string, ...args: string[]){
    if (args.length == 0){
        console.log('You need to login using a username! login [USERNAME]');
        process.exit(1);
    };

    setUser(args[0]); //Sets the username

    console.log(`Username ${args[0]} has been set!`);
};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){ //This function registers a new handler function for a command name.
    registry.name.push(cmdName);
    registry.handler[cmdName] = handler;
};

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){ //This function runs a given command with the provided state if it exists.
    for (let cmd of registry.name){
        if (cmdName == cmd){
            registry.handler[cmdName](cmdName, ...args);
            return;
        };
    };
    console.log('Command not found!');
    process.exit(1);
};