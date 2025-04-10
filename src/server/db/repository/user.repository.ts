import { TRPCError } from "@trpc/server";
import type { db as dbType } from "~/server/db";
import type { IUserRepository } from "~/utils/interfaces/user.interface";
import type {
  InsertUser,
  SelectUser,
  UserSchema,
} from "~/utils/types/user.types";
import { userSchema } from "../schema";
import { cleanNulls } from "~/utils/transform";
import type { z } from "zod";

export default class UserRepository implements IUserRepository {
  constructor(private db: typeof dbType) {}

  async getUserByUsername(username: string) {
    try {
      const user = await this.db.query.userSchema.findFirst({
        where: ({ username: dbUsername }, { eq }) => eq(dbUsername, username),
        orderBy: ({ created_at }, { desc }) => desc(created_at),
      });

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }

      return cleanNulls(user) as z.infer<typeof UserSchema>;
    } catch (error) {
      console.log("❌ Error in user repository: ", error);

      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      });
    }
  }

  async addUser(data: InsertUser) {
    try {
      const [user] = await this.db.transaction(async (txn) => {
        const existingMember = await txn.query.userSchema.findFirst({
          where: ({ username: dbUsername }, { eq }) =>
            eq(dbUsername, data.username),
        });

        if (existingMember) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username is already taken",
          });
        }

        return await txn.insert(userSchema).values(data).returning();
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      return cleanNulls(user) as z.infer<typeof UserSchema>;
    } catch (error) {
      console.log("❌ Error in user repository: ", error);

      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      });
    }
  }

  async getUsernames(): Promise<SelectUser["username"][]> {
    try {
      return (
        await this.db.query.userSchema.findMany({
          columns: { username: true },
        })
      ).map((record) => record.username);
    } catch (error) {
      console.log("❌ Error in user repository: ", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
      });
    }
  }
}
