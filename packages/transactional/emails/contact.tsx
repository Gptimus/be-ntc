import { Heading, Hr, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface ContactProps {
  userName?: string;
  userEmail?: string;
  subject?: string;
  message?: string;
  category?: "support" | "bug" | "feature" | "business" | "other";
  ticketId?: string;
}

export const ContactEmail = ({
  userName = "Utilisateur",
  userEmail = "user@example.com",
  subject = "Demande de support",
  message = "Message de l'utilisateur",
  category = "support",
  ticketId = "TICKET-12345",
}: ContactProps) => {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "support":
        return "Support technique";
      case "bug":
        return "Signalement de bug";
      case "feature":
        return "Demande de fonctionnalité";
      case "business":
        return "Partenariat commercial";
      default:
        return "Autre";
    }
  };

  return (
    <EmailLayout preview={`Confirmation de votre message : ${subject}`}>
      <Heading style={emailStyles.h1}>Message reçu</Heading>

      <Text style={emailStyles.paragraph}>Bonjour {userName},</Text>

      <Text style={emailStyles.paragraph}>
        Nous avons bien reçu votre message et vous remercions de nous avoir
        contactés.
      </Text>

      <Text style={emailStyles.paragraph}>
        <strong>Numéro de ticket :</strong> {ticketId}
        <br />
        <strong>Catégorie :</strong> {getCategoryLabel(category)}
        <br />
        <strong>Sujet :</strong> {subject}
      </Text>

      <Hr style={emailStyles.hr} />

      <Text style={emailStyles.paragraph}>
        <strong>Votre message :</strong>
      </Text>
      <Text style={emailStyles.paragraph}>{message}</Text>

      <Hr style={emailStyles.hr} />

      <Text style={emailStyles.paragraph}>
        Notre équipe vous répondra dans les plus brefs délais à l'adresse :{" "}
        {userEmail}
      </Text>

      <Text style={emailStyles.smallText}>
        Temps de réponse habituel : 24-48 heures ouvrables.
      </Text>

      <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
    </EmailLayout>
  );
};

export default ContactEmail;
