APP UNDER CONSTRUCTION!

<div align="center">

# AggreGator - A RSS service app!
</div>

## What is this?

This is a service app that fetches data from remote locations through CLI commands, using PostgreSQL and Drizzle. Written in TypeScript using Node.js during the Boot.Dev course Build a Blog Aggregator in Typescript.

## Usage:

With npm, run npm run start [command] [...args].

For example, npm run start login USERNAME will set your username in the app's system.

All commands use a single type:

```
type CommandHandler = (cmdName: string, ...args: string[]) => void;
```

#Note: Running this app will create a hidden file named .gatorconfig.json in your home directory. This is used to track the username you provide (or change it) and the database URL.