import {
  generateRealisticHLASync,
  generatePopulationSpecificHLAFromTSV,
} from "./real-hla-data";

export interface HLAProfile {
  hlaA: string;
  hlaB: string;
  hlaDR: string;
}

export interface Donor {
  id: string;
  age: number;
  bloodType: string;
  organ: string;
  location: string;
  hla: HLAProfile;
  medicalStatus: string;
  availability: string;
  urgencyScore?: number;
  donorType: "living" | "deceased";
  organCondition: "excellent" | "good" | "fair";
  preservationTime?: number; // hours for deceased donors
}

// Common HLA alleles for realistic data generation
// const commonHLAAlleles = {
//   hlaA: [
//     "A*01:01",
//     "A*02:01",
//     "A*03:01",
//     "A*11:01",
//     "A*23:01",
//     "A*24:02",
//     "A*26:01",
//     "A*29:02",
//     "A*30:01",
//     "A*31:01",
//     "A*32:01",
//     "A*33:01",
//     "A*68:01",
//     "A*68:02",
//     "A*69:01",
//     "A*74:01",
//   ],
//   hlaB: [
//     "B*07:02",
//     "B*08:01",
//     "B*13:02",
//     "B*14:02",
//     "B*15:01",
//     "B*18:01",
//     "B*27:05",
//     "B*35:01",
//     "B*38:01",
//     "B*39:01",
//     "B*40:01",
//     "B*44:02",
//     "B*44:03",
//     "B*49:01",
//     "B*50:01",
//     "B*51:01",
//     "B*52:01",
//     "B*53:01",
//     "B*55:01",
//     "B*56:01",
//     "B*57:01",
//     "B*58:01",
//   ],
//   hlaDR: [
//     "DRB1*01:01",
//     "DRB1*03:01",
//     "DRB1*04:01",
//     "DRB1*07:01",
//     "DRB1*08:01",
//     "DRB1*09:01",
//     "DRB1*10:01",
//     "DRB1*11:01",
//     "DRB1*12:01",
//     "DRB1*13:01",
//     "DRB1*14:01",
//     "DRB1*15:01",
//     "DRB1*16:01",
//   ],
// };

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const organs = ["Kidney", "Liver", "Heart", "Lung", "Pancreas"];
const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "El Paso, TX",
  "Nashville, TN",
  "Detroit, MI",
  "Oklahoma City, OK",
];
// const medicalStatuses = ["Excellent", "Good", "Fair", "Stable"];
// const availabilities = ["Available", "Pending", "Reserved"];
// const organConditions = ["excellent", "good", "fair"] as const;
// const donorTypes = ["living", "deceased"] as const;

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomHLA(): HLAProfile {
  console.log("Generating HLA profile using real TSV data");
  const hlaProfile = generateRealisticHLASync();
  console.log("Generated HLA profile:", hlaProfile);
  return hlaProfile;
}

export function generateMockDonors(count: number): Donor[] {
  console.log(`Generating ${count} mock donors using real HLA data`);
  const donors: Donor[] = [];

  for (let i = 1; i <= count; i++) {
    const availability =
      Math.random() > 0.8
        ? getRandomElement(["Pending", "Reserved"])
        : "Available";
    const medicalStatus =
      Math.random() > 0.9
        ? "Fair"
        : getRandomElement(["Excellent", "Good", "Stable"]);
    const organ = getRandomElement(organs);
    const donorType =
      organ === "Kidney" && Math.random() > 0.7 ? "living" : "deceased";
    const organCondition =
      Math.random() > 0.8 ? "fair" : Math.random() > 0.5 ? "good" : "excellent";

    // Calculate urgency score based on organ type and condition
    const baseUrgency =
      organ === "Heart"
        ? 95
        : organ === "Lung"
        ? 90
        : organ === "Liver"
        ? 85
        : 70;
    const conditionModifier =
      organCondition === "excellent" ? 10 : organCondition === "good" ? 5 : -5;
    const urgencyScore = Math.min(
      100,
      Math.max(
        0,
        baseUrgency + conditionModifier + Math.floor(Math.random() * 10) - 5
      )
    );

    const hlaProfile = generateRandomHLA();

    donors.push({
      id: `D${i.toString().padStart(4, "0")}`,
      age: Math.floor(Math.random() * (65 - 18) + 18),
      bloodType: getRandomElement(bloodTypes),
      organ,
      location: getRandomElement(locations),
      hla: hlaProfile,
      medicalStatus,
      availability,
      urgencyScore,
      donorType,
      organCondition,
      preservationTime:
        donorType === "deceased"
          ? Math.floor(Math.random() * 12) + 1
          : undefined,
    });
  }

  console.log(
    `Successfully generated ${donors.length} donors with real HLA data`
  );
  console.log(
    "Sample donor HLA profiles:",
    donors.slice(0, 3).map((d) => ({ id: d.id, hla: d.hla }))
  );
  return donors;
}

export function generateHighCompatibilityDonors(
  recipientHLA: HLAProfile,
  count = 5
): Donor[] {
  console.log(
    `Generating ${count} high compatibility donors for recipient:`,
    recipientHLA
  );
  const donors: Donor[] = [];

  for (let i = 1; i <= count; i++) {
    // Create donors with some matching HLA alleles using realistic frequencies
    const baseHLA = generateRandomHLA();
    const matchingHLA: HLAProfile = {
      hlaA: Math.random() > 0.3 ? recipientHLA.hlaA : baseHLA.hlaA,
      hlaB: Math.random() > 0.3 ? recipientHLA.hlaB : baseHLA.hlaB,
      hlaDR: Math.random() > 0.3 ? recipientHLA.hlaDR : baseHLA.hlaDR,
    };

    console.log(
      `Generated high compatibility donor ${i} HLA:`,
      matchingHLA
    );

    donors.push({
      id: `HC${i.toString().padStart(3, "0")}`,
      age: Math.floor(Math.random() * (55 - 25) + 25),
      bloodType: getRandomElement(bloodTypes),
      organ: getRandomElement(organs),
      location: getRandomElement(locations),
      hla: matchingHLA,
      medicalStatus: "Excellent",
      availability: "Available",
      urgencyScore: undefined,
      donorType: "living",
      organCondition: "excellent",
      preservationTime: undefined,
    });
  }

  console.log(`Generated ${donors.length} high compatibility donors`);
  return donors;
}

export async function generatePopulationSpecificDonorsAsync(
  population: "caucasian" | "african" | "asian" | "hispanic",
  count: number
): Promise<Donor[]> {
  const donors: Donor[] = [];

  for (let i = 1; i <= count; i++) {
    const availability =
      Math.random() > 0.8
        ? getRandomElement(["Pending", "Reserved"])
        : "Available";
    const medicalStatus =
      Math.random() > 0.9
        ? "Fair"
        : getRandomElement(["Excellent", "Good", "Stable"]);
    const organ = getRandomElement(organs);
    const donorType =
      organ === "Kidney" && Math.random() > 0.7 ? "living" : "deceased";
    const organCondition =
      Math.random() > 0.8 ? "fair" : Math.random() > 0.5 ? "good" : "excellent";

    const baseUrgency =
      organ === "Heart"
        ? 95
        : organ === "Lung"
        ? 90
        : organ === "Liver"
        ? 85
        : 70;
    const conditionModifier =
      organCondition === "excellent" ? 10 : organCondition === "good" ? 5 : -5;
    const urgencyScore = Math.min(
      100,
      Math.max(
        0,
        baseUrgency + conditionModifier + Math.floor(Math.random() * 10) - 5
      )
    );

    const hla = await generatePopulationSpecificHLAFromTSV(population);

    donors.push({
      id: `${population.toUpperCase().slice(0, 2)}${i
        .toString()
        .padStart(3, "0")}`,
      age: Math.floor(Math.random() * (65 - 18) + 18),
      bloodType: getRandomElement(bloodTypes),
      organ,
      location: getRandomElement(locations),
      hla,
      medicalStatus,
      availability,
      urgencyScore,
      donorType,
      organCondition,
      preservationTime:
        donorType === "deceased"
          ? Math.floor(Math.random() * 12) + 1
          : undefined,
    });
  }

  return donors;
}
