// TSV Data Loader for Real HLA Allele Frequencies
// Reads and parses TSV files from app/data folder

export interface HLAAlleleData {
  allele: string;
  frequency: number;
  population?: string;
}

export interface ParsedTSVData {
  [key: string]: HLAAlleleData[];
}

export function parseTSVContent(
  content: string,
  locus: string
): HLAAlleleData[] {
//   console.log(
//     `Parsing TSV content for ${locus}, content length: ${content.length}`
//   );

  const lines = content.trim().split("\n");
  if (lines.length < 2) {
    // console.warn(`TSV file for ${locus} has insufficient data`);
    return [];
  }

  const headers = lines[0].split("\t");
//   console.log(`TSV headers for ${locus}:`, headers);

  const alleleIndex = headers.findIndex((h) => h.toLowerCase() === "allele");
  const frequencyIndex = headers.findIndex(
    (h) => h.toLowerCase() === "alleles_over_2n"
  );
  const populationIndex = headers.findIndex(
    (h) => h.toLowerCase() === "population"
  );

  console.log(
    `Column indices for ${locus} - allele: ${alleleIndex}, frequency: ${frequencyIndex}, population: ${populationIndex}`
  );

  if (alleleIndex === -1 || frequencyIndex === -1) {
    // console.warn(
    //   `Could not find allele/frequency columns in ${locus} data`
    // );
    // console.warn(`Available headers:`, headers);
    return [];
  }

  const alleleData: HLAAlleleData[] = [];
  const alleleFrequencyMap = new Map<string, number[]>();

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split("\t");
    if (columns.length < Math.max(alleleIndex, frequencyIndex) + 1) continue;

    const allele = columns[alleleIndex]?.trim();
    const frequencyStr = columns[frequencyIndex]?.trim();
    // const population = columns[populationIndex]?.trim() || "Unknown";

    if (!allele || !frequencyStr) continue;

    const frequency = Number.parseFloat(frequencyStr);
    if (isNaN(frequency) || frequency <= 0) continue;

    if (!alleleFrequencyMap.has(allele)) {
      alleleFrequencyMap.set(allele, []);
    }
    alleleFrequencyMap.get(allele)!.push(frequency);
  }

  for (const [allele, frequencies] of alleleFrequencyMap.entries()) {
    const avgFrequency =
      frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;

    // Format allele name to standard HLA nomenclature
    const formattedAllele = formatHLAAllele(allele, locus);

    alleleData.push({
      allele: formattedAllele,
      frequency: avgFrequency,
    });
  }

  // Sort by frequency (highest first) and take top 30 for performance
  const sortedData = alleleData
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 30);

//   console.log(
//     `Successfully parsed ${sortedData.length} unique alleles for ${locus}`
//   );
//   console.log(`Top 5 alleles for ${locus}:`, sortedData.slice(0, 5));

  return sortedData;
}

function formatHLAAllele(allele: string, locus: string): string {
  // Remove any existing locus prefix
  let cleanAllele = allele.replace(/^(HLA-)?[A-Z]+\*?/i, "");

  // Ensure proper formatting
  if (!cleanAllele.includes(":")) {
    // Add colon if missing (e.g., "0101" -> "01:01")
    if (cleanAllele.length >= 4) {
      cleanAllele = cleanAllele.slice(0, 2) + ":" + cleanAllele.slice(2);
    }
  }

  // Add locus prefix
  return `${locus.toUpperCase()}*${cleanAllele}`;
}

export async function loadHLAData(): Promise<ParsedTSVData> {
  const hlaLoci = ["A", "B", "C", "DPA1", "DPB1", "DQA1", "DQB1", "DRB1"];
  const hlaData: ParsedTSVData = {};

//   console.log("Starting to load HLA data from TSV files...");

  for (const locus of hlaLoci) {
    try {
    //   console.log(`Attempting to load ${locus}.tsv...`);

      const response = await fetch(`/src/data/${locus}.tsv`);
      if (!response.ok) {
        // console.warn(
        //   `Could not load ${locus}.tsv file - HTTP ${response.status}`
        // );
        const altResponse = await fetch(`/data/${locus}.tsv`);
        if (!altResponse.ok) {
        //   console.warn(`Alternative path also failed for ${locus}.tsv`);
          continue;
        }
        const content = await altResponse.text();
        // console.log(
        //   `Loaded ${locus}.tsv from public/data, size: ${content.length} characters`
        // );
        hlaData[locus] = parseTSVContent(content, locus);
        continue;
      }

      const content = await response.text();
    //   console.log(
    //     `Loaded ${locus}.tsv content, size: ${content.length} characters`
    //   );

      hlaData[locus] = parseTSVContent(content, locus);

    //   console.log(
    //     `Loaded ${hlaData[locus].length} alleles for HLA-${locus}`
    //   );
    } catch (error) {
    //   console.error(`Error loading ${locus}.tsv:`, error);
    }
  }

//   console.log(
//     "Finished loading HLA data. Total loci loaded:",
//     Object.keys(hlaData).length
//   );
  return hlaData;
}

export function selectRandomAllele(alleleData: HLAAlleleData[]): string {
  if (!alleleData.length) return "Unknown";

  // Calculate total frequency
  const totalFreq = alleleData.reduce((sum, item) => sum + item.frequency, 0);

  // Generate random number
  const random = Math.random() * totalFreq;

  // Select allele based on weighted probability
  let currentSum = 0;
  for (const item of alleleData) {
    currentSum += item.frequency;
    if (random <= currentSum) {
      return item.allele;
    }
  }

  // Fallback to first allele
  return alleleData[0].allele;
}

export function selectPopulationSpecificAllele(
  alleleData: HLAAlleleData[],
  population: "caucasian" | "african" | "asian" | "hispanic"
): string {
  // For demo purposes, use different frequency distributions
  const populationModifier = {
    caucasian: 1.0,
    african: 0.8,
    asian: 0.6,
    hispanic: 0.7,
  }[population];

  // Modify frequencies based on population
  const modifiedData = alleleData.map((item) => ({
    ...item,
    frequency: item.frequency * populationModifier * (0.5 + Math.random()),
  }));

  return selectRandomAllele(modifiedData);
}
