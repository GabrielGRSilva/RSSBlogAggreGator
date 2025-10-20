import * as ch from './commandhandler';
import {middlewareLoggedIn, CommandsRegistry} from './commandsignatures'

export function createRegistry(): CommandsRegistry {
    const registry: CommandsRegistry = {
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
    ch.registerCommand(registry, 'unfollow', middlewareLoggedIn(ch.handlerUnfollowFeed));

    return registry;
};