import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const onUserCreated = internalMutation({
  args: {
    userId: v.id("user"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userProfiles", {
      userId: args.userId,
      displayName: args.name,
      settings: {
        language: "fr",
        timezone: "Africa/Kinshasa",
        privacy: {
          showEmail: false,
          showPhone: false,
          showProfileToPublic: true,
          visibility: {
            showOnlineStatus: true,
            showLastSeen: true,
            showLocation: true,
          },
        },
        notifications: {
          email: {
            newsletter: true,
            promotions: false,
            securityAlerts: true,
          },
          push: {
            messages: true,
            follows: true,
            events: true,
            systemAlerts: true,
          },
          sms: {
            transactional: true,
            promotions: false,
          },
        },
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
