// This variable holds the configuration for various call-to-action (CTA) links used in the HEERO Motors application.
// You can use this configuration to dynamically generate buttons or links that lead to specific actions, such as requesting a test drive, scheduling a consultation, or getting product information.
// These are rendered in the MessageList component when the AI provides a response that includes a CTA type.
// Adapt the type Message (ctaType) with the respective type from CTA_CONFIG to render the correct button.

export const CTA_CONFIG = {
  probefahrt: {
    label: "Probefahrt buchen",
    url: "https://www.heero-motors.de/probefahrt",
  },
  beratung: {
    label: "Kostenlose Beratung anfragen",
    url: "https://www.heero-motors.de/kontakt",
  },
  angebot: {
    label: "Angebot anfordern",
    url: "https://www.heero-motors.de/kontakt",
  },
  produkte: {
    label: "Alle Produkte entdecken",
    url: "https://www.heero-motors.de/produkte",
  },
  ebusse: {
    label: "eBusse ansehen",
    url: "https://www.heero-motors.de/elektrische-busse",
  },
  etransporter: {
    label: "eTransporter entdecken",
    url: "https://www.heero-motors.de/elektrische-nutzfahrzeuge",
  },
  foerderung: {
    label: "Förderung prüfen",
    url: "https://www.heero-motors.de/loesungen",
  },
} as const;