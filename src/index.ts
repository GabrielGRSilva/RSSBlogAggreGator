import * as ch from './commandhandler.js';

function main() {
    const registry: ch.CommandsRegistry = {
        name: [],
        handler: {} as Record<string, ch.CommandHandler>
    };

    ch.registerCommand(registry, 'login', ch.handlerLogin);
    const userInputs = process.argv;

    if (userInputs.length < 3){
        console.log("No commands were given!");
        process.exit(1);
    };

    const cmd = userInputs[2];
    const args = userInputs.slice(3)

    ch.runCommand(registry, cmd, ...args);
};

main();