import { render } from "@react-email/render";
import {
  ChangeEmailEmail,
  CheckEngagementEmail,
  MagicLinkEmail,
  OrganizationInvitationEmail,
  OrganizationRoleUpdatedEmail,
  OrganizationWelcomeEmail,
  OtpEmail,
  PasswordResetEmail,
  SecurityAlertEmail,
  SendSurveyEmail,
  SendTipsEmail,
  VerifyEmailEmail,
  WelcomeEmail,
} from "../emails";
import { ResendEmailProvider } from "./providers/resend";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Email provider interface - implement with your preferred service
export interface EmailProvider {
  send(options: EmailOptions): Promise<void>;
}

export class EmailSender {
  constructor(
    private provider: EmailProvider = new ResendEmailProvider(
      process.env.RESEND_API_KEY!
    )
  ) {}

  async sendWelcomeEmail(
    to: string,
    props: Parameters<typeof WelcomeEmail>[0]
  ) {
    const html = await render(WelcomeEmail(props));
    await this.provider.send({
      to,
      subject: "Bienvenue sur Oza",
      html,
    });
  }

  async sendVerifyEmail(
    to: string,
    props: Parameters<typeof VerifyEmailEmail>[0]
  ) {
    const html = await render(VerifyEmailEmail(props));
    await this.provider.send({
      to,
      subject: "Vérifiez votre email Be-ntc",
      html,
    });
  }

  async sendOtpEmail(
    to: string,
    props: Parameters<typeof OtpEmail>[0] & {
      type?: "signin" | "signup" | "delete";
    }
  ) {
    const html = await render(OtpEmail(props));
    const subjects = {
      signin: "Code de connexion Be-ntc",
      signup: "Code de vérification Be-ntc",
      delete: "Code de suppression de compte Be-ntc",
    };

    await this.provider.send({
      to,
      subject: subjects[props.type || "signin"],
      html,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    props: Parameters<typeof PasswordResetEmail>[0]
  ) {
    const html = await render(PasswordResetEmail(props));
    await this.provider.send({
      to,
      subject: "Réinitialisation de mot de passe Be-ntc",
      html,
    });
  }

  async sendMagicLinkEmail(
    to: string,
    props: Parameters<typeof MagicLinkEmail>[0]
  ) {
    const html = await render(MagicLinkEmail(props));
    await this.provider.send({
      to,
      subject: "Connexion à votre compte Be-ntc",
      html,
    });
  }

  async sendSecurityAlertEmail(
    to: string,
    props: Parameters<typeof SecurityAlertEmail>[0]
  ) {
    const html = await render(SecurityAlertEmail(props));
    await this.provider.send({
      to,
      subject: "Alerte de sécurité Be-ntc",
      html,
    });
  }

  async sendChangeEmailVerification(
    to: string,
    props: Parameters<typeof ChangeEmailEmail>[0]
  ) {
    const html = await render(ChangeEmailEmail(props));
    await this.provider.send({
      to,
      subject: "Confirmez le changement d'email Be-ntc",
      html,
    });
  }

  async sendDeleteAccountVerification(
    to: string,
    url: string,
    userFirstName?: string
  ) {
    const html = await render(
      VerifyEmailEmail({
        userFirstName,
        userEmail: to,
        verificationUrl: url,
        isResend: false,
      })
    );

    await this.provider.send({
      to,
      subject: "Confirmation de suppression de compte Be-ntc",
      html,
    });
  }

  async sendTipsEmail(to: string, props: Parameters<typeof SendTipsEmail>[0]) {
    const html = await render(SendTipsEmail(props));
    await this.provider.send({
      to,
      subject: "Conseils pour maximiser votre expérience Be-ntc",
      html,
    });
  }

  async sendEngagementEmail(
    to: string,
    props: Parameters<typeof CheckEngagementEmail>[0]
  ) {
    const html = await render(CheckEngagementEmail(props));
    await this.provider.send({
      to,
      subject: "Nous vous avons manqué sur Be-ntc",
      html,
    });
  }

  async sendSurveyEmail(
    to: string,
    props: Parameters<typeof SendSurveyEmail>[0]
  ) {
    const html = await render(SendSurveyEmail(props));
    await this.provider.send({
      to,
      subject: "Aidez-nous à améliorer Be-ntc",
      html,
    });
  }

  async sendOrganizationInvitationEmail(
    to: string,
    props: Parameters<typeof OrganizationInvitationEmail>[0]
  ) {
    const html = await render(OrganizationInvitationEmail(props));
    await this.provider.send({
      to,
      subject: `Invitation à rejoindre ${
        props.organizationName || "une organisation"
      } sur Be-ntc`,
      html,
    });
  }

  async sendOrganizationWelcomeEmail(
    to: string,
    props: Parameters<typeof OrganizationWelcomeEmail>[0]
  ) {
    const html = await render(OrganizationWelcomeEmail(props));
    await this.provider.send({
      to,
      subject: `Bienvenue dans ${props.organizationName || "l'organisation"}`,
      html,
    });
  }

  async sendOrganizationRoleUpdatedEmail(
    to: string,
    props: Parameters<typeof OrganizationRoleUpdatedEmail>[0]
  ) {
    const html = await render(OrganizationRoleUpdatedEmail(props));
    await this.provider.send({
      to,
      subject: `Mise à jour de votre rôle dans ${
        props.organizationName || "l'organisation"
      }`,
      html,
    });
  }
}
