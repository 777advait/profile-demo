import { z } from "zod";
import type { userSchema } from "~/server/db/schema";

export type SelectUser = typeof userSchema.$inferSelect;
export type InsertUser = typeof userSchema.$inferInsert;

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be less than 32 characters" })
    .transform((val) => val.trim()),
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username should be atleast 3 characters" })
    .max(16, { message: "Username must be less than 16 characters" })
    .regex(/^[a-zA-Z0-9_.]+$/, {
      message:
        "Username must not contain special characters except underscore and period",
    })
    .transform((val) => val.trim().toLowerCase()),
  work: z
    .string()
    .min(1, { message: "Bio is required" })
    .max(48, { message: "Bio must be less than 48 characters" })
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  location: z
    .string()
    .min(1, { message: "Location is required" })
    .max(32, { message: "Location must be less than 32 characters" })
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  pronouns: z
    .string()
    .min(1, { message: "Pronouns are required" })
    .max(12, { message: "Pronouns must be less than 12 characters" })
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  website: z
    .string()
    .url({ message: "Website must be a valid URL" })
    .min(1, { message: "Website is required" })
    .max(96, { message: "Website must be less than 96 characters" })
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  about: z
    .string()
    .min(1, { message: "About is required" })
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
});
