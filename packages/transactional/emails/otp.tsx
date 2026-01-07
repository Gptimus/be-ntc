import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./components/layout";
import { emailStyles } from "./styles/email-styles";

interface OtpProps {
  userFirstName?: string;
  otpCode?: string;
  purpose?: "login" | "verification" | "transaction" | "security";
  type?: "signin" | "signup" | "delete";
  expiryMinutes?: number;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://be-ntc.com";

export const OtpEmail = ({
  userFirstName = "John Doe",
  otpCode = "123456",
  purpose = "login",
  type = "signin",
  expiryMinutes = 5,
}: OtpProps) => {
  const getPurposeText = (purpose: string, type: string) => {
    if (type === "delete") {
      return "confirmer la suppression de votre compte";
    }
    if (type === "signup") {
      return "vérifier votre inscription";
    }

    switch (purpose) {
      case "login":
        return "vous connecter à votre compte";
      case "verification":
        return "vérifier votre identité";
      case "transaction":
        return "confirmer votre transaction";
      case "security":
        return "sécuriser votre compte";
      default:
        return "compléter votre action";
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case "delete":
        return "Confirmation de suppression";
      case "signup":
        return "Code de vérification";
      default:
        return "Code de vérification";
    }
  };

  return (
    <EmailLayout preview={`Votre code de vérification Be-ntc : ${otpCode}`}>
      <Heading style={emailStyles.h1}>{getTitle(type)}</Heading>

      <Text style={emailStyles.paragraph}>Bonjour {userFirstName},</Text>

      <Text style={emailStyles.paragraph}>
        Utilisez ce code pour {getPurposeText(purpose, type)} :
      </Text>

      <Section style={emailStyles.centeredSection}>
        <Text style={emailStyles.otpCode}>{otpCode}</Text>
      </Section>

      <Text style={emailStyles.paragraph}>
        Ce code expire dans <strong>{expiryMinutes} minutes</strong>. Si vous
        n'avez pas demandé ce code, vous pouvez ignorer cet email en toute
        sécurité.
      </Text>

      <Hr style={emailStyles.hr} />

      <Section style={emailStyles.section}>
        <Heading style={emailStyles.h3}>Conseils de sécurité</Heading>
        <Text style={emailStyles.listItem}>
          • Ne partagez jamais ce code avec qui que ce soit
        </Text>
        <Text style={emailStyles.listItem}>
          • Be-ntc ne vous demandera jamais votre code par téléphone ou email
        </Text>
        <Text style={emailStyles.listItem}>
          • Si vous pensez que votre compte est compromis, contactez-nous
          immédiatement
        </Text>
      </Section>

      <Text style={emailStyles.paragraph}>
        Besoin d'aide ? Consultez notre{" "}
        <Link style={emailStyles.link} href={`${baseUrl}/support`}>
          centre d'aide
        </Link>{" "}
        ou contactez notre équipe support.
      </Text>

      <Text style={emailStyles.paragraph}>— L'équipe Be-ntc</Text>
    </EmailLayout>
  );
};

export default OtpEmail;
