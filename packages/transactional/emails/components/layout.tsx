import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "https://be-ntc.com";

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>{preview}</Preview>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://www.be-ntc.com/images/logo-fit.png"
            width="30"
            height="30"
            alt="Be-ntc"
            style={logo}
          />
          {children}
          <Text style={footer}>
            <strong>{process.env.COMPANY_NAME || "Be-ntc"}</strong> -{" "}
            {process.env.COMPANY_TAGLINE ||
              "Connecter la République Démocratique du Congo"}
            <br />
            <br />
            <Link
              href={process.env.HELP_CENTER_URL || "https://be-ntc.com/help"}
              style={footerLink}
            >
              Centre d'aide
            </Link>{" "}
            |{" "}
            <Link
              href={process.env.CONTACT_URL || "https://be-ntc.com/contact"}
              style={footerLink}
            >
              Contact
            </Link>{" "}
            |{" "}
            <Link
              href={process.env.PRIVACY_URL || "https://be-ntc.com/privacy"}
              style={footerLink}
            >
              Confidentialité
            </Link>
            <br />
            <br />
            Email: {process.env.SUPPORT_EMAIL || "support@be-ntc.com"}
            <br />
            Téléphone: {process.env.SUPPORT_PHONE || "+243 123 456 789"}
            <br />
            {process.env.COMPANY_ADDRESS ||
              "Kinshasa, République Démocratique du Congo"}
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const logo = {
  margin: "0 0 20px",
  display: "block",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "20px",
  paddingTop: "20px",
  borderTop: "1px solid #e6ebf1",
};

const footerLink = {
  color: "#9e19b3",
  textDecoration: "none",
  fontSize: "12px",
};
