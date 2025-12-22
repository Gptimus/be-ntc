import { expo } from "@better-auth/expo";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { v } from "convex/values";
import authConfig from "./auth.config";

import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl = process.env.NATIVE_APP_URL || "mybettertapp://";

export const authComponent = createClient<DataModel>(components.betterAuth);

const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [siteUrl, nativeAppUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      expo(),
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
    ],
  } satisfies BetterAuthOptions);
};

export { createAuth };

export const getCurrentUser = query({
  args: {},
  returns: v.any(),
  handler: async function (ctx, args) {
    return authComponent.getAuthUser(ctx);
  },
});
