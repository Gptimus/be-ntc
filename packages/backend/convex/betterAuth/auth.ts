import { doc } from "convex-helpers/validators";
import { v } from "convex/values";
import { createAuth } from "../auth";
import schema from "./schema";
import { query } from "../_generated/server";

// Export a static instance for Better Auth schema generation
export const auth = createAuth({} as any);

export const getUser = query({
  args: { userId: v.id("user") },
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  returns: v.union(v.null(), doc(schema, "user")),
  handler: async (ctx, args) => {
    return ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});
