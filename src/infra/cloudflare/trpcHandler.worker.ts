import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { env } from "~/env";
import { appRouter, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

class TRPCHandler {
  private allowedOrigins: Set<String>;
  private corsHeaders: Record<string, string>;

  constructor() {
    this.allowedOrigins = new Set(
      env.CORS_ALLOWED_ORIGINS.split(",").map((origin) =>
        origin.trim().toLowerCase(),
      ),
    );

    this.corsHeaders = {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, trpc-accept",
      Vary: "Origin",
      "Cache-Control": "no-store",
    };
  }

  private getCorsHeaders(origin: string) {
    return this.allowedOrigins.has(origin)
      ? { ...this.corsHeaders, "Access-Control-Allow-Origin": origin }
      : this.corsHeaders;
  }

  public async requestHandler(
    req: Request,
    router: AppRouter,
    createContext: typeof createTRPCContext,
  ): Promise<Response> {
    const { headers, method } = req;
    const reqOrigin = headers.get("Origin") ?? "";

    const corsHeaders = this.getCorsHeaders(reqOrigin);

    if (!this.allowedOrigins.has(reqOrigin)) {
      return new Response(
        JSON.stringify({
          error: `Origin ${reqOrigin} disallowed`,
        }),
        { status: 403 },
      );
    }

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      const res = await fetchRequestHandler({
        endpoint: "/api/trpc",
        router,
        req,
        createContext: () => createContext({ headers }),
      });

      return new Response(await res.text(), {
        status: res.status,
        headers: {
          ...Object.fromEntries(res.headers),
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.error("❌ tRPC handler error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: "An error occurred while processing your request",
        }),
        {
          status: 500,
        },
      );
    }
  }
}

export const trpcHandler = new TRPCHandler();
