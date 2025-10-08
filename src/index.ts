import {setUser, readConfig} from './config.js';
import * as ch from './commandhandler.js';
import { argv } from 'node:process';

function main() {
    const registry: ch.CommandsRegistry = {
        name: [],
        handler: []
    };

    ch.registerCommand(registry, 'login', ch.handlerLogin);
    const userInputs = process.argv;

    if (userInputs.length < 2){
        console.log("No commands were given!");
        process.exit(1);
    };

    const cmd = userInputs[2];
    const args = userInputs.slice(3)

    ch.runCommand(registry, cmd, ...args);
};

main();