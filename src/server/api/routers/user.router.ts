import { UserSchema } from "~/utils/types/user.types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(UserSchema)
    .query(
      async ({ ctx: { repository }, input: { username } }) =>
        await repository.userRepository.getUserByUsername(username),
    ),

  addUser: publicProcedure
    .input(UserSchema)
    .output(UserSchema)
    .mutation(
      async ({ ctx: { repository }, input }) =>
        await repository.userRepository.addUser(input),
    ),

  getUsernames: publicProcedure
    .output(z.string().array())
    .query(
      async ({ ctx: { repository } }) =>
        await repository.userRepository.getUsernames(),
    ),
});
