import { EmailSender } from "@be-ntc/transactional/src/sender";

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
}

interface EmailData {
  user: User;
  url: string;
  token: string;
  validityMinutes?: number;
}

export interface OtpData {
  user: User;
  otp: string;
  validityMinutes?: number;
}

interface ChangeEmailData {
  user: User;
  newEmail: string;
  url: string;
  token: string;
}

interface SecurityAlertData {
  user: User;
  alertType: string;
  ipAddress?: string;
  userAgent?: string;
}

let emailSender: EmailSender | null = null;

function getEmailSender() {
  if (!emailSender) {
    emailSender = new EmailSender();
  }
  return emailSender;
}

// Better Auth hooks
export const authHooks = {
  // Sign up verification
  async sendVerificationEmail(data: EmailData): Promise<void> {
    await getEmailSender().sendVerifyEmail(data.user.email, {
      userFirstName: data.user.name,
      userEmail: data.user.email,
      verificationUrl: data.url,
      isResend: false,
      expiryMinutes: data.validityMinutes || 30,
    });
  },

  // Sign in OTP
  async sendSignInOtp(data: OtpData): Promise<void> {
    await getEmailSender().sendOtpEmail(data.user.email, {
      userFirstName: data.user.name,
      otpCode: data.otp,
      purpose: "login",
      type: "signin",
      expiryMinutes: data.validityMinutes || 5,
    });
  },

  // Sign up OTP
  async sendSignUpOtp(data: OtpData): Promise<void> {
    await getEmailSender().sendOtpEmail(data.user.email, {
      userFirstName: data.user.name,
      otpCode: data.otp,
      purpose: "verification",
      type: "signup",
      expiryMinutes: data.validityMinutes || 5,
    });
  },

  // Change email verification
  async sendChangeEmailVerification(data: ChangeEmailData): Promise<void> {
    await getEmailSender().sendChangeEmailVerification(data.newEmail, {
      userFirstName: data.user.name,
      oldEmail: data.user.email,
      newEmail: data.newEmail,
      confirmUrl: data.url,
    });
  },

  // Delete account verification
  async sendDeleteAccountVerification(data: EmailData): Promise<void> {
    await getEmailSender().sendDeleteAccountVerification(
      data.user.email,
      data.url,
      data.user.name
    );
  },

  // Password reset
  async sendPasswordReset(data: EmailData): Promise<void> {
    await getEmailSender().sendPasswordResetEmail(data.user.email, {
      userFirstName: data.user.name,
      resetUrl: data.url,
      expiryMinutes: data.validityMinutes || 30,
    });
  },

  // Magic link
  async sendMagicLink(data: EmailData): Promise<void> {
    await getEmailSender().sendMagicLinkEmail(data.user.email, {
      userEmail: data.user.email,
      magicUrl: data.url,
      expiryMinutes: data.validityMinutes || 5,
    });
  },

  // Welcome email after successful signup
  async sendWelcomeEmail(data: { user: User }): Promise<void> {
    await getEmailSender().sendWelcomeEmail(data.user.email, {
      userFirstName: data.user.name,
      verificationUrl: `${process.env.SITE_URL}/verify`,
    });
  },

  // Security alert
  async sendSecurityAlert(data: SecurityAlertData): Promise<void> {
    await getEmailSender().sendSecurityAlertEmail(data.user.email, {
      userFirstName: data.user.name,
      alertType: data.alertType as
        | "login"
        | "password_change"
        | "email_change"
        | "suspicious_activity"
        | "device_added",
      // location: data.location,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      timestamp: new Date().toLocaleString("fr-FR"),
      actionUrl: `${process.env.SITE_URL}/security`,
    });
  },

  // Send tips email
  async sendTipsEmail(data: { user: User }): Promise<void> {
    await getEmailSender().sendTipsEmail(data.user.email, {
      userFirstName: data.user.name,
    });
  },

  // Check engagement email
  async sendEngagementEmail(data: {
    user: User;
    daysSinceLastActivity: number;
  }): Promise<void> {
    await getEmailSender().sendEngagementEmail(data.user.email, {
      userFirstName: data.user.name,
      daysSinceLastActivity: data.daysSinceLastActivity,
      engagementUrl: `${process.env.SITE_URL}/dashboard`,
    });
  },

  // Send survey email
  async sendSurveyEmail(data: { user: User }): Promise<void> {
    await getEmailSender().sendSurveyEmail(data.user.email, {
      userFirstName: data.user.name,
      surveyUrl: `${process.env.SITE_URL}/survey`,
      incentive: "50 tokens Oza",
    });
  },

  // Before delete user
  async beforeDeleteUser(data: { user: User }): Promise<void> {
    // Send final backup/export email or confirmation
    console.log(`Preparing to delete user: ${data.user.email}`);
  },

  // After delete user
  async afterDeleteUser(data: { user: User }): Promise<void> {
    // Send goodbye email or cleanup notification
    console.log(`User deleted: ${data.user.email}`);
  },

  // Organization Invitation
  async sendOrganizationInvitation(data: {
    email: string;
    inviterName: string;
    organizationName: string;
    inviteUrl: string;
    expiresIn: string;
  }): Promise<void> {
    await getEmailSender().sendOrganizationInvitationEmail(data.email, {
      inviterName: data.inviterName,
      organizationName: data.organizationName,
      inviteUrl: data.inviteUrl,
      expiresIn: data.expiresIn,
    });
  },

  // // Organization Welcome
  // async sendOrganizationWelcome(data: {
  //   email: string;
  //   userFirstName: string;
  //   organizationName: string;
  //   dashboardUrl: string;
  // }): Promise<void> {},

  // Organization Role Updated
  async sendOrganizationRoleUpdated(data: {
    email: string;
    userFirstName: string;
    organizationName: string;
    newRole: string;
    dashboardUrl: string;
  }): Promise<void> {
    await getEmailSender().sendOrganizationRoleUpdatedEmail(data.email, {
      userFirstName: data.userFirstName,
      organizationName: data.organizationName,
      newRole: data.newRole,
      dashboardUrl: data.dashboardUrl,
    });
  },
};
