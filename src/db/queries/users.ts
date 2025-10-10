import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
  //Equals to -> INSERT INTO <table> (<columns>) VALUES (<values>) RETURNING *;
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
};

export async function getUserByName(name: string){  //DEBUG -> CHECK IF THIS IS WORKING
  //Equals to -> SELECT * FROM users WHERE name = name;
  const [result] = await db.select().from(users).where(eq(users.name, name));

  return result;
};

