import { query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    console.log("server identity", await ctx.auth.getUserIdentity());
    return "OK";
  },
});
