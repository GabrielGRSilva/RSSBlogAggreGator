import {db} from "..";
import { posts } from "../schema";

export async function createPost(title: string, url: string, description: string, published_at: string, feed_id: string){ //insert a new post into the database
    try{

        const[result] = await db.insert(posts).values({title, url, description, published_at, feed_id}).returning();

        return result;

    }catch(err){
        console.log(err);
    };
};

export async function getPostsForUser(user: string){
    try{

        const postsOnUser = await db.select().from(posts).where(eq())

    }catch(err){
        console.log(err);
    };
};

//Make number of returned posts configurable!