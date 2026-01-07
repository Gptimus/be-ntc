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

interface WelcomeEmailProps {
  userFirstName?: string;
  userEmail?: string;
  verificationUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const WelcomeEmail = ({
  userFirstName = "John Doe",
  verificationUrl = `${baseUrl}/verify`,
}: WelcomeEmailProps) => (
  <EmailLayout preview="Bienvenue sur Be-ntc - Vérifiez votre compte">
    <Heading style={emailStyles.h1}>
      Bienvenue sur Be-ntc, {userFirstName}!
    </Heading>

    <Text style={emailStyles.paragraph}>
      Merci d'avoir rejoint Be-ntc, la plateforme sociale qui connecte la
      République Démocratique du Congo. Vous êtes maintenant prêt à découvrir
      une nouvelle façon de vous connecter avec votre communauté !
    </Text>

    <Text style={emailStyles.paragraph}>
      Avec Be-ntc, vous pouvez gagner des tokens en participant à la vie locale,
      découvrir de nouveaux lieux, participer à des événements et inviter vos
      amis.
    </Text>

    <Button style={emailStyles.button} href={verificationUrl}>
      Vérifier mon compte
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

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.paragraph}>
      Pour commencer, nous vous recommandons de{" "}
      <Link style={emailStyles.link} href={`${baseUrl}/profile`}>
        compléter votre profil
      </Link>{" "}
      et d'explorer les lieux près de chez vous.
    </Text>

    <Text style={emailStyles.paragraph}>
      Une fois que vous aurez vérifié votre compte, vous pourrez utiliser toutes
      les fonctionnalités d'Be-ntc :
    </Text>

    <Section style={emailStyles.section}>
      <Text style={emailStyles.listItem}>
        <strong>Système de tokens Oza</strong> - Gagnez des récompenses en
        participant
      </Text>
      <Text style={emailStyles.listItem}>
        <strong>Check-ins locaux</strong> - Découvrez et partagez les lieux
        emblématiques
      </Text>
      <Text style={emailStyles.listItem}>
        <strong>Événements communautaires</strong> - Créez et participez aux
        événements
      </Text>
      <Text style={emailStyles.listItem}>
        <strong>Programme de parrainage</strong> - Invitez vos amis et gagnez
        ensemble
      </Text>
    </Section>

    <Text style={emailStyles.paragraph}>
      Vous pouvez accéder à votre tableau de bord et voir vos tokens directement
      depuis votre{" "}
      <Link style={emailStyles.link} href={`${baseUrl}/dashboard`}>
        espace personnel
      </Link>
      .
    </Text>

    <Text style={emailStyles.paragraph}>
      Si vous n'avez pas terminé votre inscription, vous trouverez peut-être
      notre{" "}
      <Link style={emailStyles.link} href={`${baseUrl}/help`}>
        centre d'aide
      </Link>{" "}
      utile.
    </Text>

    <Text style={emailStyles.smallText}>
      Ce lien de vérification expire dans 24 heures. Si vous n'avez pas créé de
      compte, vous pouvez ignorer cet email en toute sécurité.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default WelcomeEmail;
