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

interface ReferralSuccessEmailProps {
  userFirstName?: string;
  referredUserName?: string;
  tokensEarned?: number;
  bonusTokens?: number;
  totalReferrals?: number;
  nextMilestone?: number;
  milestoneReward?: number;
  dashboardUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const ReferralSuccessEmail = ({
  userFirstName = "John Doe",
  referredUserName = "Votre ami",
  tokensEarned = 150,
  bonusTokens = 50,
  totalReferrals = 5,
  nextMilestone = 10,
  milestoneReward = 500,
  dashboardUrl = `${baseUrl}/referrals`,
}: ReferralSuccessEmailProps) => (
  <EmailLayout
    preview={`Félicitations ! ${referredUserName} a rejoint Be-ntc grâce à vous`}
  >
    <Heading style={emailStyles.h1}>Excellent travail, {userFirstName}</Heading>

    <Text style={emailStyles.paragraph}>
      <strong>{referredUserName}</strong> a rejoint Be-ntc grâce à votre
      invitation et vous avez gagné des tokens de parrainage.
    </Text>

    <Section style={successTokenCard}>
      <Text style={emailStyles.tokenAmount}>+{tokensEarned}</Text>
      <Text style={emailStyles.tokenLabel}>Tokens de parrainage</Text>
    </Section>

    {bonusTokens > 0 && (
      <Text style={emailStyles.paragraph}>
        <span style={emailStyles.statusSuccess}>
          Bonus : +{bonusTokens} tokens
        </span>
      </Text>
    )}

    <Text style={emailStyles.paragraph}>
      Total gagné :{" "}
      <span style={emailStyles.primaryHighlight}>
        {tokensEarned + bonusTokens} tokens Oza
      </span>
    </Text>

    <Button style={emailStyles.button} href={dashboardUrl}>
      Voir mes parrainages
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={dashboardUrl}>
        {dashboardUrl}
      </Link>
    </Text>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.paragraph}>
      <strong>Votre progression :</strong> {totalReferrals} parrainages réussis
    </Text>

    <Text style={emailStyles.paragraph}>
      Plus que <strong>{nextMilestone - totalReferrals} parrainages</strong>{" "}
      pour débloquer{" "}
      <span style={emailStyles.primaryHighlight}>
        {milestoneReward} tokens bonus
      </span>
      .
    </Text>

    <Text style={emailStyles.paragraph}>
      Continuez à partager votre lien de parrainage pour gagner encore plus de
      tokens.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default ReferralSuccessEmail;

const successTokenCard = {
  backgroundColor: "#22c55e",
  borderRadius: "5px",
  padding: "20px",
  margin: "16px 0",
  textAlign: "center" as const,
};
