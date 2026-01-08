import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";

export const updateUserProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("MALE"), v.literal("FEMALE"))),
    dateOfBirth: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    profileType: v.optional(
      v.union(v.literal("individual"), v.literal("enterprise"))
    ),
    preferredLanguage: v.optional(v.string()),
    preferredCurrency: v.optional(v.string()),
    idCardNumber: v.optional(v.string()),
    idCardExpiry: v.optional(v.string()),
    idCardImageUrl: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    qrData: v.optional(v.string()),
    settings: v.optional(
      v.object({
        language: v.string(),
        timezone: v.string(),
        privacy: v.object({
          showEmail: v.boolean(),
          showPhone: v.boolean(),
          showProfileToPublic: v.boolean(),
          visibility: v.object({
            showOnlineStatus: v.boolean(),
            showLastSeen: v.boolean(),
            showLocation: v.boolean(),
          }),
        }),
        notifications: v.object({
          email: v.object({
            newsletter: v.boolean(),
            promotions: v.boolean(),
            securityAlerts: v.boolean(),
          }),
          push: v.object({
            messages: v.boolean(),
            follows: v.boolean(),
            events: v.boolean(),
            systemAlerts: v.boolean(),
          }),
          sms: v.object({
            transactional: v.boolean(),
            promotions: v.boolean(),
          }),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    // Update Auth User (BetterAuth table)
    const userUpdates: Partial<Doc<"user">> = {};
    if (args.profileImage) userUpdates.image = args.profileImage;
    if (args.displayName) userUpdates.name = args.displayName;

    if (Object.keys(userUpdates).length > 0) {
      await ctx.db.patch(userId as Id<"user">, userUpdates);
    }

    // Prepare UserProfile updates - remove 'profileImage' as it's not in userProfiles schema
    const { profileImage, ...userProfileArgs } = args;

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        ...userProfileArgs,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("userProfiles", {
        userId,
        ...userProfileArgs,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }
    const userId = identity.subject;

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});
