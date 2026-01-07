import { expo } from "@better-auth/expo";
import {
  type AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, BetterAuthOptions } from "better-auth";
import {
  admin,
  createAuthMiddleware,
  customSession,
  emailOTP,
  lastLoginMethod,
  magicLink,
  phoneNumber,
  twoFactor,
} from "better-auth/plugins";

import authConfig from "./auth.config";
import authSchema from "./betterAuth/schema";

import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";

import { authHooks } from "./utils/emailHooks";

import { UAParser } from "ua-parser-js";

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl = process.env.NATIVE_APP_URL || "mybettertapp://";
const isAdminApp = Boolean(process.env.ADMIN_APP!) || false;

const otpExpiresInSeconds = parseInt(
  process.env.OTP_EXPIRES_IN_SECONDS || "300"
);

const magicLinkExpiresInSeconds = parseInt(
  process.env.MAGIC_LINK_EXPIRES_IN_SECONDS || "300"
);

const resetPasswordTokenExpiresIn = parseInt(
  process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN_SECONDS || "3600"
);

const emailTokenExpiresInSeconds = parseInt(
  process.env.EMAIL_TOKEN_EXPIRES_IN_SECONDS || "3600"
);

const invitationExpiresIn =
  process.env.INVITATION_EXPIRES_IN_SECONDS || "7 jours";

const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
    authFunctions,
    triggers: {
      user: {
        onCreate: async (ctx, doc) => {
          await ctx.runMutation(internal.triggers.onUserCreated, {
            userId: doc._id,
            name: doc.name,
            email: doc.email,
          });
        },
      },
    },
  }
);

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const secret =
    process.env.BETTER_AUTH_SECRET || "PLACEHOLDER_SECRET_FOR_INITIALIZATION";

  return {
    baseURL: siteUrl,
    secret: secret,
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://*.be-ntc.com",
      "bentc://",
      "bentc:///",
      "bentc://*",
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
    emailVerification: {
      async sendVerificationEmail({ user, url, token }) {
        await authHooks.sendVerificationEmail({
          user,
          url,
          token,
          validityMinutes: Math.floor(emailTokenExpiresInSeconds / 60),
        });
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendOnSignIn: true,
      expiresIn: emailTokenExpiresInSeconds,
    },
    account: {
      accountLinking: {
        trustedProviders: ["google", "linkedin", "apple"],
      },
    },
    rateLimit: {
      storage: "database",
    },
    user: {
      additionalFields: {
        isRoot: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
        firstName: {
          type: "string",
          required: false,
          defaultValue: null,
          input: false,
        },
        lastName: {
          type: "string",
          required: false,
          defaultValue: null,
          input: false,
        },
        phone: {
          type: "string",
          required: false,
          defaultValue: null,
          input: true,
        },
        phoneCountryCode: {
          type: "string",
          required: false,
          defaultValue: null,
          input: true,
        },
        phoneCountryNumber: {
          type: "string",
          required: false,
          defaultValue: null,
          input: true,
        },
        formattedPhoneNumber: {
          type: "string",
          required: false,
          defaultValue: null,
          input: true,
        },
        phoneVerificationTime: {
          type: "number",
          required: false,
          defaultValue: null,
          input: true,
        },
        status: {
          type: "string",
          required: false,
          defaultValue: "active",
          input: false,
        },
        lastLoginAt: {
          type: "date",
          required: false,
          defaultValue: null,
          input: false,
        },
        lastSeenAt: {
          type: "date",
          required: false,
          defaultValue: null,
          input: false,
        },
        lastActiveAt: {
          type: "date",
          required: false,
          defaultValue: null,
          input: false,
        },

        shouldUpdatePassword: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
        shouldUpdatePasswordAt: {
          type: "date",
          required: false,
          defaultValue: null,
          input: false,
        },
        configuredAt: {
          type: "date",
          required: false,
          defaultValue: null,
          input: false,
        },
      },
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
          await authHooks.sendChangeEmailVerification({
            user,
            newEmail,
            url,
            token,
          });
        },
      },
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url, token }) => {
          await authHooks.sendDeleteAccountVerification({ user, url, token });
        },
        beforeDelete: async (user) => {
          await authHooks.beforeDeleteUser({ user });
        },
        afterDelete: async (user) => {
          await authHooks.afterDeleteUser({ user });
        },
      },
    },
    socialProviders: {
      linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID as string,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        accessType: "offline",
        prompt: "select_account consent",
      },
      apple: {
        clientId: process.env.APPLE_CLIENT_ID as string,
        clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      },
    },
    plugins: [
      expo(),
      admin(),
      phoneNumber({
        sendOTP: ({ phoneNumber, code }, request) => {
          console.log(
            "Sending OTP to",
            phoneNumber,
            "with code",
            code,
            request
          );
        },
      }),
      customSession(async ({ user, session }) => {
        const dbData = await ctx.runQuery(components.betterAuth.users.getUser, {
          userId: user.id,
        });

        return {
          user: {
            ...user,
            isRoot: dbData?.isRoot || false,
            role: dbData?.role || "user",
            banned: dbData?.banned || false,
            banExpires: dbData?.banExpires,
            twoFactorEnabled: dbData?.twoFactorEnabled || false,
            lastLoginMethod: dbData?.lastLoginMethod || "",
            shouldUpdatePassword: dbData?.shouldUpdatePassword || false,
          },
          session,
        };
      }),
      twoFactor({
        issuer: "oza-wapi",
        otpOptions: {
          async sendOTP({ user, otp }) {
            await authHooks.sendSignInOtp({
              user,
              otp,
              validityMinutes: Math.floor(otpExpiresInSeconds / 60),
            });
          },
        },
      }),
      magicLink({
        expiresIn: magicLinkExpiresInSeconds,
        disableSignUp: isAdminApp,
        sendMagicLink: async ({ email, url, token }) => {
          const dbData = await ctx.runQuery(
            components.betterAuth.users.getUserByEmail,
            {
              email,
            }
          );

          await authHooks.sendMagicLink({
            user: {
              id: dbData?._id || "",
              email,
              name: dbData?.firstName || "",
            },
            url,
            token,
            validityMinutes: Math.floor(magicLinkExpiresInSeconds / 60),
          });
        },
      }),
      emailOTP({
        expiresIn: otpExpiresInSeconds,
        sendVerificationOnSignUp: true,
        disableSignUp: isAdminApp,
        async sendVerificationOTP({ email, otp, type }) {
          const dbData = await ctx.runQuery(
            components.betterAuth.users.getUserByEmail,
            {
              email,
            }
          );

          const user = {
            id: dbData?._id || "",
            email,
            name: dbData?.firstName || "",
          };

          if (type === "sign-in") {
            await authHooks.sendSignInOtp({
              user,
              otp,
              validityMinutes: Math.floor(otpExpiresInSeconds / 60),
            });
          } else {
            await authHooks.sendSignUpOtp({
              user,
              otp,
              validityMinutes: Math.floor(otpExpiresInSeconds / 60),
            });
          }
        },
      }),
      lastLoginMethod({
        storeInDatabase: true,
      }),
      convex({
        authConfig,
        jwksRotateOnTokenGenerationError: true,
      }),
    ],
    hooks: {
      after: createAuthMiddleware(async (middlewareCtx) => {
        const session = middlewareCtx.context.newSession;
        const user = session?.user;

        if (!user) return;

        // Check if request comes from admin dashboard origin
        const origin = middlewareCtx?.request?.headers.get("origin");

        // if (
        //   origin === "https://admin.be-ntc.com" ||
        //   origin === "http://localhost:3002"
        // ) {
        //   // Check if user has admin role
        //   if (!isAdminUser(user.role)) {
        //     throw new Error(
        //       "Seuls les utilisateurs administrateurs peuvent accéder à cette application.",
        //     );
        //   }
        // }

        const ipAddress = session.session.ipAddress || "";
        const userAgent = session.session.userAgent || "";

        const parser = new UAParser(userAgent || "");
        const device = parser.getDevice();

        // const res = geoIp.lookup(ipAddress);
        // const location = res ? `${res.city}, ${res.country}` : "";

        // Send welcome email after sign-up
        if (middlewareCtx.path.startsWith("/sign-up") && session) {
          try {
            await authHooks.sendWelcomeEmail({ user });
          } catch (error) {
            console.error("Failed to send welcome email:", error);
          }
        }

        // Send security alert after sign-in
        if (middlewareCtx.path.startsWith("/sign-in") && session) {
          try {
            await authHooks.sendSecurityAlert({
              user,
              alertType: "login",
              ipAddress,
              userAgent: `${device.vendor} ${device.model}`,
            });
          } catch (error) {
            console.error("Failed to send security alert:", error);
          }
        }
      }),
    },
  } satisfies BetterAuthOptions;
};

const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};

export { createAuth };

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

export const getIsRootUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    return user?.isRoot || false;
  },
});

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
