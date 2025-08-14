import type { Donor, HLAProfile } from "./types"
import { HLA_ALLELES, BLOOD_TYPES, ORGAN_TYPES, LOCATIONS, FIRST_NAMES, LAST_NAMES } from "./hla-data"

// Generate random HLA profile
function generateRandomHLAProfile(): HLAProfile {
  const profile: HLAProfile = {
    "HLA-A": [getRandomAllele("HLA-A"), getRandomAllele("HLA-A")],
    "HLA-B": [getRandomAllele("HLA-B"), getRandomAllele("HLA-B")],
    "HLA-C": [getRandomAllele("HLA-C"), getRandomAllele("HLA-C")],
    "HLA-DRB1": [getRandomAllele("HLA-DRB1"), getRandomAllele("HLA-DRB1")],
    "HLA-DQB1": [getRandomAllele("HLA-DQB1"), getRandomAllele("HLA-DQB1")],
    "HLA-DPB1": [getRandomAllele("HLA-DPB1"), getRandomAllele("HLA-DPB1")],
  }
  return profile
}

function getRandomAllele(locus: keyof typeof HLA_ALLELES): string {
  const alleles = HLA_ALLELES[locus]
  return alleles[Math.floor(Math.random() * alleles.length)]
}

function getRandomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomDate(startDate: Date, endDate: Date): string {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = start + Math.random() * (end - start)
  return new Date(randomTime).toISOString().split("T")[0]
}

// Generate mock donor database
export function generateMockDonors(count = 500): Donor[] {
  const donors: Donor[] = []

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(FIRST_NAMES)
    const lastName = getRandomElement(LAST_NAMES)

    const donor: Donor = {
      id: `donor-${i + 1}`,
      name: `${firstName} ${lastName}`,
      age: Math.floor(Math.random() * 50) + 18, // 18-67 years old
      bloodType: getRandomElement(BLOOD_TYPES),
      organType: getRandomElement(ORGAN_TYPES),
      location: getRandomElement(LOCATIONS),
      hlaProfile: generateRandomHLAProfile(),
      registrationDate: generateRandomDate(new Date("2020-01-01"), new Date()),
      status: Math.random() > 0.1 ? "available" : getRandomElement(["matched", "unavailable"] as const),
    }

    donors.push(donor)
  }

  return donors
}
