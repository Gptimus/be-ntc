import type { EmailProvider } from "../sender";

interface ConvexResendComponent {
  send(args: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<{ id: string }>;
}

export class ConvexResendProvider implements EmailProvider {
  constructor(private resendComponent: ConvexResendComponent) {}

  async send(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const fromName = process.env.FROM_NAME || "Be-ntc";
    const fromEmail = process.env.FROM_EMAIL || "noreply@ozawapi.com";

    await this.resendComponent.send({
      to: options.to,
      subject: options.subject,
      html: options.html,
      from: `${fromName} <${fromEmail}>`,
    });
  }
}
