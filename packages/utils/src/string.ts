export const stringUtils = {
  /**
   * Create URL-friendly slug from string
   */
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Remove multiple hyphens
  },

  /**
   * Limit string length with ellipsis
   */
  limit: (text: string, length: number = 100, suffix: string = "..."): string => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },

  /**
   * Truncate string at word boundary
   */
  truncate: (text: string, length: number = 100, suffix: string = "..."): string => {
    if (text.length <= length) return text;
    const truncated = text.substring(0, length);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + suffix;
  },

  /**
   * Capitalize first letter
   */
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Title case conversion
   */
  titleCase: (text: string): string => {
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  /**
   * Extract initials from name
   */
  initials: (name: string, maxLength: number = 2): string => {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, maxLength)
      .join("");
  },

  /**
   * Generate random string
   */
  random: (length: number = 8, chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"): string => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Mask sensitive information
   */
  mask: (text: string, visibleStart: number = 2, visibleEnd: number = 2, maskChar: string = "*"): string => {
    if (text.length <= visibleStart + visibleEnd) return text;
    const start = text.substring(0, visibleStart);
    const end = text.substring(text.length - visibleEnd);
    const middle = maskChar.repeat(text.length - visibleStart - visibleEnd);
    return start + middle + end;
  },

  /**
   * Clean and normalize text
   */
  clean: (text: string): string => {
    return text
      .trim()
      .replace(/\s+/g, " ") // Multiple spaces to single
      .replace(/\n+/g, "\n"); // Multiple newlines to single
  },

  /**
   * Check if string is email
   */
  isEmail: (text: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  },

  /**
   * Check if string is phone number
   */
  isPhone: (text: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(text.replace(/[\s\-\(\)]/g, ""));
  },
};
