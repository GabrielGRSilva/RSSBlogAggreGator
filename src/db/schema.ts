import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  name:  text("name").notNull().unique(),
  url:  text("url").notNull().unique(),
  user_id: uuid("user_id").references(()=> users.id, {onDelete: 'cascade'}).notNull(),
  last_fetched_at: timestamp("last_fetched_at"),
});

export const feed_follows = pgTable("feed_follows", { //Relations table Feeds + Users
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  feed_id: uuid("feed_id").references(() => feeds.id,{onDelete: 'cascade'}).notNull()
}, (t) => [
  unique().on(t.user_id, t.feed_id),
]);
