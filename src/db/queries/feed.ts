import { db } from "..";
import { getUserByName } from "./users";
import { users, feeds, feed_follows } from "../schema";
import { eq, sql } from "drizzle-orm";
import {readConfig} from "../../config";

export async function createFeed(name: string, url: string, user_id: string){
  try{
  //Equals to -> INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
  const [result] = await db.insert(feeds).values({name, url, user_id}).returning();

  return result;
  }catch(err){
    console.log(err);
  };
};

export async function getFeeds(){ //Lists all feeds found in the DB
  try{
    const result = await db.select({eachName: feeds.name, eachUrl: feeds.url, eachId: feeds.user_id}).from(feeds);
    return result;

  }catch(err){
    console.log(err);
  };
};

export async function getFeedFollow(feedUrl: string){ //Inserts new feed follow record and returns connections //DEBUG: Check if correct
    try{
    await follow(feedUrl); //Creates new follow record for the RSS url

    const result = await db.select({id: feed_follows.id, createdAt: feed_follows.createdAt, updatedAt: feed_follows.updatedAt,
        feedName: feeds.name,
        userName: users.name,
     }).from(feed_follows).innerJoin(feeds, eq(feed_follows.id, feeds.id))
     .innerJoin(users, eq(feed_follows.id, users.id));

    return result;
    }catch(err){
    console.log(err);
  };
};

export async function follow(url: string){ //Create follow record for a RSS url
    
    try{
    const currentUsername = readConfig().currentUserName;

    const currentUser = await getUserByName(currentUsername);

    const feed = await getFeedByUrl(url);

    if(currentUser){//check if not undefined

    const [newFeedFollow] = await db.insert(feed_follows).values({user_id: currentUser.id, feed_id: feed.id}).returning();
    console.log(`${feed.name} record for ${currentUser.name} successfully created!`);
    return newFeedFollow;
    };

    }catch(err){
        console.log(err);
    };
};

export async function getFeedFollowsForUser(username: string){
    try{
    const userObj = await getUserByName(username);

    if(userObj){

    const userFollows = await db.select({feedName: feeds.name})
    .from(feeds).innerJoin(feed_follows,eq(feed_follows.user_id, userObj.id))
    .where(sql`${feed_follows.feed_id} = ${feeds.id}`);

    return userFollows;
    };

    }catch(err){
        console.log(err);
    };
};

async function getFeedByUrl(url: string){
    const [result] = await db.select().from(feeds).where(sql`${feeds.url} = ${url}`);

    return result;
};