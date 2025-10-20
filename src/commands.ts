import * as ch from './commandhandler';
import {middlewareLoggedIn, UserCommandHandler} from './commandsignatures'

export function createRegistry(): ch.CommandsRegistry {
    const registry: ch.CommandsRegistry = {
        name: [],
        handler: {}
    };

    ch.registerCommand(registry, 'login', ch.handlerLogin);
    ch.registerCommand(registry, 'register', ch.handlerRegister);
    ch.registerCommand(registry, 'reset', ch.handlerReset);
    ch.registerCommand(registry, 'users', ch.handlerUsers);
    ch.registerCommand(registry, 'agg', ch.handlerAgg);
    ch.registerCommand(registry, 'addfeed', middlewareLoggedIn(ch.handlerAddFeed));
    ch.registerCommand(registry, 'feeds', ch.handlerFeeds);
    ch.registerCommand(registry, 'follow', middlewareLoggedIn(ch.handlerFollow));
    ch.registerCommand(registry, 'following', middlewareLoggedIn(ch.handlerFollowing));

    return registry;
};