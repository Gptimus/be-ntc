export type Currency = "CDF" | "USD" | "EUR";

export interface CurrencyConfig {
  symbol: string;
  name: string;
  decimals: number;
  position: "before" | "after";
}

export const currencies: Record<Currency, CurrencyConfig> = {
  CDF: {
    symbol: "FC",
    name: "Franc Congolais",
    decimals: 0,
    position: "after",
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    decimals: 2,
    position: "before",
  },
  EUR: {
    symbol: "€",
    name: "Euro",
    decimals: 2,
    position: "after",
  },
};

export const currencyUtils = {
  /**
   * Format amount with currency
   */
  format: (
    amount: number,
    currency: Currency = "CDF",
    options?: {
      showSymbol?: boolean;
      showDecimals?: boolean;
      locale?: string;
    }
  ): string => {
    const config = currencies[currency];
    const { showSymbol = true, showDecimals = true, locale = "fr-CD" } = options || {};

    const decimals = showDecimals ? config.decimals : 0;
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);

    if (!showSymbol) return formatted;

    return config.position === "before"
      ? `${config.symbol}${formatted}`
      : `${formatted} ${config.symbol}`;
  },

  /**
   * Format amount in compact notation (1K, 1M, etc.)
   */
  formatCompact: (amount: number, currency: Currency = "CDF"): string => {
    const config = currencies[currency];
    
    if (amount < 1000) {
      return currencyUtils.format(amount, currency);
    }

    const units = ["", "K", "M", "B", "T"];
    const unitIndex = Math.floor(Math.log10(Math.abs(amount)) / 3);
    const scaledAmount = amount / Math.pow(1000, unitIndex);
    
    const formatted = scaledAmount.toFixed(1).replace(/\.0$/, "");
    const symbol = config.symbol;
    
    return config.position === "before"
      ? `${symbol}${formatted}${units[unitIndex]}`
      : `${formatted}${units[unitIndex]} ${symbol}`;
  },

  /**
   * Convert between currencies
   */
  convert: (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    exchangeRate: number
  ): number => {
    if (fromCurrency === toCurrency) return amount;
    return amount * exchangeRate;
  },

  /**
   * Format conversion display
   */
  formatConversion: (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency,
    exchangeRate: number
  ): string => {
    const convertedAmount = currencyUtils.convert(amount, fromCurrency, toCurrency, exchangeRate);
    const from = currencyUtils.format(amount, fromCurrency);
    const to = currencyUtils.format(convertedAmount, toCurrency);
    return `${from} = ${to}`;
  },

  /**
   * Parse amount from string
   */
  parse: (amountString: string, currency: Currency = "CDF"): number => {
    const config = currencies[currency];
    // Remove currency symbol and spaces
    const cleaned = amountString
      .replace(config.symbol, "")
      .replace(/\s/g, "")
      .replace(/,/g, ".");
    
    return parseFloat(cleaned) || 0;
  },

  /**
   * Format percentage
   */
  formatPercentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Format tokens
   */
  formatTokens: (amount: number, showDecimals: boolean = false): string => {
    const decimals = showDecimals ? 2 : 0;
    const formatted = new Intl.NumberFormat("fr-CD", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
    
    return `${formatted} tokens`;
  },

  /**
   * Calculate fee
   */
  calculateFee: (amount: number, feePercentage: number): number => {
    return (amount * feePercentage) / 100;
  },

  /**
   * Format with fee breakdown
   */
  formatWithFee: (
    amount: number,
    feePercentage: number,
    currency: Currency = "CDF"
  ): {
    amount: string;
    fee: string;
    total: string;
  } => {
    const fee = currencyUtils.calculateFee(amount, feePercentage);
    const total = amount + fee;

    return {
      amount: currencyUtils.format(amount, currency),
      fee: currencyUtils.format(fee, currency),
      total: currencyUtils.format(total, currency),
    };
  },
};
