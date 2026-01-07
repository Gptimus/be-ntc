import {
  format,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

export const dateUtils = {
  /**
   * Format date to various formats
   */
  format: (date: Date | string | number, formatStr: string = "dd/MM/yyyy") => {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(dateObj, formatStr, { locale: fr });
  },

  /**
   * Format date for display (smart formatting)
   */
  formatSmart: (date: Date | string | number) => {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

    if (isToday(dateObj)) {
      return `Aujourd'hui à ${format(dateObj, "HH:mm", { locale: fr })}`;
    }

    if (isYesterday(dateObj)) {
      return `Hier à ${format(dateObj, "HH:mm", { locale: fr })}`;
    }

    return format(dateObj, "dd MMM yyyy à HH:mm", { locale: fr });
  },

  /**
   * Format relative time (il y a X minutes)
   */
  formatRelative: (date: Date | string | number) => {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
  },

  /**
   * Format duration between two dates
   */
  formatDuration: (
    start: Date | string | number,
    end: Date | string | number,
  ) => {
    const startDate =
      typeof start === "string" ? parseISO(start) : new Date(start);
    const endDate = typeof end === "string" ? parseISO(end) : new Date(end);

    const duration = intervalToDuration({ start: startDate, end: endDate });
    return formatDuration(duration, { locale: fr });
  },

  /**
   * Common date formats
   */
  formats: {
    short: "dd/MM/yy",
    medium: "dd MMM yyyy",
    long: "dd MMMM yyyy",
    full: "EEEE dd MMMM yyyy",
    time: "HH:mm",
    datetime: "dd/MM/yyyy HH:mm",
    iso: "yyyy-MM-dd",
  },
};
