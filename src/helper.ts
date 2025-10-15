//Helper function to log Feed and User to the console

import * as sc from './db/schema';

type Feed = typeof sc.feeds.$inferSelect;
type User = typeof sc.users.$inferSelect;

export async function printFeed(feed: Feed, user: User){
    console.log("---------------")
    console.log(`Feed:\n${feed}`);
    console.log("---------------")
    console.log(`User:\n${user}`)
    console.log("---------------")
};