export interface OrganType {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
  urgencyWeight: number;
  compatibilityThreshold: number;
  averageWaitTime: string;
  riskFactors: string[];
  specificRequirements: string[];
}

export const organTypes: Record<string, OrganType> = {
  kidney: {
    id: "kidney",
    name: "kidney",
    displayName: "Kidney",
    icon: "kidney",
    description: "Most common organ transplant with highest success rates",
    urgencyWeight: 0.7,
    compatibilityThreshold: 60,
    averageWaitTime: "3-5 years",
    riskFactors: ["Diabetes", "Hypertension", "Age over 65"],
    specificRequirements: [
      "ABO compatibility",
      "Crossmatch negative",
      "Size matching",
    ],
  },
  liver: {
    id: "liver",
    name: "liver",
    displayName: "Liver",
    icon: "liver",
    description: "Life-saving transplant with regenerative capabilities",
    urgencyWeight: 0.9,
    compatibilityThreshold: 50,
    averageWaitTime: "6-12 months",
    riskFactors: ["Hepatitis", "Cirrhosis", "Alcohol dependency"],
    specificRequirements: [
      "Size matching critical",
      "Blood type compatibility",
      "MELD score priority",
    ],
  },
  heart: {
    id: "heart",
    name: "heart",
    displayName: "Heart",
    icon: "heart",
    description: "Critical transplant requiring precise timing and matching",
    urgencyWeight: 1.0,
    compatibilityThreshold: 70,
    averageWaitTime: "6 months",
    riskFactors: [
      "Cardiomyopathy",
      "Coronary artery disease",
      "Previous cardiac surgery",
    ],
    specificRequirements: [
      "Size matching essential",
      "Geographic proximity",
      "Ischemic time <4 hours",
    ],
  },
  lung: {
    id: "lung",
    name: "lung",
    displayName: "Lung",
    icon: "lungs",
    description: "Complex transplant with strict compatibility requirements",
    urgencyWeight: 0.95,
    compatibilityThreshold: 75,
    averageWaitTime: "4-6 months",
    riskFactors: ["COPD", "Pulmonary fibrosis", "Cystic fibrosis"],
    specificRequirements: [
      "Size matching critical",
      "CMV status",
      "Smoking history consideration",
    ],
  },
  pancreas: {
    id: "pancreas",
    name: "pancreas",
    displayName: "Pancreas",
    icon: "pancreas",
    description: "Specialized transplant often combined with kidney",
    urgencyWeight: 0.8,
    compatibilityThreshold: 65,
    averageWaitTime: "1-2 years",
    riskFactors: [
      "Type 1 diabetes",
      "Diabetic complications",
      "Previous transplants",
    ],
    specificRequirements: [
      "HLA matching important",
      "Age considerations",
      "Simultaneous kidney evaluation",
    ],
  },
};

// SVG Icons for organs
export const organIcons = {
  kidney: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1.5 4.5 3 6 1 1 2 2 3 4 1-2 2-3 3-4 1.5-1.5 3-3.5 3-6 0-3.5-2.5-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>`,

  liver: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 8c0-2.2-1.8-4-4-4h-2c-1.1 0-2 .9-2 2v1H8c-2.2 0-4 1.8-4 4v5c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4V8zm-2 8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2v-5c0-1.1.9-2 2-2h4v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v8z"/>
  </svg>`,

  heart: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`,

  lungs: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2v8c0 1-1 2-2 2H8c-2 0-4 2-4 4v4c0 1 1 2 2 2h2c2 0 4-2 4-4v-6h4v6c0 2 2 4 4 4h2c1 0 2-1 2-2v-4c0-2-2-4-4-4h-2c-1 0-2-1-2-2V2h-4z"/>
  </svg>`,

  pancreas: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 4c-1 0-2 1-2 2v2c0 2-2 4-4 4s-4-2-4-4V6c0-1-1-2-2-2s-2 1-2 2v10c0 3 3 6 6 6h4c3 0 6-3 6-6V6c0-1-1-2-2-2z"/>
  </svg>`,
};

export function getOrganIcon(organName: string): string {
  const normalizedName = organName.toLowerCase();
  return (
    organIcons[normalizedName as keyof typeof organIcons] || organIcons.kidney
  );
}

export function calculateOrganSpecificCompatibility(
  recipientHLA: any,
  donorHLA: any,
  organType: string,
  baseCompatibility: number
): number {
  const organ = organTypes[organType.toLowerCase()];
  if (!organ) return baseCompatibility;

  // Apply organ-specific adjustments
  let adjustedScore = baseCompatibility;

  // Heart and lung require higher HLA matching
  if (
    organType.toLowerCase() === "heart" ||
    organType.toLowerCase() === "lung"
  ) {
    if (baseCompatibility < 70) {
      adjustedScore = baseCompatibility * 0.8; // Penalize low matches more heavily
    }
  }

  // Liver is more forgiving with HLA mismatches
  if (organType.toLowerCase() === "liver") {
    if (baseCompatibility < 60) {
      adjustedScore = baseCompatibility * 1.2; // Boost low matches
    }
  }

  // Kidney benefits from perfect DR matching
  if (organType.toLowerCase() === "kidney") {
    if (recipientHLA.hlaDR === donorHLA.hlaDR) {
      adjustedScore = Math.min(100, adjustedScore + 5); // Bonus for DR match
    }
  }

  return Math.round(Math.max(0, Math.min(100, adjustedScore)));
}
