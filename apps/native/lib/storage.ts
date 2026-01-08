import { createMMKV } from "react-native-mmkv";
import { registerMMKVInstance } from "@buoy-gg/storage";
// Create MMKV instance
// Encryption key should be handled securely in production
export const storage = createMMKV({
  id: "be-ntc-storage",
  encryptionKey: "be-ntc-encryption-key-2026",
});

registerMMKVInstance("mmkv", storage);

// Storage keys
export const StorageKeys = {
  HAS_SEEN_ONBOARDING: "hasSeenOnboarding",
  USER_PREFERENCES: "userPreferences",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// Helper functions for easy access
export const storageHelpers = {
  // Onboarding
  hasSeenOnboarding: (): boolean => {
    return storage.getBoolean(StorageKeys.HAS_SEEN_ONBOARDING) ?? false;
  },

  setHasSeenOnboarding: (value: boolean): void => {
    storage.set(StorageKeys.HAS_SEEN_ONBOARDING, value);
  },

  // Generic get/set
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  // JSON support
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Clear all
  clearAll: (): void => {
    storage.clearAll();
  },

  // Delete specific key
  delete: (key: string): void => {
    storage.remove(key);
  },
};

// Re-export hooks for reactive use in components
export {
  useMMKV,
  useMMKVString,
  useMMKVNumber,
  useMMKVBoolean,
  useMMKVObject,
} from "react-native-mmkv";
