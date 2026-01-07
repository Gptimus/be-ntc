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

interface OrganizationRoleUpdatedEmailProps {
  userFirstName?: string;
  organizationName?: string;
  newRole?: string;
  dashboardUrl?: string;
}

export const OrganizationRoleUpdatedEmail = ({
  userFirstName = "Membre",
  organizationName = "Be-ntc",
  newRole = "membre",
  dashboardUrl = "https://be-ntc.com/dashboard",
}: OrganizationRoleUpdatedEmailProps) => (
  <EmailLayout preview={`Votre rôle a été mis à jour dans ${organizationName}`}>
    <Heading style={emailStyles.h1}>Mise à jour de votre rôle</Heading>

    <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

    <Text style={emailStyles.paragraph}>
      Votre rôle au sein de l'organisation <strong>{organizationName}</strong> a
      été mis à jour.
    </Text>

    <Section style={roleCard}>
      <Text style={emailStyles.paragraph}>
        Votre nouveau rôle : <strong>{newRole}</strong>
      </Text>
    </Section>

    <Text style={emailStyles.paragraph}>
      Ce changement peut affecter vos permissions et accès au sein de
      l'organisation.
    </Text>

    <Section style={buttonContainer}>
      <Button style={emailStyles.button} href={dashboardUrl}>
        Voir mon profil
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

export default OrganizationRoleUpdatedEmail;

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const roleCard = {
  backgroundColor: "#f3f4f6",
  borderRadius: "5px",
  padding: "16px",
  margin: "16px 0",
  textAlign: "center" as const,
};
