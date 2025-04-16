import type { z } from "zod";
import type { InsertUser, SelectUser, UserSchema } from "../types/user.types";

export interface IUserRepository {
  getUserByUsername(username: string): Promise<z.infer<typeof UserSchema>>;
  addUser(data: InsertUser): Promise<z.infer<typeof UserSchema>>;
  getUsernames(): Promise<SelectUser["username"][]>;
  getUserAbout(username: string): Promise<SelectUser["about"]>;
}
