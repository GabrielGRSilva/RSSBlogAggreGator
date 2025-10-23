import {db} from "..";
import { posts, feed_follows } from "../schema";
import { getUserByName } from "./users";
import { eq, sql, and } from "drizzle-orm";
import * as readline from 'readline';

export async function createPost(title: string, url: string, description: string, published_at: string, feed_id: string){ //insert a new post into the database
    try{

        const[result] = await db.insert(posts).values({title, url, description, published_at, feed_id})
            .returning();

        return result;

    }catch(err){
        console.log(err);
    };
};

export async function getPostsForUser(user: string, limit: number){
    try{
        const userObj = await getUserByName(user);

        if (userObj){

        const postsOfUser = await db.select({postTitle: posts.title, postURL: posts.url}).from(posts)
        .innerJoin(feed_follows,eq(feed_follows.feed_id, feed_follows.user_id))
            .where(and((sql`${feed_follows.feed_id} = ${posts.feed_id}`),
                eq(feed_follows.user_id, userObj.id )))
                .orderBy((sql`${posts.published_at} desc nulls first`));
        

        if (postsOfUser) {

            console.log(`Showing ${limit} posts for user ${user}:\n`);
            for(let i = 0; i <= limit; i++){

                let eachPost = postsOfUser[i]
                console.log(`Title: ${eachPost.postTitle}\nLink: ${eachPost.postURL}`);
                };
            };
        };
    }catch(err){
        console.log(err);
    };
};