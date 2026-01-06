import { expo } from "@better-auth/expo";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { magicLink } from "better-auth/plugins";
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
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://*.be-ntc.com",
      "bentc://",
      "exp://192.168.1.65:8081/",
      "exp://*/*",
      "exp://10.0.0.*:*/*",
      "exp://192.168.*.*:*/*",
      "exp://172.*.*.*:*/*",
      "exp://localhost:*/*",
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      expo(),
      magicLink({
        sendMagicLink: async ({ email, url, token }, request) => {
          // TODO: Implement email sending service
          // For now, log the magic link URL for development
          console.log(`Magic link for ${email}: ${url}`);
          console.log(`Token: ${token}`);

          // In production, you would send this via your email service:
          // await sendEmail({
          //   to: email,
          //   subject: "Sign in to BE-NTC",
          //   html: `Click here to sign in: <a href="${url}">${url}</a>`,
          // });
        },
        expiresIn: 60 * 10, // 10 minutes
        disableSignUp: false, // Allow new user registration via magic link
      }),
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
