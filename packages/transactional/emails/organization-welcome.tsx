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

interface OrganizationWelcomeEmailProps {
  userFirstName?: string;
  organizationName?: string;
  dashboardUrl?: string;
}

export const OrganizationWelcomeEmail = ({
  userFirstName = "Membre",
  organizationName = "Be-ntc",
  dashboardUrl = "https://be-ntc.com/dashboard",
}: OrganizationWelcomeEmailProps) => (
  <EmailLayout preview={`Bienvenue dans l'équipe ${organizationName}`}>
    <Heading style={emailStyles.h1}>Bienvenue dans l'équipe !</Heading>

    <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

    <Text style={emailStyles.paragraph}>
      Vous avez rejoint avec succès l'organisation{" "}
      <strong>{organizationName}</strong> sur Be-ntc.
    </Text>

    <Text style={emailStyles.paragraph}>
      Vous pouvez maintenant accéder au tableau de bord de l'organisation et
      commencer à collaborer.
    </Text>

    <Section style={buttonContainer}>
      <Button style={emailStyles.button} href={dashboardUrl}>
        Accéder au tableau de bord
      </Button>
    </Section>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={dashboardUrl}>
        {dashboardUrl}
      </Link>
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default OrganizationWelcomeEmail;

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};
