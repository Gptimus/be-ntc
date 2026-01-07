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

interface TokenRewardEmailProps {
  userFirstName?: string;
  tokensEarned?: number;
  rewardType?: "check-in" | "event" | "referral" | "post";
  totalTokens?: number;
  cdfValue?: number;
  actionUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const TokenRewardEmail = ({
  userFirstName = "Utilisateur",
  tokensEarned = 50,
  rewardType = "check-in",
  totalTokens = 250,
  cdfValue = 125,
  actionUrl = `${baseUrl}/wallet`,
}: TokenRewardEmailProps) => {
  const getRewardMessage = (type: string) => {
    switch (type) {
      case "check-in":
        return "pour votre check-in";
      case "event":
        return "pour votre participation à l'événement";
      case "referral":
        return "pour avoir parrainé un ami";
      case "post":
        return "pour votre publication populaire";
      default:
        return "pour votre activité";
    }
  };

  return (
    <EmailLayout
      preview={`Félicitations ! Vous avez gagné ${tokensEarned} tokens Oza`}
    >
      <Heading style={emailStyles.h1}>Félicitations, {userFirstName}</Heading>

      <Text style={emailStyles.paragraph}>
        Vous avez gagné{" "}
        <span style={emailStyles.primaryHighlight}>
          {tokensEarned} tokens Oza
        </span>{" "}
        {getRewardMessage(rewardType)}.
      </Text>

      <Section style={emailStyles.tokenCard}>
        <Text style={emailStyles.tokenAmount}>+{tokensEarned}</Text>
        <Text style={emailStyles.tokenLabel}>Tokens Oza</Text>
      </Section>

      <Text style={emailStyles.paragraph}>
        <strong>Nouveau solde :</strong> {totalTokens} tokens
        <br />
        <strong>Valeur estimée :</strong> ~{cdfValue} CDF
      </Text>

      <Button style={emailStyles.button} href={actionUrl}>
        Voir mon portefeuille
      </Button>

      <Text style={emailStyles.smallText}>
        Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
        collez-le dans votre navigateur :
      </Text>
      <Text style={emailStyles.paragraph}>
        <Link style={emailStyles.link} href={actionUrl}>
          {actionUrl}
        </Link>
      </Text>

      <Hr style={emailStyles.hr} />

      <Text style={emailStyles.paragraph}>
        Continuez à utiliser Be-ntc pour gagner encore plus de tokens !
      </Text>

      <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
    </EmailLayout>
  );
};

export default TokenRewardEmail;
