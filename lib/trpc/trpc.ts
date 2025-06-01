import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

// Create context for tRPC
export async function createTRPCContext(opts: CreateNextContextOptions) {
  const { req, res } = opts;

  // Get the session from the server
  const session = await getServerSession(req, res, authOptions);

  return {
    req,
    res,
    session,
  };
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
