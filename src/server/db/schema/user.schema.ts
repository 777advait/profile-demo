import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { idLike } from "../column.helpers";
import { sql } from "drizzle-orm";

export const userSchema = sqliteTable(
  "user",
  {
    id: idLike(),
    name: text().notNull(),
    username: text().notNull().unique(),
    bio: text(),
    location: text(),
    pronouns: text(),
    website: text(),
    about: text(),
    created_at: integer({ mode: "timestamp_ms" }).default(
      sql`(current_timestamp)`,
    ),
  },
  (table) => [uniqueIndex("username_idx").on(table.username)],
);
