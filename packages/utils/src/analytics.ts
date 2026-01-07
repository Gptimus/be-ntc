export const analyticsUtils = {
  /**
   * Calculate percentage change
   */
  percentageChange: (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  /**
   * Format percentage change with sign
   */
  formatPercentageChange: (current: number, previous: number): string => {
    const change = analyticsUtils.percentageChange(current, previous);
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  },

  /**
   * Calculate growth rate
   */
  growthRate: (values: number[]): number => {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return analyticsUtils.percentageChange(last ?? 0, first ?? 0);
  },

  /**
   * Calculate average
   */
  average: (values: number[]): number => {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },

  /**
   * Calculate conversion rate
   */
  conversionRate: (conversions: number, total: number): number => {
    if (total === 0) return 0;
    return (conversions / total) * 100;
  },

  /**
   * Format conversion rate
   */
  formatConversionRate: (conversions: number, total: number): string => {
    const rate = analyticsUtils.conversionRate(conversions, total);
    return `${rate.toFixed(2)}%`;
  },

  /**
   * Calculate retention rate
   */
  retentionRate: (retained: number, total: number): number => {
    return analyticsUtils.conversionRate(retained, total);
  },

  /**
   * Format large numbers for display
   */
  formatMetric: (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },

  /**
   * Calculate engagement rate
   */
  engagementRate: (interactions: number, impressions: number): number => {
    return analyticsUtils.conversionRate(interactions, impressions);
  },

  /**
   * Format uptime percentage
   */
  formatUptime: (uptime: number): string => {
    return `${uptime.toFixed(2)}%`;
  },
};
