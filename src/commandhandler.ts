import {setUser} from './config.js';

type CommandHandler = (cmdName: string, ...args: string[]) => void;

function handlerLogin(cmdName: string, ...args: string[]) {
    if (!args || args.length > 1){
        throw new Error('You need to login using a username! login [USERNAME]');
    };

    setUser(args[0]); //Sets the username

    console.log(`Username ${args[0]} has been set!`);
};