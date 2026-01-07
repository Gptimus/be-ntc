import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface SendSurveyEmailProps {
  userFirstName?: string;
  surveyUrl?: string;
  incentive?: string;
}

const baseUrl = process.env.SITE_URL || "https://be-ntc.com";

export const SendSurveyEmail = ({
  userFirstName = "Utilisateur",
  surveyUrl = `${baseUrl}/survey`,
  incentive = "50 tokens Oza",
}: SendSurveyEmailProps) => (
  <EmailLayout preview="Aidez-nous à améliorer Be-ntc">
    <Heading style={emailStyles.h1}>Votre avis compte, {userFirstName}</Heading>

    <Text style={emailStyles.paragraph}>
      Nous espérons que vous appréciez votre expérience sur Be-ntc ! Votre
      feedback nous aide à améliorer la plateforme pour toute la communauté.
    </Text>

    <Text style={emailStyles.paragraph}>
      Prenez 2 minutes pour répondre à notre enquête et recevez{" "}
      <span style={emailStyles.primaryHighlight}>{incentive}</span> en
      remerciement.
    </Text>

    <Button style={emailStyles.button} href={surveyUrl}>
      Répondre à l'enquête
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={surveyUrl}>
        {surveyUrl}
      </Link>
    </Text>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.paragraph}>Vos réponses nous aident à :</Text>

    <Text style={emailStyles.listItem}>
      • Améliorer les fonctionnalités existantes
    </Text>
    <Text style={emailStyles.listItem}>
      • Développer de nouvelles fonctionnalités utiles
    </Text>
    <Text style={emailStyles.listItem}>
      • Mieux servir la communauté congolaise
    </Text>

    <Text style={emailStyles.smallText}>
      Cette enquête est anonyme et prend moins de 2 minutes à compléter.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default SendSurveyEmail;
