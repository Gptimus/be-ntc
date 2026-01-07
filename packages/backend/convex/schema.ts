import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "./betterAuth/schema";

// ==========================================
// Reusable Validation Schemas & Enums
// ==========================================
const commonFields = {
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
};

const qrFields = {
  qrData: v.optional(v.string()),
};

const userReference = {
  userId: v.id("user"),
};

// Status Enums
const UserStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
} as const;

const AuditEvent = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
  DELETED: "DELETED",
  RESTORED: "RESTORED",
} as const;

const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

const ProfileType = {
  INDIVIDUAL: "individual",
  ENTERPRISE: "enterprise",
} as const;

const KYCStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

const TransactionStatus = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
} as const;

const ServiceType = {
  PAY_MERCHANT: "payMerchant",
  PAY_TV: "payTV",
  PAY_ELECTRICITY: "payElectricity",
  PAY_WATER: "payWater",
  BULK_PAYMENT: "bulkPayment",
  ASSURANCE: "assurance",
  MICROFINANCE: "microfinance",
  TRANSFER_INTERNATIONAL: "transferInternational",
  PAY_TAX: "payTax",
  CASH_WITHDRAWAL: "cashWithdrawal",
  CURRENCY_EXCHANGE: "currencyExchange",
  BET: "bet",
  CARD_TRANSFER: "cardTransfer",
  RECHARGE: "recharge",
  MICROLOAN: "microloan",
  TRANSFER_LOCAL: "transferLocal",
  RESERVATION: "reservation",
  FOOD_ORDER: "foodOrder",
  ADD_MERCHANT: "addMerchant",
} as const;

const Currency = {
  CDF: "CDF",
  USD: "USD",
} as const;

const DeviceType = {
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  DESKTOP: "DESKTOP",
  OTHER: "OTHER",
} as const;

const NotificationCategory = {
  TRANSACTION: "transaction",
  SECURITY: "security",
  MARKETING: "marketing",
  ACCOUNT: "account",
  PROMOTION: "promotion",
  SERVICE: "service",
} as const;

const AccountType = {
  BE_NTC: "be_ntc",
  MOBILE_MONEY: "mobile_money",
  BANK_ACCOUNT: "bank_account",
  INTERNATIONAL: "international",
} as const;

const PaymentMethodType = {
  CARD: "card",
  BANK_ACCOUNT: "bank_account",
  MOBILE_MONEY: "mobile_money",
} as const;

const LoyaltyTier = {
  STANDARD: "standard",
  SILVER: "silver",
  GOLD: "gold",
  PLATINUM: "platinum",
} as const;

// ==========================================
// Reusable Field Groups
// ==========================================
const statusFields = {
  status: v.union(...Object.values(TransactionStatus).map(v.literal)),
};

const currencyFields = {
  currency: v.union(...Object.values(Currency).map(v.literal)),
};

const amountFields = {
  amount: v.number(),
  ...currencyFields,
};

const transactionDetailsFields = {
  merchant: v.optional(v.string()),
  recipient: v.optional(v.string()),
  operator: v.optional(v.string()),
  phoneNumber: v.optional(v.string()),
  bank: v.optional(v.string()),
  telecomAgency: v.optional(v.string()),
  atm: v.optional(v.string()),
  agentNumber: v.optional(v.string()),
  cardNumber: v.optional(v.string()),
  customerName: v.optional(v.string()),
  taxReference: v.optional(v.string()),
  taxpayerName: v.optional(v.string()),
  policyNumber: v.optional(v.string()),
  insuredName: v.optional(v.string()),
  loanAccount: v.optional(v.string()),
  borrowerName: v.optional(v.string()),
  bettingAccount: v.optional(v.string()),
  gameType: v.optional(v.string()),
  guestName: v.optional(v.string()),
  checkInDate: v.optional(v.string()),
  restaurantName: v.optional(v.string()),
  deliveryAddress: v.optional(v.string()),
  orderItems: v.optional(v.string()),
  specialInstructions: v.optional(v.string()),
};

// ==========================================
// Schema Definition
// ==========================================
const schema = defineSchema({
  ...authTables,
  // ==========================================
  // Core User & Authentication
  // ==========================================
  userProfiles: defineTable({
    userId: v.id("user"),

    // Basic Profile Info
    displayName: v.optional(v.string()),
    gender: v.optional(v.union(...Object.values(Gender).map(v.literal))),
    dateOfBirth: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),

    // Profile Type
    profileType: v.optional(
      v.union(...Object.values(ProfileType).map(v.literal))
    ),

    // KYC Info
    idCardNumber: v.optional(v.string()),
    idCardExpiry: v.optional(v.string()),
    idCardImageUrl: v.optional(v.string()),

    // App Config
    preferredLanguage: v.optional(v.string()),
    preferredCurrency: v.optional(v.string()),

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

    // Admin Fields
    isRoot: v.optional(v.boolean()),
    isAdmin: v.optional(v.boolean()),
    roleId: v.optional(v.id("roles")),

    qrData: v.optional(v.string()),

    ...commonFields,
  })
    .index("by_roleId", ["roleId"])
    .index("by_userId", ["userId"])
    .index("by_country_createdAt", ["country", "createdAt"])
    .index("by_profileType", ["profileType"]),
  // ==========================================
  // Merchants
  // ==========================================
  merchants: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    mobileMoneyPhoneNumber: v.string(),
    userId: v.id("user"),
    ...commonFields,
  })
    .index("active_by_userId", ["userId", "deletedAt"])
    .index("by_name_deleted", ["name", "deletedAt"])
    .index("by_email_deleted", ["email", "deletedAt"])
    .index("by_mobileMoneyPhoneNumber_deleted", [
      "mobileMoneyPhoneNumber",
      "deletedAt",
    ])
    .searchIndex("search_merchants", {
      searchField: "name",
      filterFields: ["userId", "deletedAt"],
    }),

  // ==========================================
  // Roles & Permissions
  // ==========================================
  roles: defineTable({
    name: v.string(),
    displayName: v.string(),
    description: v.optional(v.string()),
    isAdmin: v.boolean(),
    ...commonFields,
  })
    .index("by_isAdmin", ["isAdmin"])
    .index("by_name_deleted", ["name", "deletedAt"]),

  // ==========================================
  // KYC Verifications
  // ==========================================
  kycVerifications: defineTable({
    userId: v.string(),
    idType: v.union(
      v.literal("passport"),
      v.literal("national_id"),
      v.literal("driver_license"),
      v.literal("utility_bill"),
      v.literal("bank_statement"),
      v.literal("residence_permit"),
      v.literal("other")
    ),
    idFront: v.optional(v.string()),
    idBack: v.optional(v.string()),
    selfie: v.optional(v.string()),
    status: v.union(...Object.values(KYCStatus).map(v.literal)),
    ...qrFields,
    verifiedAt: v.optional(v.number()),
    verifiedBy: v.optional(v.id("user")),
    verifiedReason: v.optional(v.string()),
    rejectedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("user")),
    rejectedReason: v.optional(v.string()),
    ...commonFields,
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_verifiedBy", ["verifiedBy"]),

  // ==========================================
  // Transactions
  // ==========================================
  transactions: defineTable({
    userId: v.string(),
    serviceType: v.union(...Object.values(ServiceType).map(v.literal)),
    ...amountFields,
    details: v.object(transactionDetailsFields),
    ...statusFields,
    qrData: v.string(),
    ...commonFields,
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_serviceType_createdAt", ["serviceType", "createdAt"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_currency_status", ["currency", "status"])
    .index("by_createdAt_amount", ["createdAt", "amount"])
    .searchIndex("search_transactions", {
      searchField: "qrData",
      filterFields: [
        "userId",
        "serviceType",
        "status",
        "currency",
        "createdAt",
      ],
    }),

  // ==========================================
  // Service Providers
  // ==========================================
  serviceProviders: defineTable({
    category: v.union(
      v.literal("electricity"),
      v.literal("TV"),
      v.literal("insurance"),
      v.literal("microfinance"),
      v.literal("betting"),
      v.literal("hotel")
    ),
    name: v.string(),
    logo: v.optional(v.string()),
    ...commonFields,
  })
    .index("by_category_name", ["category", "name"])
    .index("by_category_deleted", ["category", "deletedAt"])
    .searchIndex("search_service_providers", {
      searchField: "name",
      filterFields: ["category", "deletedAt"],
    }),

  // ==========================================
  // Reservations
  // ==========================================
  reservations: defineTable({
    userId: v.string(),
    type: v.union(v.literal("car"), v.literal("hotel"), v.literal("travel")),
    provider: v.string(),
    date: v.string(),
    status: v.union(v.literal("confirmed"), v.literal("cancelled")),
    qrData: v.string(),
    ...commonFields,
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_type_provider", ["type", "provider"])
    .index("by_date_status", ["date", "status"]),

  // ==========================================
  // Loans
  // ==========================================
  loans: defineTable({
    userId: v.string(),
    ...amountFields,
    provider: v.string(),
    interestRate: v.number(),
    dueDate: v.number(),
    status: v.union(v.literal("active"), v.literal("repaid")),
    qrData: v.string(),
    ...commonFields,
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_dueDate", ["userId", "dueDate"])
    .index("by_provider_status", ["provider", "status"])
    .index("by_dueDate_status", ["dueDate", "status"]),

  // ==========================================
  // Security Answers
  // ==========================================
  securityAnswers: defineTable({
    userId: v.string(),
    question1: v.string(),
    answer1: v.string(),
    question2: v.string(),
    answer2: v.string(),
    ...commonFields,
  }).index("by_userId", ["userId"]),

  // ==========================================
  // Pending Deposits
  // ==========================================
  pendingDeposits: defineTable({
    userId: v.string(),
    ...amountFields,
    qrData: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed")),
    ...commonFields,
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_currency_status", ["currency", "status"]),

  // ==========================================
  // Deposit Histories
  // ==========================================
  depositHistories: defineTable({
    userId: v.string(),
    ...amountFields,
    method: v.string(),
    operator: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    transactionId: v.optional(v.id("transactions")),
    reference: v.optional(v.string()),
    status: v.union(
      v.literal("completed"),
      v.literal("pending"),
      v.literal("failed")
    ),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    type: v.union(v.literal("in"), v.literal("out")),
    fee: v.optional(v.number()),
    notes: v.optional(v.string()),
    receiptUrl: v.optional(v.string()),
    ...qrFields,
    ipAddress: v.optional(v.string()),
    deviceInfo: v.optional(v.string()),
    processedAt: v.optional(v.number()),
    ...commonFields,
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_method_createdAt", ["method", "createdAt"])
    .index("by_currency_createdAt", ["currency", "createdAt"])
    .index("by_type_createdAt", ["type", "createdAt"])
    .index("by_reference", ["reference"]),

  // ==========================================
  // Wallets
  // ==========================================
  wallets: defineTable({
    userId: v.string(),
    balanceCDF: v.number(),
    balanceUSD: v.number(),
    identifierCDF: v.optional(v.string()),
    identifierUSD: v.optional(v.string()),
    lastUpdated: v.number(),
    qrData: v.string(),
    ...commonFields,
  })
    .index("by_userId", ["userId"])
    .index("by_identifierCDF_deleted", ["identifierCDF", "deletedAt"])
    .index("by_identifierUSD_deleted", ["identifierUSD", "deletedAt"])
    .index("by_userId_currency", ["userId", "balanceCDF", "balanceUSD"]) // Note: Multi-field index
    .searchIndex("search_wallets_cdf", {
      searchField: "identifierCDF",
      filterFields: ["deletedAt"],
    })
    .searchIndex("search_wallets_usd", {
      searchField: "identifierUSD",
      filterFields: ["deletedAt"],
    }),

  // ==========================================
  // Audit System
  // ==========================================
  audits: defineTable({
    auditableId: v.string(),
    auditableType: v.string(),
    event: v.union(...Object.values(AuditEvent).map(v.literal)),
    userId: v.id("user"),
    oldValues: v.optional(v.union(v.string(), v.record(v.string(), v.any()))),
    newValues: v.union(v.string(), v.record(v.string(), v.any())),
    url: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    ...commonFields,
  })
    .index("by_auditableType_createdAt", ["auditableType", "createdAt"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_event_createdAt", ["event", "createdAt"])
    .index("by_auditableId_createdAt", ["auditableId", "createdAt"])
    .searchIndex("search_audits", {
      searchField: "auditableType",
      filterFields: ["userId", "event", "createdAt", "tags"],
    }),

  // ==========================================
  // Auth Logs
  // ==========================================
  authLogs: defineTable({
    userId: v.id("user"),
    action: v.string(),
    email: v.optional(v.string()),
    timestamp: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    details: v.optional(v.string()),
  })
    .index("by_userId_timestamp", ["userId", "timestamp"])
    .index("by_action_timestamp", ["action", "timestamp"])
    .index("by_ipAddress_timestamp", ["ipAddress", "timestamp"]),

  // ==========================================
  // User Devices
  // ==========================================
  userDevices: defineTable({
    userId: v.id("user"),
    deviceId: v.string(),
    deviceName: v.string(),
    deviceType: v.union(...Object.values(DeviceType).map(v.literal)),
    platform: v.string(),
    osVersion: v.optional(v.string()),
    appVersion: v.optional(v.string()),
    lastActive: v.number(),
    fcmToken: v.optional(v.string()),
    isActive: v.boolean(),
    ...commonFields,
  })
    .index("by_userId_isActive", ["userId", "isActive"])
    .index("by_deviceId", ["deviceId"])
    .index("by_userId_lastActive", ["userId", "lastActive"])
    .index("by_platform_isActive", ["platform", "isActive"]),

  // ==========================================
  // Notifications System
  // ==========================================
  notificationSettings: defineTable({
    userId: v.id("user"),
    pushEnabled: v.boolean(),
    emailEnabled: v.boolean(),
    smsEnabled: v.boolean(),
    categories: v.object({
      transactions: v.boolean(),
      security: v.boolean(),
      marketing: v.boolean(),
      accountUpdates: v.boolean(),
      promotions: v.boolean(),
      service: v.boolean(),
    }),
    quiet: v.optional(
      v.object({
        enabled: v.boolean(),
        startTime: v.string(),
        endTime: v.string(),
        timeZone: v.string(),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  notifications: defineTable({
    userId: v.id("user"),
    title: v.string(),
    body: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.union(...Object.values(NotificationCategory).map(v.literal)),
    priority: v.union(v.literal("high"), v.literal("normal"), v.literal("low")),
    action: v.optional(
      v.object({
        type: v.union(
          v.literal("deeplink"),
          v.literal("url"),
          v.literal("transaction")
        ),
        value: v.string(),
        transactionId: v.optional(v.id("transactions")),
      })
    ),
    isRead: v.boolean(),
    sentVia: v.array(
      v.union(
        v.literal("push"),
        v.literal("email"),
        v.literal("sms"),
        v.literal("in_app")
      )
    ),
    metadata: v.optional(v.record(v.string(), v.any())),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_userId_category_createdAt", ["userId", "category", "createdAt"])
    .index("by_userId_isRead_createdAt", ["userId", "isRead", "createdAt"])
    .index("by_priority_createdAt", ["priority", "createdAt"])
    .index("by_sentVia_createdAt", ["sentVia", "createdAt"]),

  // ==========================================
  // Savings & Goals
  // ==========================================
  savingsGoals: defineTable({
    userId: v.id("user"),
    name: v.string(),
    targetAmount: v.number(),
    currentAmount: v.number(),
    ...currencyFields,
    category: v.union(
      v.literal("home"),
      v.literal("education"),
      v.literal("vehicle"),
      v.literal("travel"),
      v.literal("emergency"),
      v.literal("retirement"),
      v.literal("other")
    ),
    iconName: v.optional(v.string()),
    isAutomated: v.boolean(),
    automationRules: v.optional(
      v.object({
        frequency: v.union(
          v.literal("daily"),
          v.literal("weekly"),
          v.literal("monthly")
        ),
        amount: v.number(),
        dayOfWeek: v.optional(v.number()),
        dayOfMonth: v.optional(v.number()),
        nextExecutionTime: v.number(),
      })
    ),
    targetDate: v.optional(v.number()),
    progress: v.number(),
    isCompleted: v.boolean(),
    completedAt: v.optional(v.number()),
    ...commonFields,
  })
    .index("by_userId_isCompleted", ["userId", "isCompleted"])
    .index("by_userId_category", ["userId", "category"])
    .index("by_userId_targetDate", ["userId", "targetDate"])
    .index("by_category_progress", ["category", "progress"])
    .searchIndex("search_savings_goals", {
      searchField: "name",
      filterFields: ["userId", "category", "isCompleted", "currency"],
    }),

  savingsTransactions: defineTable({
    goalId: v.id("savingsGoals"),
    userId: v.id("user"),
    ...amountFields,
    type: v.union(
      v.literal("deposit"),
      v.literal("withdrawal"),
      v.literal("automated")
    ),
    balance: v.number(),
    createdAt: v.number(),
  })
    .index("by_goalId_createdAt", ["goalId", "createdAt"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_goalId_type", ["goalId", "type"]),

  // ==========================================
  // Beneficiaries & Contacts
  // ==========================================
  beneficiaries: defineTable({
    userId: v.id("user"),
    name: v.string(),
    nickname: v.optional(v.string()),
    accountType: v.union(...Object.values(AccountType).map(v.literal)),
    details: v.object({
      accountNumber: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      bankName: v.optional(v.string()),
      bankCode: v.optional(v.string()),
      swiftCode: v.optional(v.string()),
      country: v.optional(v.string()),
      mobileOperator: v.optional(v.string()),
    }),
    isFrequent: v.boolean(),
    lastTransferDate: v.optional(v.number()),
    ...commonFields,
  })
    .index("by_userId_isFrequent", ["userId", "isFrequent"])
    .index("by_userId_accountType", ["userId", "accountType"])
    .index("by_userId_lastTransferDate", ["userId", "lastTransferDate"])
    .searchIndex("search_beneficiaries", {
      searchField: "name",
      filterFields: ["userId", "accountType", "isFrequent"],
    }),

  // ==========================================
  // Cards & Payment Methods
  // ==========================================
  paymentMethods: defineTable({
    userId: v.id("user"),
    type: v.union(...Object.values(PaymentMethodType).map(v.literal)),
    details: v.object({
      lastFour: v.optional(v.string()),
      cardType: v.optional(v.string()),
      expiryMonth: v.optional(v.string()),
      expiryYear: v.optional(v.string()),
      bankName: v.optional(v.string()),
      accountNumber: v.optional(v.string()),
      mobileProvider: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
    }),
    isDefault: v.boolean(),
    paymentToken: v.optional(v.string()),
    ...commonFields,
  })
    .index("by_userId_isDefault", ["userId", "isDefault"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_paymentToken", ["paymentToken"])
    .searchIndex("search_payment_methods", {
      searchField: "details.lastFour",
      filterFields: ["userId", "type", "deletedAt"],
    }),

  // ==========================================
  // Recurring Payments
  // ==========================================
  recurringPayments: defineTable({
    userId: v.id("user"),
    name: v.string(),
    ...amountFields,
    serviceType: v.union(
      v.literal("payTV"),
      v.literal("payElectricity"),
      v.literal("payWater"),
      v.literal("transferLocal"),
      v.literal("recharge"),
      v.literal("other")
    ),
    frequency: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("quarterly"),
      v.literal("annually")
    ),
    details: v.object({
      beneficiaryId: v.optional(v.id("beneficiaries")),
      accountNumber: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      reference: v.optional(v.string()),
      providerId: v.optional(v.id("serviceProviders")),
    }),
    nextPaymentDate: v.number(),
    isActive: v.boolean(),
    paymentMethodId: v.optional(v.id("paymentMethods")),
    ...commonFields,
  })
    .index("by_userId_isActive", ["userId", "isActive"])
    .index("by_nextPaymentDate", ["nextPaymentDate"])
    .index("by_userId_nextPaymentDate", ["userId", "nextPaymentDate"])
    .index("by_serviceType_isActive", ["serviceType", "isActive"])
    .index("by_frequency_nextPaymentDate", ["frequency", "nextPaymentDate"]),

  // ==========================================
  // Rewards & Loyalty
  // ==========================================
  loyaltyPoints: defineTable({
    userId: v.id("user"),
    balance: v.number(),
    lifetimePoints: v.number(),
    tier: v.union(...Object.values(LoyaltyTier).map(v.literal)),
    lastUpdated: v.number(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_tier_balance", ["tier", "balance"])
    .index("by_lastUpdated", ["lastUpdated"]),

  loyaltyTransactions: defineTable({
    userId: v.id("user"),
    amount: v.number(),
    type: v.union(
      v.literal("earned"),
      v.literal("redeemed"),
      v.literal("expired"),
      v.literal("bonus")
    ),
    description: v.string(),
    transactionId: v.optional(v.id("transactions")),
    createdAt: v.number(),
  })
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_transactionId", ["transactionId"]),

  loyaltyRewards: defineTable({
    name: v.string(),
    description: v.string(),
    pointsRequired: v.number(),
    category: v.union(
      v.literal("discount"),
      v.literal("voucher"),
      v.literal("cashback"),
      v.literal("service"),
      v.literal("merchandise")
    ),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    quantity: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    ...commonFields,
  })
    .index("by_category_points", ["category", "pointsRequired"])
    .index("by_isActive_expiresAt", ["isActive", "expiresAt"])
    .index("by_pointsRequired_isActive", ["pointsRequired", "isActive"])
    .searchIndex("search_loyalty_rewards", {
      searchField: "name",
      filterFields: ["category", "isActive", "pointsRequired"],
    }),

  redemptions: defineTable({
    userId: v.id("user"),
    rewardId: v.id("loyaltyRewards"),
    pointsSpent: v.number(),
    voucherCode: v.optional(v.string()),
    status: v.union(
      v.literal("issued"),
      v.literal("used"),
      v.literal("expired"),
      v.literal("cancelled")
    ),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_voucherCode", ["voucherCode"])
    .index("by_rewardId_status", ["rewardId", "status"])
    .index("by_expiresAt_status", ["expiresAt", "status"]),

  // ==========================================
  // Analytics & Reporting (Optional)
  // ==========================================
  dailyTransactionSummaries: defineTable({
    date: v.string(),
    userId: v.id("user"),
    totalAmountCDF: v.number(),
    totalAmountUSD: v.number(),
    transactionCount: v.number(),
    successfulCount: v.number(),
    failedCount: v.number(),
    ...commonFields,
  })
    .index("by_date", ["date"])
    .index("by_userId_date", ["userId", "date"])
    .index("by_date_currency", ["date", "totalAmountCDF", "totalAmountUSD"]),
});

export default schema;
