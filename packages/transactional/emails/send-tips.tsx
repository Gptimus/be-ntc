import { Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface SendTipsEmailProps {
  userFirstName?: string;
  tips?: string[];
}

export const SendTipsEmail = ({
  userFirstName = "Utilisateur",
  tips = [
    "Complétez votre profil pour gagner plus de tokens",
    "Participez aux événements locaux pour rencontrer la communauté",
    "Invitez vos amis pour gagner des bonus de parrainage",
  ],
}: SendTipsEmailProps) => (
  <EmailLayout preview="Conseils pour maximiser votre expérience Be-ntc">
    <Heading style={emailStyles.h1}>
      Conseils pour vous, {userFirstName}
    </Heading>

    <Text style={emailStyles.paragraph}>
      Voici quelques conseils pour tirer le meilleur parti d'Be-ntc :
    </Text>

    {tips.map((tip, index) => (
      <Text key={index} style={emailStyles.listItem}>
        • {tip}
      </Text>
    ))}

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.paragraph}>
      Besoin d'aide ? Consultez notre{" "}
      <Link style={emailStyles.link} href={`${process.env.SITE_URL}/help`}>
        centre d'aide
      </Link>
      .
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default SendTipsEmail;
