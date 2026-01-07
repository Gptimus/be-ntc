import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface CheckEngagementEmailProps {
  userFirstName?: string;
  daysSinceLastActivity?: number;
  engagementUrl?: string;
}

const baseUrl = process.env.SITE_URL || "https://be-ntc.com";

export const CheckEngagementEmail = ({
  userFirstName = "Utilisateur",
  daysSinceLastActivity = 7,
  engagementUrl = `${baseUrl}/dashboard`,
}: CheckEngagementEmailProps) => (
  <EmailLayout preview="Nous vous avons manqué sur Be-ntc">
    <Heading style={emailStyles.h1}>
      Nous vous avons manqué, {userFirstName}
    </Heading>

    <Text style={emailStyles.paragraph}>
      Cela fait {daysSinceLastActivity} jours que nous ne vous avons pas vu sur
      Be-ntc. Votre communauté vous attend !
    </Text>

    <Text style={emailStyles.paragraph}>
      Voici ce que vous pourriez manquer :
    </Text>

    <Text style={emailStyles.listItem}>
      • Nouveaux événements dans votre région
    </Text>
    <Text style={emailStyles.listItem}>
      • Opportunités de gagner des tokens
    </Text>
    <Text style={emailStyles.listItem}>
      • Nouvelles connexions avec la communauté
    </Text>

    <Button style={emailStyles.button} href={engagementUrl}>
      Revenir sur Be-ntc
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={engagementUrl}>
        {engagementUrl}
      </Link>
    </Text>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.smallText}>
      Si vous ne souhaitez plus recevoir ces emails, vous pouvez vous désabonner
      dans vos paramètres.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default CheckEngagementEmail;
