import { db } from "..";
import { users } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createUser(name: string) {
  try{
  //Equals to -> INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
  }catch(err){
    console.log(err);
  };
};

export async function getUserByName(name: string){
  try{
  //Equals to -> SELECT * FROM users WHERE name = name;
  const [result] = await db.select().from(users).where(eq(users.name, name));
  return result;
  }catch(err){
    console.log(err);
  };
};

export async function resetDatabase(){
  try{
    await db.execute(sql`TRUNCATE TABLE users;`);
    console.log("Truncated users table sucessfully!");
  }catch(err){
    console.log(err);
  };
};
