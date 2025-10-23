import {db} from "..";
import { posts, feed_follows } from "../schema";
import { getUserByName } from "./users";
import { eq, sql, and } from "drizzle-orm";

export async function createPost(title: string, url: string, description: string, published_at: string, feed_id: string){ //insert a new post into the database
    try{

        const[result] = await db.insert(posts).values({title, url, description, published_at, feed_id}).onConflictDoNothing({ target: posts.url })
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
        .innerJoin(feed_follows,eq(feed_follows.user_id, userObj.id))
            .where(sql`${feed_follows.feed_id} = ${posts.feed_id}`)
            .orderBy((sql`${posts.published_at} desc nulls first`));
        
        if (postsOfUser.length > 0) {

            console.log(`Showing ${limit} posts for user ${user}:\n`);
            for(let i = 0; i <= limit; i++){

                let eachPost = postsOfUser[i]
                console.log(`Title: ${eachPost.postTitle}\nLink: ${eachPost.postURL}`);
                };
            }else{
                console.log("No posts found!");
            };
        };
    }catch(err){
        console.log(err);
    };
};