// Mobile-friendly email styles for Be-ntc
const primaryColor = process.env.PRIMARY_COLOR || "#9e19b3";

export const emailStyles = {
  // Typography
  h1: {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 20px",
    textAlign: "left" as const,
    lineHeight: "32px",
  },

  h2: {
    color: "#1a1a1a",
    fontSize: "20px",
    fontWeight: "600",
    margin: "20px 0 16px",
    lineHeight: "28px",
  },

  h3: {
    color: "#1a1a1a",
    fontSize: "18px",
    fontWeight: "600",
    margin: "16px 0 12px",
    lineHeight: "24px",
  },

  paragraph: {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px",
    textAlign: "left" as const,
  },

  text: {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px",
    textAlign: "left" as const,
  },

  smallText: {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    margin: "16px 0 0",
    textAlign: "left" as const,
  },

  // Links
  link: {
    color: primaryColor,
    textDecoration: "none",
  },

  // Buttons
  button: {
    backgroundColor: primaryColor,
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 20px",
    margin: "16px 0",
  },

  // Simple sections without cards
  section: {
    margin: "20px 0",
  },

  centeredSection: {
    textAlign: "center" as const,
    margin: "20px 0",
    padding: "16px",
    backgroundColor: "#f6f9fc",
    borderRadius: "8px",
  },

  hr: {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  },

  // List items
  listItem: {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "8px 0",
    textAlign: "left" as const,
  },

  // Highlights
  primaryHighlight: {
    color: primaryColor,
    fontWeight: "600",
  },

  // Status indicators
  statusSuccess: {
    color: "#059669",
    backgroundColor: "#d1fae5",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    display: "inline-block",
  },

  // Simple token display
  tokenCard: {
    backgroundColor: primaryColor,
    borderRadius: "5px",
    padding: "20px",
    margin: "16px 0",
    textAlign: "center" as const,
  },

  tokenAmount: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 4px",
    lineHeight: "32px",
  },

  tokenLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "12px",
    fontWeight: "500",
    margin: "0",
    textTransform: "uppercase" as const,
  },

  // OTP Code
  otpCode: {
    backgroundColor: "#f6f9fc",
    borderRadius: "8px",
    color: primaryColor,
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "8px",
    padding: "0 24px",
    textAlign: "center" as const,
    fontFamily: "monospace",
    margin: "0 0",
  },
};
