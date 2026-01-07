export const systemUtils = {
  /**
   * Format system status
   */
  formatStatus: (status: "healthy" | "degraded" | "unhealthy" | "unknown"): {
    label: string;
    color: string;
    icon: string;
  } => {
    const statusMap = {
      healthy: { label: "Sain", color: "text-green-500", icon: "✓" },
      degraded: { label: "Dégradé", color: "text-yellow-500", icon: "⚠" },
      unhealthy: { label: "Défaillant", color: "text-red-500", icon: "✗" },
      unknown: { label: "Inconnu", color: "text-gray-500", icon: "?" },
    };
    return statusMap[status];
  },

  /**
   * Format memory usage
   */
  formatMemoryUsage: (used: number, total: number): string => {
    const percentage = (used / total) * 100;
    return `${fileUtils.formatSize(used)} / ${fileUtils.formatSize(total)} (${percentage.toFixed(1)}%)`;
  },

  /**
   * Format CPU usage
   */
  formatCpuUsage: (percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  },

  /**
   * Format network speed
   */
  formatNetworkSpeed: (bytesPerSecond: number): string => {
    const units = ["B/s", "KB/s", "MB/s", "GB/s"];
    let value = bytesPerSecond;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
  },

  /**
   * Format response time
   */
  formatResponseTime: (milliseconds: number): string => {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    return `${(milliseconds / 1000).toFixed(2)}s`;
  },

  /**
   * Format database query count
   */
  formatQueryCount: (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M queries`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K queries`;
    }
    return `${count} queries`;
  },

  /**
   * Format error rate
   */
  formatErrorRate: (errors: number, total: number): string => {
    if (total === 0) return "0%";
    const rate = (errors / total) * 100;
    return `${rate.toFixed(2)}%`;
  },

  /**
   * Format cache hit ratio
   */
  formatCacheHitRatio: (hits: number, total: number): string => {
    if (total === 0) return "0%";
    const ratio = (hits / total) * 100;
    return `${ratio.toFixed(1)}%`;
  },

  /**
   * Get severity color
   */
  getSeverityColor: (severity: "low" | "medium" | "high" | "critical"): string => {
    const colors = {
      low: "text-green-500",
      medium: "text-yellow-500", 
      high: "text-orange-500",
      critical: "text-red-500",
    };
    return colors[severity];
  },

  /**
   * Format priority level
   */
  formatPriority: (priority: number): { label: string; color: string } => {
    if (priority >= 80) return { label: "Critique", color: "text-red-500" };
    if (priority >= 60) return { label: "Élevée", color: "text-orange-500" };
    if (priority >= 40) return { label: "Moyenne", color: "text-yellow-500" };
    return { label: "Faible", color: "text-green-500" };
  },
};

// Import fileUtils for formatSize function
import { fileUtils } from "./file";
