import { v } from "convex/values";
import { doc } from "convex-helpers/validators";
import { query } from "../_generated/server";
import authSchema from "./schema";

export const getUser = query({
  args: { userId: v.id("user") },
  returns: v.union(v.null(), doc(authSchema, "user")),
  handler: async (ctx, args) => {
    return ctx.db.get(args.userId);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  returns: v.union(v.null(), doc(authSchema, "user")),
  handler: async (ctx, args) => {
    return ctx.db
      .query("user")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});
