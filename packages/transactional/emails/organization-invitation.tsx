import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface OrganizationInvitationEmailProps {
  inviterName?: string;
  organizationName?: string;
  inviteUrl?: string;
  expiresIn?: string;
}

export const OrganizationInvitationEmail = ({
  inviterName = "Un membre",
  organizationName = "Be-ntc",
  inviteUrl = "https://be-ntc.com/accept-invitation",
  expiresIn = "7 jours",
}: OrganizationInvitationEmailProps) => (
  <EmailLayout
    preview={`${inviterName} vous a invité à rejoindre ${organizationName} sur Be-ntc`}
  >
    <Heading style={emailStyles.h1}>Invitation à rejoindre une équipe</Heading>

    <Text style={emailStyles.paragraph}>Bonjour,</Text>

    <Text style={emailStyles.paragraph}>
      <strong>{inviterName}</strong> vous a invité à rejoindre l'organisation{" "}
      <strong>{organizationName}</strong> sur Be-ntc.
    </Text>

    <Section style={buttonContainer}>
      <Button style={emailStyles.button} href={inviteUrl}>
        Accepter l'invitation
      </Button>
    </Section>

    <Text style={emailStyles.paragraph}>
      Cette invitation expirera dans <strong>{expiresIn}</strong>.
    </Text>

    <Text style={emailStyles.smallText}>
      Si vous ne vous attendiez pas à cette invitation, vous pouvez ignorer cet
      email.
    </Text>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={inviteUrl}>
        {inviteUrl}
      </Link>
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default OrganizationInvitationEmail;

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};
