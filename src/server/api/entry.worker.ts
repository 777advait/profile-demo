import { trpcHandler } from "~/infra/cloudflare/trpcHandler.worker";
import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

export default {
  fetch: async (req: Request) =>
    await trpcHandler.requestHandler(req, appRouter, createTRPCContext),
};
