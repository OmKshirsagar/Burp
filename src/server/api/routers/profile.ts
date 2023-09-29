import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../../api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { type User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "../helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const [user] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return filterUserForClient(user);
    }),
});
