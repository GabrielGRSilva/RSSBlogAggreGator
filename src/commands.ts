import * as ch from './commandhandler';

export function createRegistry(): ch.CommandsRegistry {
    const registry: ch.CommandsRegistry = {
        name: [],
        handler: {}
    };

    ch.registerCommand(registry, 'login', ch.handlerLogin);
    ch.registerCommand(registry, 'register', ch.handlerRegister);
    ch.registerCommand(registry, 'reset', ch.handlerReset);
    ch.registerCommand(registry, 'users', ch.handlerUsers);

    return registry;
};