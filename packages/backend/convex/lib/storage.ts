import type { Id } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";

// List of all fields in the schema that contain file/image/photo/logo URLs
export const STORAGE_URL_FIELDS = [
  // User related fields
  "image",
  "profilePhotoUrl",
  "idCardImageUrl",

  // Misc fields
  "qrCode",
  "logo",
  "imageUrl",
];

/**
 * Replaces a storage ID with its public URL
 *
 * @param ctx - Convex context with storage access
 * @param url - The potential storage ID or URL
 * @returns A public URL if the input was a storage ID, otherwise returns the original input
 */
export async function getUrlFromStorage(
  ctx: QueryCtx | MutationCtx,
  url: string | Id<"_storage"> | null | undefined
): Promise<string | undefined> {
  if (!url) return undefined;

  // If it's already a URL, return it as is
  if (typeof url === "string" && url.startsWith("http")) {
    return url;
  }

  try {
    // Convert the storage ID to a URL
    const publicUrl = await ctx.storage.getUrl(url as Id<"_storage">);
    return publicUrl || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Process storage URLs in an object
 *
 * Takes an object and replaces any storage IDs with public URLs for specified fields
 *
 * @param ctx - Convex context with storage access
 * @param obj - The object to process
 * @param fields - The field names that might contain storage IDs
 * @returns A copy of the object with storage IDs replaced by public URLs
 */
export async function processStorageUrls<T>(
  ctx: QueryCtx | MutationCtx,
  obj: T,
  fields: string[] = STORAGE_URL_FIELDS
): Promise<T> {
  if (!obj || typeof obj !== "object") return obj;

  // Create a copy of the object
  const result = { ...obj } as Record<string, unknown>;

  // Process each field that might contain a storage ID
  for (const field of fields) {
    if (field in result && result[field]) {
      result[field] = await getUrlFromStorage(
        ctx,
        result[field] as string | Id<"_storage">
      );
    }
  }

  return result as T;
}
