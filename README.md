<div align="center">

# AggreGator - A RSS service app!
</div>

## What is this?

This is a service app that fetches (scrapes) data from URLs through CLI commands, using Node.js, PostgreSQL and Drizzle. Written in TypeScript using Node.js during the Boot.Dev course Build a Blog Aggregator in Typescript.

## Usage:

With npm, run npm run start [command] [...args].

For example, npm run start login USERNAME will set your username in the app's system.

All commands use a single type:

```
type CommandHandler = (cmdName: string, ...args: string[]) => void;

```
## Available Commands:

* login (Log with a specific username);
* register (Register new username);
* users (Shows registered users);
* agg (Scrape feeds to collect new posts. Use with a interval, like npm run start agg 2m);
* addfeed (Adds new feed to the database);
* feeds (Shows feeds in the database);
* follow (Follow new feed in the database with the current user, like npm run start follow FEEDURL);
* following (Shows feeds followed by current user);
* unfollow (Unfollow a certain feed with the current user)
* browse (Check posts from feeds followed by the user. You can limit the number of showed posts: npm run start browse 5);
* reset (WARNING - This purges the database and should be used only for testing purposes!)

**Please note: more information on the available commands will be added once the app is ready for use**

#Note: Running this app will create a hidden file named .gatorconfig.json in your home directory. This is used to track the username you provide (or change it) and the database URL.
