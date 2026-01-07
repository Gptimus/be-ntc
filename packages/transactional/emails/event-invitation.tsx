import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface EventInvitationEmailProps {
  userFirstName?: string;
  eventTitle?: string;
  eventDescription?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  organizerName?: string;
  eventUrl?: string;
  tokensReward?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const EventInvitationEmail = ({
  userFirstName = "Utilisateur",
  eventTitle = "Événement communautaire",
  eventDescription = "Rejoignez-nous pour cet événement spécial.",
  eventDate = "15 décembre 2024",
  eventTime = "14h00",
  eventLocation = "Kinshasa, RDC",
  organizerName = "Organisateur",
  eventUrl = `${baseUrl}/events/123`,
  tokensReward = 100,
}: EventInvitationEmailProps) => (
  <EmailLayout preview={`Invitation : ${eventTitle}`}>
    <Heading style={emailStyles.h1}>Vous êtes invité, {userFirstName}</Heading>

    <Text style={emailStyles.paragraph}>
      {organizerName} vous invite à participer à l'événement suivant :
    </Text>

    <Text style={emailStyles.paragraph}>
      <strong>{eventTitle}</strong>
    </Text>

    <Text style={emailStyles.paragraph}>{eventDescription}</Text>

    <Text style={emailStyles.paragraph}>
      <strong>Date :</strong> {eventDate}
      <br />
      <strong>Heure :</strong> {eventTime}
      <br />
      <strong>Lieu :</strong> {eventLocation}
    </Text>

    <Button style={emailStyles.button} href={eventUrl}>
      Voir l'événement
    </Button>

    <Text style={emailStyles.smallText}>
      Si vous avez des difficultés à cliquer sur le bouton, copiez ce lien et
      collez-le dans votre navigateur :
    </Text>
    <Text style={emailStyles.paragraph}>
      <Link style={emailStyles.link} href={eventUrl}>
        {eventUrl}
      </Link>
    </Text>

    <Hr style={emailStyles.hr} />

    <Text style={emailStyles.paragraph}>
      En participant à cet événement, vous gagnerez{" "}
      <span style={emailStyles.primaryHighlight}>
        {tokensReward} tokens Oza
      </span>
      .
    </Text>

    <Text style={emailStyles.smallText}>
      Vous recevez cet email car vous faites partie de la communauté Be-ntc.
    </Text>

    <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
  </EmailLayout>
);

export default EventInvitationEmail;
