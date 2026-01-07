// Email Templates
export { WelcomeEmail } from "./welcome";
export { TokenRewardEmail } from "./token-reward";
export { EventInvitationEmail } from "./event-invitation";
export { OrganizationInvitationEmail } from "./organization-invitation";
export { OrganizationWelcomeEmail } from "./organization-welcome";
export { OrganizationRoleUpdatedEmail } from "./organization-role-updated";
export { PasswordResetEmail } from "./password-reset";
export { ReferralSuccessEmail } from "./referral-success";
export { ChangeEmailEmail } from "./change-email";
export { MagicLinkEmail } from "./magic-link";
export { OtpEmail } from "./otp";
export { VerifyEmailEmail } from "./verify-email";
export { ContactEmail } from "./contact";
export { SecurityAlertEmail } from "./security-alert";
export { SendTipsEmail } from "./send-tips";
export { CheckEngagementEmail } from "./check-engagement";
export { SendSurveyEmail } from "./send-survey";

// Components
export { EmailLayout } from "./components/layout";

// Shared Styles
export { emailStyles } from "./styles/email-styles";

// Types
export interface EmailProps {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, unknown>;
}

export interface WelcomeEmailProps {
  userFirstName?: string;
  userEmail?: string;
  verificationUrl?: string;
}

export interface OtpProps {
  userFirstName?: string;
  otpCode?: string;
  purpose?: "login" | "verification" | "transaction" | "security";
  expiryMinutes?: number;
}
