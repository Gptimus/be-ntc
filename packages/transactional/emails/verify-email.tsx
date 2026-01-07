import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface VerifyEmailProps {
  userFirstName?: string;
  userEmail?: string;
  verificationUrl?: string;
  isResend?: boolean;
  expiryMinutes?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const VerifyEmailEmail = ({
  userFirstName = "Utilisateur",
  userEmail = "user@example.com",
  verificationUrl = `${baseUrl}/verify`,
  isResend = false,
  expiryMinutes = 30,
}: VerifyEmailProps) => (
  <EmailLayout preview="Vérifiez votre adresse email Be-ntc">
    <Heading style={emailStyles.h1}>
      {isResend ? "Nouveau lien de vérification" : "Vérifiez votre email"}
    </Heading>

    <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

    <Text style={emailStyles.paragraph}>
      {isResend
        ? "Voici un nouveau lien de vérification pour votre compte Be-ntc."
        : "Merci de vous être inscrit sur Be-ntc. Veuillez vérifier votre adresse email pour activer votre compte."}
    </Text>

    <Text style={emailStyles.paragraph}>
      <strong>Email à vérifier :</strong> {userEmail}
    </Text>

    <Button style={emailStyles.button} href={verificationUrl}>
      Vérifier mon email
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={verificationUrl}>
        {verificationUrl}
      </Link>
    </Text>

    <Text style={emailStyles.paragraph}>
      Ce lien expire dans {expiryMinutes} minutes.
    </Text>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.smallText}>
      Si vous n'avez pas créé de compte Be-ntc, vous pouvez ignorer cet email en
      toute sécurité.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default VerifyEmailEmail;
