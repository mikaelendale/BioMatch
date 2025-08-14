import type { Donor, Recipient, MatchResult, HLAProfile } from "./types"

// Blood type compatibility matrix
const BLOOD_COMPATIBILITY: Record<string, string[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal donor
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"], // Universal recipient
}

// Calculate HLA compatibility score
function calculateHLACompatibility(
  donorHLA: HLAProfile,
  recipientHLA: HLAProfile,
): {
  score: number
  exactMatches: number
  partialMatches: number
  mismatches: number
} {
  let exactMatches = 0
  let partialMatches = 0
  let mismatches = 0

  const loci = Object.keys(donorHLA) as (keyof HLAProfile)[]

  for (const locus of loci) {
    const donorAlleles = donorHLA[locus]
    const recipientAlleles = recipientHLA[locus]

    // Check for exact matches (both alleles match)
    if (
      (donorAlleles[0] === recipientAlleles[0] && donorAlleles[1] === recipientAlleles[1]) ||
      (donorAlleles[0] === recipientAlleles[1] && donorAlleles[1] === recipientAlleles[0])
    ) {
      exactMatches += 2
    } else {
      // Check for partial matches (one allele matches)
      let locusPartialMatches = 0

      if (donorAlleles.includes(recipientAlleles[0])) locusPartialMatches++
      if (donorAlleles.includes(recipientAlleles[1])) locusPartialMatches++

      partialMatches += locusPartialMatches
      mismatches += 2 - locusPartialMatches
    }
  }

  // Calculate weighted score (exact matches worth more)
  const totalPossibleMatches = loci.length * 2
  const score = ((exactMatches * 2 + partialMatches) / (totalPossibleMatches * 2)) * 100

  return {
    score: Math.round(score * 100) / 100,
    exactMatches,
    partialMatches,
    mismatches,
  }
}

// Check blood type compatibility
function isBloodTypeCompatible(donorType: string, recipientType: string): boolean {
  return BLOOD_COMPATIBILITY[donorType]?.includes(recipientType) || false
}

// Calculate risk level based on compatibility
function calculateRiskLevel(compatibilityScore: number, bloodTypeCompatible: boolean): "low" | "medium" | "high" {
  if (!bloodTypeCompatible) return "high"
  if (compatibilityScore >= 80) return "low"
  if (compatibilityScore >= 60) return "medium"
  return "high"
}

// Main matching function
export function findMatches(recipient: Recipient, donors: Donor[]): MatchResult[] {
  const matches: MatchResult[] = []

  for (const donor of donors) {
    // Skip if organ type doesn't match or donor is unavailable
    if (donor.organType !== recipient.organNeeded || donor.status !== "available") {
      continue
    }

    const bloodTypeCompatible = isBloodTypeCompatible(donor.bloodType, recipient.bloodType)
    const hlaCompatibility = calculateHLACompatibility(donor.hlaProfile, recipient.hlaProfile)

    const matchResult: MatchResult = {
      donor,
      compatibilityScore: hlaCompatibility.score,
      matchDetails: {
        exactMatches: hlaCompatibility.exactMatches,
        partialMatches: hlaCompatibility.partialMatches,
        mismatches: hlaCompatibility.mismatches,
        bloodTypeCompatible,
      },
      riskLevel: calculateRiskLevel(hlaCompatibility.score, bloodTypeCompatible),
    }

    matches.push(matchResult)
  }

  // Sort by compatibility score (highest first)
  return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
}

// Get top matches with minimum compatibility threshold
export function getTopMatches(recipient: Recipient, donors: Donor[], limit = 10, minCompatibility = 30): MatchResult[] {
  const allMatches = findMatches(recipient, donors)
  return allMatches.filter((match) => match.compatibilityScore >= minCompatibility).slice(0, limit)
}
