export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (international format)
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  },

  /**
   * Validate coordinates (latitude, longitude)
   */
  isValidCoordinates: (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  /**
   * Validate token amount
   */
  isValidTokenAmount: (amount: number): boolean => {
    return amount >= 0 && Number.isInteger(amount);
  },

  /**
   * Validate currency amount
   */
  isValidCurrencyAmount: (amount: number): boolean => {
    return amount >= 0 && Number.isFinite(amount);
  },

  /**
   * Validate user role level
   */
  isValidRoleLevel: (level: number): boolean => {
    return level >= 1 && level <= 100 && Number.isInteger(level);
  },

  /**
   * Validate venue capacity
   */
  isValidCapacity: (capacity: number): boolean => {
    return capacity > 0 && Number.isInteger(capacity);
  },

  /**
   * Validate battery percentage
   */
  isValidBatteryLevel: (level: number): boolean => {
    return level >= 0 && level <= 100 && Number.isInteger(level);
  },

  /**
   * Validate rating (1-5 stars)
   */
  isValidRating: (rating: number): boolean => {
    return rating >= 1 && rating <= 5;
  },

  /**
   * Validate age restriction
   */
  isValidAgeRestriction: (age: number): boolean => {
    return age >= 0 && age <= 100 && Number.isInteger(age);
  },

  /**
   * Validate price range
   */
  isValidPriceRange: (min: number, max: number): boolean => {
    return min >= 0 && max >= min;
  },

  /**
   * Validate percentage (0-100)
   */
  isValidPercentage: (percentage: number): boolean => {
    return percentage >= 0 && percentage <= 100;
  },

  /**
   * Validate URL format
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate hex color
   */
  isValidHexColor: (color: string): boolean => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  },
};
