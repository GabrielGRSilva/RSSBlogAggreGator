import {setUser, readConfig} from './config';
import * as db from "./db/queries/users";
import * as fd from "./db/queries/feed";
import {fetchFeed} from "./fetcher";
import {User, CommandHandler, UserCommandHandler} from "./commandsignatures"

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

export async function handlerAddFeed(_cmdName: string, user: User, ...args: string[]): Promise<void>{ //Creates a new feed connected to the currentUser
    if(args.length<2){
        throw new Error("Not enough arguments given! Feed needs a name and url!\nExample:\n 'addfeed Hacker News RSS' https://hnrss.org/newest");
    };

    const feedName = args[0];
    const url = args[1];

    try{
        
        const newFeed = await fd.createFeed(feedName, url, user.id);
        const newFollowRecord = await fd.follow(url);
        if(newFeed && newFollowRecord){

        console.log(`${feedName} created successfully for ${user.name}!`);

            }else{//If newFeed or newFollowRecord is undefined
                throw new Error("Error in creating new feed!"); 
                };

    }catch(err){
        console.log(err);
        process.exit(1);
    };
};

export async function handlerUnfollowFeed(_cmdName: string, user: User, ...args: string[]): Promise<void>{

    if(args.length<1){
        throw new Error("Not enough arguments given! You need to provide the url for the feed you want to unfollow!\nExample:\n deletefeed 'https://hnrss.org/newest'");
    };

    try{
        await fd.unfollow(user.name, args[0]);
    }catch(err){
        console.log(err);
    };  
};

export async function handlerFeeds(_cmdName: string, ..._args: string[]): Promise<void>{
    try{
    const feedsInfo = await fd.getFeeds();

    if(feedsInfo != undefined){

        for(let feed of feedsInfo){
            let feedCreator = await db.getUserById(feed.eachId);

            if(feedCreator){//If feedCreator isn't undefined, print the info from this feed
            console.log(`Feed: ${feed.eachName}`);
            console.log(`URL: ${feed.eachUrl}`);
            console.log(`Creator: ${feedCreator.name}\n`);
            };
        };

    }else{
        console.log("No users found in the database!");
    };
    }catch(err){
        console.log(err);
    };
};

export async function handlerFollow(_cmdName: string, _user: User, ...args: string[]): Promise<void>{
    if (args.length < 1){
        throw new Error("You must provide the URL for the feed you want to follow!");
    };

    await fd.follow(args[0]);
};

export async function handlerFollowing(_cmdName: string, user: User, ..._args: string[]): Promise<void>{ //Prints feeds followed by current user
    const followedFeeds = await fd.getFeedFollowsForUser(user.name);

    if(followedFeeds && followedFeeds.length > 0){
        console.log(`Feeds followed by ${user.name}:\n`);
        for(let feed of followedFeeds){
            console.log(`${feed.feedName}`);
            };
    }else if(followedFeeds != undefined && followedFeeds.length === 1){
        console.log(`Feed followed by ${user.name}:\n ${followedFeeds}`);
    }else{
        console.log(`User ${user.name} isn't following any feeds!`);
    };
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

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void>{
    const data = await fetchFeed("https://www.wagslane.dev/index.xml") //DEBUG -> Test feed! Remove in final version

    console.log(JSON.stringify(data));
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

