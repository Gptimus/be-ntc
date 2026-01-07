import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface ChangeEmailProps {
  userFirstName?: string;
  oldEmail?: string;
  newEmail?: string;
  confirmUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const ChangeEmailEmail = ({
  userFirstName = "Utilisateur",
  oldEmail = "ancien@example.com",
  newEmail = "nouveau@example.com",
  confirmUrl = `${baseUrl}/confirm-email`,
}: ChangeEmailProps) => (
  <EmailLayout preview="Confirmez le changement de votre adresse email">
    <Heading style={emailStyles.h1}>Changement d'adresse email</Heading>

    <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

    <Text style={emailStyles.paragraph}>
      Nous avons reçu une demande de changement d'adresse email pour votre
      compte Be-ntc.
    </Text>

    <Text style={emailStyles.paragraph}>
      <strong>Ancienne adresse :</strong> {oldEmail}
      <br />
      <strong>Nouvelle adresse :</strong> {newEmail}
    </Text>

    <Button style={emailStyles.button} href={confirmUrl}>
      Confirmer le changement
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={confirmUrl}>
        {confirmUrl}
      </Link>
    </Text>

    {/*<Text style={emailStyles.paragraph}>Ce lien expire dans 24 heures.</Text>*/}

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.smallText}>
      Si vous n'avez pas demandé ce changement, contactez immédiatement notre
      équipe support.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default ChangeEmailEmail;
