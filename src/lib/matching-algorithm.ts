import type { HLAProfile } from "./mock-data";
import { calculateOrganSpecificCompatibility } from "./organ-types";

/**
 * Calculate HLA compatibility score between recipient and donor
 * This is a simplified version of actual HLA matching algorithms
 */
export function calculateCompatibility(
  recipientHLA: HLAProfile,
  donorHLA: HLAProfile,
  organType?: string
): number {
  let score = 0;
  let totalWeight = 0;

  // HLA-A matching (weight: 30%)
  const hlaAWeight = 30;
  if (recipientHLA.hlaA === donorHLA.hlaA) {
    score += hlaAWeight;
  } else if (isPartialMatch(recipientHLA.hlaA, donorHLA.hlaA)) {
    score += hlaAWeight * 0.6; // Partial match gets 60% of full score
  } else if (isCrossReactiveGroup(recipientHLA.hlaA, donorHLA.hlaA)) {
    score += hlaAWeight * 0.3; // Cross-reactive group gets 30%
  }
  totalWeight += hlaAWeight;

  // HLA-B matching (weight: 35%)
  const hlaBWeight = 35;
  if (recipientHLA.hlaB === donorHLA.hlaB) {
    score += hlaBWeight;
  } else if (isPartialMatch(recipientHLA.hlaB, donorHLA.hlaB)) {
    score += hlaBWeight * 0.6;
  } else if (isCrossReactiveGroup(recipientHLA.hlaB, donorHLA.hlaB)) {
    score += hlaBWeight * 0.3;
  }
  totalWeight += hlaBWeight;

  // HLA-DRB1 matching (weight: 35% - most important for long-term success)
  const hlaDRWeight = 35;
  if (recipientHLA.hlaDR === donorHLA.hlaDR) {
    score += hlaDRWeight;
  } else if (isPartialMatch(recipientHLA.hlaDR, donorHLA.hlaDR)) {
    score += hlaDRWeight * 0.6;
  } else if (isCrossReactiveGroup(recipientHLA.hlaDR, donorHLA.hlaDR)) {
    score += hlaDRWeight * 0.3;
  }
  totalWeight += hlaDRWeight;

  // Calculate final percentage
  const baseScore = Math.round((score / totalWeight) * 100);

  // Apply organ-specific adjustments if organ type is provided
  if (organType) {
    return calculateOrganSpecificCompatibility(
      recipientHLA,
      donorHLA,
      organType,
      baseScore
    );
  }

  // Add some randomness for demo purposes (±5%)
  const randomVariation = Math.floor(Math.random() * 11) - 5;
  return Math.max(0, Math.min(100, baseScore + randomVariation));
}

/**
 * Check if two HLA alleles are partial matches (same family, different subtypes)
 */
function isPartialMatch(allele1: string, allele2: string): boolean {
  // Extract the main allele group (e.g., A*02 from A*02:01)
  const group1 = allele1.split(":")[0];
  const group2 = allele2.split(":")[0];

  return group1 === group2 && allele1 !== allele2;
}

/**
 * Check if two HLA alleles belong to cross-reactive groups
 * This is a simplified version - real CRGs are more complex
 */
function isCrossReactiveGroup(allele1: string, allele2: string): boolean {
  const crossReactiveGroups = [
    // HLA-A cross-reactive groups
    ["A*01:01", "A*36:01"],
    ["A*02:01", "A*02:02", "A*02:03"],
    ["A*03:01", "A*11:01"],
    ["A*23:01", "A*24:02"],

    // HLA-B cross-reactive groups
    ["B*07:02", "B*42:01"],
    ["B*13:02", "B*44:03"],
    ["B*27:05", "B*27:02"],
    ["B*35:01", "B*53:01"],

    // HLA-DRB1 cross-reactive groups
    ["DRB1*01:01", "DRB1*10:01"],
    ["DRB1*03:01", "DRB1*11:01"],
    ["DRB1*04:01", "DRB1*04:02"],
    ["DRB1*15:01", "DRB1*16:01"],
  ];

  return crossReactiveGroups.some(
    (group) => group.includes(allele1) && group.includes(allele2)
  );
}

/**
 * Get detailed compatibility analysis
 */
export function getCompatibilityDetails(
  recipientHLA: HLAProfile,
  donorHLA: HLAProfile
) {
  const details = {
    hlaA: {
      recipient: recipientHLA.hlaA,
      donor: donorHLA.hlaA,
      match:
        recipientHLA.hlaA === donorHLA.hlaA
          ? "Perfect"
          : isPartialMatch(recipientHLA.hlaA, donorHLA.hlaA)
          ? "Partial"
          : isCrossReactiveGroup(recipientHLA.hlaA, donorHLA.hlaA)
          ? "Cross-Reactive"
          : "Mismatch",
    },
    hlaB: {
      recipient: recipientHLA.hlaB,
      donor: donorHLA.hlaB,
      match:
        recipientHLA.hlaB === donorHLA.hlaB
          ? "Perfect"
          : isPartialMatch(recipientHLA.hlaB, donorHLA.hlaB)
          ? "Partial"
          : isCrossReactiveGroup(recipientHLA.hlaB, donorHLA.hlaB)
          ? "Cross-Reactive"
          : "Mismatch",
    },
    hlaDR: {
      recipient: recipientHLA.hlaDR,
      donor: donorHLA.hlaDR,
      match:
        recipientHLA.hlaDR === donorHLA.hlaDR
          ? "Perfect"
          : isPartialMatch(recipientHLA.hlaDR, donorHLA.hlaDR)
          ? "Partial"
          : isCrossReactiveGroup(recipientHLA.hlaDR, donorHLA.hlaDR)
          ? "Cross-Reactive"
          : "Mismatch",
    },
  };

  return details;
}

/**
 * Calculate predictive score based on compatibility and other factors
 */
export function calculatePredictiveScore(
  compatibility: number,
  donorAge: number,
  recipientAge: number,
  organType: string
): {
  successProbability: number;
  riskFactors: string[];
  recommendations: string[];
} {
  let successProbability = compatibility;

  const riskFactors: string[] = [];
  const recommendations: string[] = [];

  // Age-based adjustments
  const ageDifference = Math.abs(donorAge - recipientAge);
  if (ageDifference > 20) {
    successProbability -= 5;
    riskFactors.push("Significant age difference");
    recommendations.push("Consider age-related complications");
  }

  // Donor age considerations
  if (donorAge > 60) {
    successProbability -= 8;
    riskFactors.push("Older donor");
    recommendations.push("Enhanced monitoring post-transplant");
  }

  // Recipient age considerations
  if (recipientAge > 65) {
    successProbability -= 5;
    riskFactors.push("Older recipient");
    recommendations.push("Comprehensive pre-transplant evaluation");
  }

  // Organ-specific adjustments
  switch (organType.toLowerCase()) {
    case "heart":
      if (compatibility < 80) {
        successProbability -= 10;
        riskFactors.push("Suboptimal HLA matching for cardiac transplant");
      }
      break;
    case "lung":
      if (compatibility < 75) {
        successProbability -= 8;
        riskFactors.push("HLA mismatch increases rejection risk");
      }
      break;
    case "liver":
      // Liver is more forgiving
      successProbability += 5;
      break;
  }

  // Ensure probability stays within bounds
  successProbability = Math.max(20, Math.min(95, successProbability));

  return {
    successProbability: Math.round(successProbability),
    riskFactors,
    recommendations,
  };
}
