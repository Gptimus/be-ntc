import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface MagicLinkProps {
  userEmail?: string;
  magicUrl?: string;
  //ipAddress?: string;
  //userAgent?: string;
  expiryMinutes?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const MagicLinkEmail = ({
  userEmail = "user@example.com",
  magicUrl = `${baseUrl}/magic-login`,
  //ipAddress = "192.168.1.1",
  //userAgent = "Chrome sur Windows",
  expiryMinutes = 5,
}: MagicLinkProps) => (
  <EmailLayout preview="Votre lien de connexion Be-ntc">
    <Heading style={emailStyles.h1}>Connexion à votre compte</Heading>

    <Text style={emailStyles.paragraph}>
      Cliquez sur le bouton ci-dessous pour vous connecter à votre compte Oza
      Wapi ({userEmail}).
    </Text>

    <Button style={emailStyles.button} href={magicUrl}>
      Se connecter
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={magicUrl}>
        {magicUrl}
      </Link>
    </Text>

    <Text style={emailStyles.paragraph}>
      Ce lien expire dans {expiryMinutes} minutes pour des raisons de sécurité.
    </Text>

    <Hr style={emailStyles.hr} />
    {/*
    <Text style={emailStyles.paragraph}>
      Détails de la demande : Adresse IP {ipAddress}, Navigateur {userAgent}.
    </Text>*/}

    <Text style={emailStyles.smallText}>
      Si vous n'avez pas demandé cette connexion, vous pouvez ignorer cet email
      en toute sécurité.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default MagicLinkEmail;
