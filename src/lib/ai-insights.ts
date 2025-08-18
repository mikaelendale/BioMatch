import Groq from "groq-sdk";
import type { Donor } from "./mock-data";
import { calculatePredictiveScore } from "./matching-algorithm";
import { organTypes } from "./organ-types";

interface HLAData {
  hlaA: string;
  hlaB: string;
  hlaDR: string;
}
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateAIInsights(
  recipientHLA: HLAData,
  topMatches: Array<Donor & { compatibility: number }>,
  recipientAge = 45 // Default age if not provided
): Promise<string> {
  try {
    const enhancedMatches = topMatches.map((match) => {
      const predictiveData = calculatePredictiveScore(
        match.compatibility,
        match.age,
        recipientAge,
        match.organ
      );
      const organInfo = organTypes[match.organ.toLowerCase()];

      return {
        ...match,
        predictiveData,
        organInfo,
      };
    });

    const prompt = `You are an advanced AI transplant coordinator with expertise in predictive analytics, multi-organ transplantation, and personalized medicine.

Analyze the following comprehensive transplant data and provide advanced medical insights in structured JSON format:

RECIPIENT PROFILE:
- Age: ${recipientAge}
- HLA-A: ${recipientHLA.hlaA}
- HLA-B: ${recipientHLA.hlaB}
- HLA-DRB1: ${recipientHLA.hlaDR}

ENHANCED DONOR ANALYSIS:
${enhancedMatches
  .map(
    (match, index) => `
${index + 1}. Donor #${match.id} (${match.compatibility}% HLA compatibility)
   - Organ: ${match.organ} (${match.organInfo?.displayName || match.organ})
   - HLA Profile: ${match.hla.hlaA}, ${match.hla.hlaB}, ${match.hla.hlaDR}
   - Demographics: Age ${match.age}, ${match.bloodType}, ${match.location}
   - Donor Type: ${match.donorType || "Unknown"}
   - Organ Condition: ${match.organCondition || "Good"}
   - Predicted Success Rate: ${match.predictiveData.successProbability}%
   - Risk Factors: ${
     match.predictiveData.riskFactors.join(", ") || "None identified"
   }
   - Urgency Score: ${match.urgencyScore || "Standard"}
   - Preservation Time: ${
     match.preservationTime ? `${match.preservationTime}h` : "N/A"
   }
`
  )
  .join("")}

ORGAN-SPECIFIC CONSIDERATIONS:
${Array.from(new Set(topMatches.map((m) => m.organ)))
  .map((organ) => {
    const info = organTypes[organ.toLowerCase()];
    return info
      ? `- ${organ}: ${info.description} (Avg wait: ${info.averageWaitTime}, Threshold: ${info.compatibilityThreshold}%)`
      : `- ${organ}: Standard transplant protocols apply`;
  })
  .join("\n")}

Provide a comprehensive JSON response with this structure:

{
  "predictiveAnalytics": {
    "overallSuccessRate": "X% (range)",
    "bestMatch": {
      "donorId": "ID",
      "successProbability": "X%",
      "reasoning": "Why this is the optimal choice"
    },
    "riskStratification": {
      "low": ["Donor IDs with <20% risk"],
      "moderate": ["Donor IDs with 20-40% risk"],
      "high": ["Donor IDs with >40% risk"]
    }
  },
  "organSpecificInsights": {
    "primaryRecommendation": "Top organ/donor combination",
    "alternativeOptions": ["Secondary choices with rationale"],
    "organSpecificRisks": ["Risks specific to organ types available"]
  },
  "clinicalDecisionSupport": {
    "immediateActions": ["Urgent steps to take"],
    "additionalTesting": ["Required tests before proceeding"],
    "timelineConsiderations": ["Timing factors for each option"]
  },
  "personalized": {
    "ageFactors": "Impact of recipient age on outcomes",
    "hlaOptimization": "HLA-specific recommendations",
    "longTermPrognosis": "Expected 5-year outcomes"
  },
  "summary": "Executive summary for medical team decision-making"
}

Focus on:
- Machine learning-based outcome predictions
- Multi-organ transplant considerations
- Personalized risk assessment
- Real-time decision support
- Evidence-based recommendations
- Geographic and logistical factors

Maintain medical accuracy while providing actionable insights for transplant teams.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      max_tokens: 2000, // Increased for more comprehensive analysis
      temperature: 0.1, // Very low temperature for consistent medical analysisa
    });

    return (
      chatCompletion.choices[0]?.message?.content ||
      "Unable to generate insights at this time."
    );
  } catch (error) {
    console.error("Error generating AI insights:", error);
    throw new Error( 
      "Failed to generate AI insights. Please check your Groq API configuration."
    );
  }
}

export async function generateRealTimeRiskAssessment(
  compatibility: number,
  organType: string,
  urgencyScore: number
): Promise<{
  riskLevel: "low" | "moderate" | "high";
  riskScore: number;
  factors: string[];
  recommendations: string[];
}> {
  // Calculate risk score based on multiple factors
  let riskScore = 100 - compatibility; // Base risk from compatibility

  // Adjust for organ type
  const organRisk = {
    heart: 15,
    lung: 12,
    liver: 8,
    kidney: 5,
    pancreas: 10,
  };
  riskScore +=
    organRisk[organType.toLowerCase() as keyof typeof organRisk] || 5;

  // Adjust for urgency
  if (urgencyScore > 90) riskScore += 10; // High urgency increases risk
  if (urgencyScore < 50) riskScore -= 5; // Low urgency reduces risk

  // Determine risk level
  const riskLevel: "low" | "moderate" | "high" =
    riskScore < 25 ? "low" : riskScore < 50 ? "moderate" : "high";

  const factors: string[] = [];
  const recommendations: string[] = [];

  if (compatibility < 70) {
    factors.push("Suboptimal HLA compatibility");
    recommendations.push("Consider additional immunosuppression protocols");
  }

  if (urgencyScore > 85) {
    factors.push("High medical urgency");
    recommendations.push("Expedite pre-transplant workup");
  }

  if (
    organType.toLowerCase() === "heart" ||
    organType.toLowerCase() === "lung"
  ) {
    factors.push("Critical organ transplant");
    recommendations.push("Ensure specialized surgical team availability");
  }

  return {
    riskLevel,
    riskScore: Math.min(100, Math.max(0, riskScore)),
    factors,
    recommendations,
  };
}

export function predictTransplantOutcome(
  compatibility: number,
  donorAge: number,
  recipientAge: number,
  organType: string
): {
  oneYearSurvival: number;
  fiveYearSurvival: number;
  rejectionRisk: number;
  qualityOfLife: number;
} {
  // Simulated outcome prediction based on medical literature patterns
  let baseOneYear = 85 + compatibility * 0.15;
  let baseFiveYear = 70 + compatibility * 0.2;

  // Age adjustments
  const agePenalty = Math.max(
    0,
    (donorAge - 40) * 0.5 + (recipientAge - 50) * 0.3
  );
  baseOneYear -= agePenalty;
  baseFiveYear -= agePenalty * 1.5;

  // Organ-specific adjustments
  const organMultipliers = {
    kidney: { oneYear: 1.0, fiveYear: 1.0, rejection: 0.8 },
    liver: { oneYear: 0.95, fiveYear: 0.9, rejection: 0.7 },
    heart: { oneYear: 0.9, fiveYear: 0.8, rejection: 1.2 },
    lung: { oneYear: 0.85, fiveYear: 0.7, rejection: 1.3 },
    pancreas: { oneYear: 0.92, fiveYear: 0.85, rejection: 1.0 },
  };

  const multiplier = organMultipliers[
    organType.toLowerCase() as keyof typeof organMultipliers
  ] || {
    oneYear: 0.9,
    fiveYear: 0.8,
    rejection: 1.0,
  };

  const oneYearSurvival = Math.min(
    98,
    Math.max(60, baseOneYear * multiplier.oneYear)
  );
  const fiveYearSurvival = Math.min(
    95,
    Math.max(40, baseFiveYear * multiplier.fiveYear)
  );
  const rejectionRisk = Math.min(
    60,
    Math.max(5, (100 - compatibility) * multiplier.rejection)
  );
  const qualityOfLife = Math.min(95, Math.max(60, 70 + compatibility * 0.25));

  return {
    oneYearSurvival: Math.round(oneYearSurvival),
    fiveYearSurvival: Math.round(fiveYearSurvival),
    rejectionRisk: Math.round(rejectionRisk),
    qualityOfLife: Math.round(qualityOfLife),
  };
}
