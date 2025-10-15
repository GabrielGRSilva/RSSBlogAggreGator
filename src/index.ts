import * as ch from './commandhandler';
import {checkGatorConfig} from './config';
import { createRegistry } from './commands';
import "dotenv/config";

async function main() {
    checkGatorConfig();

    const registry = createRegistry(); //Sets registry of commands
    const userInputs = process.argv;

    if (userInputs.length < 3){
        console.log("No commands were given!");
        process.exit(1);
    };

    const cmd = userInputs[2];
    const args = userInputs.slice(3)

    await ch.runCommand(registry, cmd, ...args);

    process.exit(0);
};

main();