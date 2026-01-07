import { Resend } from "resend";
import type { EmailProvider } from "../sender";

export class ResendEmailProvider implements EmailProvider {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async send(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const fromName = process.env.FROM_NAME || "Be-ntc";
    const fromEmail = process.env.FROM_EMAIL || "noreply@be-ntc.com";

    const result = await this.resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (result.error) {
      throw new Error(`Failed to send email: ${result.error.message}`);
    }
  }
}
