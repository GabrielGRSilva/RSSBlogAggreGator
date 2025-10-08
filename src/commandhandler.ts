import {setUser} from './config.js';

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = { //Type to hold available commands
    name: string[],
    handler: CommandHandler[]
};

export function handlerLogin(cmdName: string, ...args: string[]){
    if (!args || args.length > 1){
        throw new Error('You need to login using a username! login [USERNAME]');
    };

    setUser(args[0]); //Sets the username

    console.log(`Username ${args[0]} has been set!`);
};

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){ //This function registers a new handler function for a command name.
    registry.name.push(cmdName);
    registry.handler.push(handler);
};

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){ //This function runs a given command with the provided state if it exists.
    for (let cmd of registry.name){
        if (cmdName == cmd){
            const foundHandler = registry.handler[registry.name.indexOf(cmd)];

            foundHandler(cmdName, ...args);
            return;
        };
    };
    throw new Error('Command not found!');
};