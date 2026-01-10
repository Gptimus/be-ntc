import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id, Doc } from "./_generated/dataModel";
import { getUrlFromStorage } from "./lib/storage";

export const updateUserProfile = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    phone: v.optional(v.string()),
    phoneCountryCode: v.optional(v.string()),
    phoneCountryNumber: v.optional(v.string()),
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

    // Prepare field segregation
    const {
      firstName,
      lastName,
      phone,
      phoneCountryCode,
      phoneCountryNumber,
      profileImage,
      idCardImageUrl,
      ...otherProfileData
    } = args;

    // Update Auth User (BetterAuth table - saving profileImage to 'image' field)
    const userUpdates: Partial<Doc<"user">> = {};
    if (profileImage) userUpdates.image = profileImage;
    if (firstName || lastName) {
      userUpdates.name = [firstName, lastName].filter(Boolean).join(" ");
    }
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (phone) userUpdates.phone = phone;
    if (phoneCountryCode) userUpdates.phoneCountryCode = phoneCountryCode;
    if (phoneCountryNumber) userUpdates.phoneCountryNumber = phoneCountryNumber;

    if (Object.keys(userUpdates).length > 0) {
      await ctx.db.patch(userId as Id<"user">, userUpdates);
    }

    // Construct displayName for userProfiles table if name changed
    const userProfileUpdates: Partial<Doc<"userProfiles">> = {
      ...otherProfileData,
      updatedAt: Date.now(),
    };

    // Explicitly add idCardImageUrl if present (Saving to 'userProfiles' table)
    if (idCardImageUrl) {
      userProfileUpdates.idCardImageUrl = idCardImageUrl;
    }

    if (firstName || lastName) {
      userProfileUpdates.displayName = [firstName, lastName]
        .filter(Boolean)
        .join(" ");
    }

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, userProfileUpdates);
    } else {
      await ctx.db.insert("userProfiles", {
        userId,
        ...userProfileUpdates,
        createdAt: Date.now(),
      });
    }
  },
});

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const user = await ctx.db.get(userId as Id<"user">);
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile && !user) return null;

    // Convert storageIds to URLs
    const profileImageUrl = await getUrlFromStorage(ctx, user?.image);
    const idCardImageUrl = await getUrlFromStorage(
      ctx,
      profile?.idCardImageUrl
    );

    return {
      ...(profile || {}),
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      phoneCountryCode: user?.phoneCountryCode || "",
      phoneCountryNumber: user?.phoneCountryNumber || "",
      profileImage: profileImageUrl || "",
      idCardImageUrl: idCardImageUrl || undefined,
    };
  },
});
