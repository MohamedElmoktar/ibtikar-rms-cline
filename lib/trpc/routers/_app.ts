import { router } from "../trpc";
import { referenceRouter } from "./reference";
import { userRouter } from "./user";
import { clientRouter } from "./client";
import { countryRouter } from "./country";
import { technologyRouter } from "./technology";

export const appRouter = router({
  reference: referenceRouter,
  user: userRouter,
  client: clientRouter,
  country: countryRouter,
  technology: technologyRouter,
});

export type AppRouter = typeof appRouter;
