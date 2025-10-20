// Configuration for HEERO Motors chatbot - example prompts and vehicle data structure
// This file contains suggested prompts and structures for future integration

export const HEERO_EXAMPLE_PROMPTS = [
  "Wie hoch ist die Reichweite des eTransporters?",
  "Welche Förderungen gibt es für Elektrofahrzeuge?",
  "Wie kann ich meine Sprinter-Flotte elektrifizieren?",
  "Wie viele Passagiere passen in den HEERO Minibus?",
  "Wie viel CO2 kann ich mit HEERO einsparen?",
  "Was kostet eine Umrüstung auf eDrive?",
  "Welche Ladeinfrastruktur brauche ich?",
  "Wie funktioniert Diesel-to-Electric?",
] as const;

// Structure for vehicle specifications that could be returned by the AI
export type VehicleSpec = {
  name: string;
  type: "bus" | "transporter" | "pritsche" | "spezial";
  range: string;
  batteryCapacity: string;
  chargingPower: string;
  passengers?: number;
  loadCapacity?: string;
  features: string[];
  basePrice?: string;
  conversionPrice?: string;
};

// Example vehicle data structure for future API integration
export const EXAMPLE_VEHICLES: VehicleSpec[] = [
  {
    name: "HEERO eTransporter",
    type: "transporter",
    range: "bis zu 250km",
    batteryCapacity: "50kWh",
    chargingPower: "80kW",
    loadCapacity: "bis zu 3,5t",
    features: ["Schnellladung", "GPS Tracking", "Predictive Maintenance"],
    conversionPrice: "ab 45.000€"
  },
  {
    name: "HEERO eMinibus Mittelniederflur",
    type: "bus", 
    range: "bis zu 200km",
    batteryCapacity: "50kWh",
    chargingPower: "80kW",
    passengers: 22,
    features: ["Barrierefrei", "Klimaanlage", "USB-Ladeplätze"],
    basePrice: "ab 85.000€"
  },
  {
    name: "HEERO ePritsche DOKA",
    type: "pritsche",
    range: "bis zu 250km", 
    batteryCapacity: "50kWh",
    chargingPower: "80kW",
    loadCapacity: "bis zu 3,5t",
    features: ["Doppelkabine", "Pritschaufbau", "Anhängerkupplung"],
    conversionPrice: "ab 50.000€"
  }
];

// Possible chat response templates for structured data
export const RESPONSE_TEMPLATES = {
  vehicleComparison: `
    <div class="vehicle-comparison">
      <h3>Fahrzeugvergleich</h3>
      <!-- Vehicle cards would be rendered here -->
    </div>
  `,
  specifications: `
    <div class="specifications">
      <h3>Technische Daten</h3>
      <!-- Spec table would be rendered here -->
    </div>
  `,
  costCalculation: `
    <div class="cost-calculation">
      <h3>Kostenberechnung</h3>
      <!-- Cost breakdown would be rendered here -->
    </div>
  `
} as const;
