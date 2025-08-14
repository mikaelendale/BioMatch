// HLA (Human Leukocyte Antigen) types for organ matching
export interface HLAProfile {
  "HLA-A": [string, string] // Two alleles
  "HLA-B": [string, string]
  "HLA-C": [string, string]
  "HLA-DRB1": [string, string]
  "HLA-DQB1": [string, string]
  "HLA-DPB1": [string, string]
}

export interface Donor {
  id: string
  name: string
  age: number
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  organType: "kidney" | "liver" | "heart" | "lung" | "pancreas"
  location: string
  hlaProfile: HLAProfile
  registrationDate: string
  status: "available" | "matched" | "unavailable"
}

export interface Recipient {
  id: string
  name: string
  age: number
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  organNeeded: "kidney" | "liver" | "heart" | "lung" | "pancreas"
  urgency: "low" | "medium" | "high" | "critical"
  hlaProfile: HLAProfile
  waitingSince: string
}

export interface MatchResult {
  donor: Donor
  compatibilityScore: number
  matchDetails: {
    exactMatches: number
    partialMatches: number
    mismatches: number
    bloodTypeCompatible: boolean
  }
  riskLevel: "low" | "medium" | "high"
}
