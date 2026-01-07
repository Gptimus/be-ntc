import { Button, Heading, Hr, Link, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface SecurityAlertProps {
  userFirstName?: string;
  alertType?:
    | "login"
    | "password_change"
    | "email_change"
    | "suspicious_activity"
    | "device_added";
  location?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
  actionUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const SecurityAlertEmail = ({
  userFirstName = "Utilisateur",
  alertType = "login",
  // location = "Kinshasa, RDC",
  ipAddress = "192.168.1.1",
  userAgent = "Chrome sur Windows",
  timestamp = new Date().toLocaleString("fr-FR"),
  actionUrl = `${baseUrl}/security`,
}: SecurityAlertProps) => {
  const getAlertInfo = (type: string) => {
    switch (type) {
      case "login":
        return {
          title: "Nouvelle connexion détectée",
          message:
            "Une nouvelle connexion à votre compte Be-ntc a été détectée.",
        };
      case "password_change":
        return {
          title: "Mot de passe modifié",
          message: "Le mot de passe de votre compte Be-ntc a été modifié.",
        };
      case "email_change":
        return {
          title: "Email modifié",
          message: "L'adresse email de votre compte Be-ntc a été modifiée.",
        };
      case "suspicious_activity":
        return {
          title: "Activité suspecte détectée",
          message:
            "Une activité inhabituelle a été détectée sur votre compte Be-ntc.",
        };
      case "device_added":
        return {
          title: "Nouvel appareil ajouté",
          message: "Un nouvel appareil a été ajouté à votre compte Be-ntc.",
        };
      default:
        return {
          title: "Alerte de sécurité",
          message:
            "Une activité de sécurité a été détectée sur votre compte Be-ntc.",
        };
    }
  };

  const alertInfo = getAlertInfo(alertType);

  return (
    <EmailLayout preview={`Alerte sécurité : ${alertInfo.title}`}>
      <Heading style={emailStyles.h1}>{alertInfo.title}</Heading>

      <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

      <Text style={emailStyles.paragraph}>{alertInfo.message}</Text>

      <Text style={emailStyles.paragraph}>
        <strong>Détails de l'activité :</strong>
      </Text>
      <Text style={emailStyles.paragraph}>
        Date et heure : {timestamp}
        <br />
        {/*Localisation : {location}
        <br />*/}
        Adresse IP : {ipAddress}
        <br />
        Appareil : {userAgent}
      </Text>

      <Button style={emailStyles.button} href={actionUrl}>
        Vérifier l'activité
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
        <strong>Si ce n'était pas vous :</strong>
      </Text>
      <Text style={emailStyles.paragraph}>
        • Changez immédiatement votre mot de passe
        <br />
        • Vérifiez vos paramètres de sécurité
        <br />• Contactez notre équipe support
      </Text>

      <Text style={emailStyles.smallText}>
        Si cette activité vous semble normale, vous pouvez ignorer cet email.
      </Text>

      <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
    </EmailLayout>
  );
};

export default SecurityAlertEmail;
