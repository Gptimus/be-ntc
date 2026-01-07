import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface PasswordResetEmailProps {
  userFirstName?: string;
  resetUrl?: string;
  expiryMinutes: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const PasswordResetEmail = ({
  userFirstName = "Utilisateur",
  resetUrl = `${baseUrl}/reset-password`,
  expiryMinutes = 30,
}: PasswordResetEmailProps) => (
  <EmailLayout preview="Réinitialisez votre mot de passe Be-ntc">
    <Heading style={emailStyles.h1}>Réinitialisation de mot de passe</Heading>

    <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

    <Text style={emailStyles.paragraph}>
      Nous avons reçu une demande de réinitialisation de mot de passe pour votre
      compte Be-ntc.
    </Text>

    <Button style={emailStyles.button} href={resetUrl}>
      Réinitialiser mon mot de passe
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={resetUrl}>
        {resetUrl}
      </Link>
    </Text>

    <Text style={emailStyles.paragraph}>
      Ce lien expire dans {expiryMinutes} minutes pour des raisons de sécurité.
    </Text>

    <Hr style={emailStyles.hr} />

    {/*<Text style={emailStyles.paragraph}>
      <strong>Détails de la demande :</strong>
    </Text>
    <Text style={emailStyles.paragraph}>
      Adresse IP : {ipAddress}
      <br />
      Navigateur : {userAgent}
    </Text>*/}

    <Text style={emailStyles.smallText}>
      Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet
      email en toute sécurité.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default PasswordResetEmail;
