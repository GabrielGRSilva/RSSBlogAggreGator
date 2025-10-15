import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, user_id: string) {
  try{
  //Equals to -> INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
  const [result] = await db.insert(feeds).values({name, url, user_id}).returning();

  return result;
  }catch(err){
    console.log(err);
  };
};